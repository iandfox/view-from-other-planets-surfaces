<!--
 - Vue Component: ChartsViewer
 -     Views a bunch of charts
 -     
 -     Example usage:
 -         <ChartsViewer
 -             :charts="charts"
 -             :class-instance="new foo()" ((but probably declare a new foo() in `data` ofc)
 -             julian-day-start="12345"
 -             julian-day-end="67890"
 -             julian-day-step="0.1"
 -         ></ChartsViewer>
 - 
 - @created 2021-07-11
-->

<template>
	<div class="floating">
		<button @click="draw">Draw again</button>
	</div>
	
	<p><small>
		<div style="display: grid;">
			<strong>Last Update:</strong>&nbsp;
			<span>
				{{lastUpdated}}
				<br>
				<em><Timer :start-epoch="lastUpdatedEpoch"></Timer></em>
			</span>
		</div>
	</small></p>
	<div class="grid">
		<div class="graph" v-for="chart in charts">
			<div class="title"><small><code>({{chart.x === 'time' ? 't' : chart.x}}, {{chart.y}})</code></small> - {{chart.title}}</div>
			<canvas
				:id="'canvas_' + chart.y"
				width="1366"
				height="768"
				:ref="'canvas_' + chart.y"
			></canvas>
			<details v-if="chart.description">
				<summary><small>Description</small></summary>
				{{chart.description}}
			</details>
		</div>
	</div>
</template>

<script>
	import Timer from './Timer';
	export default {
		name: 'ChartsViewer',
		components: {Timer},
		props: {
			charts: {
				type: Array,
				required: false,
				default: [],
			},
			
			classInstance: {
				type: Object,
				required: true,
			},
			
			julianDayStart: {
				type: Number,
				required: false,
				default: 0,
			},
			
			julianDayEnd: {
				type: Number,
				required: false,
				default: 1,
			},
			
			julianDayStep: {
				type: Number,
				required: false,
				default: 1 / 24,
			}
		},
		
		data() {
			return {
				lastUpdatedEpoch: Date.now(),
				lastUpdated: '',
				
				numberFormat: new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}
				),
			}
		},
		
		mounted() {
			this.draw();
		},
		
		computed: {
			o() {
				// "o" is too short and vague to be used as an arg. i'd have no idea wtf to put in it. but "classInstance" is wayyy too long to type over and over. This is my compromise :shrug:
				return this.classInstance;
			},
		},
		
		methods: {
			draw() {
				this.lastUpdated = (new Date()).toString();
				console.group('Drawing charts at ' + this.lastUpdated);
				
				this.charts.forEach((chart) => {
					this.drawChart(chart);
				});
				
				console.groupEnd();
			},
			
			// draw a fresh chart
			drawChart(chart) {
				const canvas = this.$refs['canvas_' + chart.y];
				const ctx = canvas.getContext('2d');
				
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				
				// Abstracted into a different method so i can easily graph from different slugs
				this.drawValuesOnChart(chart, chart.x, chart.y);
			},
			
			// draw on a chart that potentially already has stuff on it
			drawValuesOnChart(chart, xSlug = 'time', ySlug) {
				const canvas = this.$refs['canvas_' + chart.y];
				const ctx = canvas.getContext('2d');
				
				// Calculate all the points
				const x_values = [];
				const y_values = [];
				for (let JD = this.julianDayStart; JD <= this.julianDayEnd; JD += this.julianDayStep) {
					const t = JD - this.julianDayStart; // in days since the start
					this.o.JD = JD;
					
					if (xSlug === 'time') {
						x_values.push(t);
					} else {
						let val = this.o;
						const slugParts = xSlug.split('.'); // Account for, say, "heliocentric.x"
						for (let i = 0; i < slugParts.length; i++) {
							val = val[slugParts[i]];
						}
						x_values.push(val);
					}
					
					if (ySlug === 'time') {
						y_values.push(t);
					} else {
						let val = this.o;
						const slugParts = ySlug.split('.'); // Account for, say, "heliocentric.y"
						for (let i = 0; i < slugParts.length; i++) {
							val = val[slugParts[i]];
						}
						y_values.push(val);
					}
				}
				
				// Find the range for both
				const range_x = {min: Math.min(...x_values), max: Math.max(...x_values), length: null};
				range_x.length = range_x.max - range_x.min;
				
				const range_y = {min: Math.min(...y_values), max: Math.max(...y_values), length: null};
				// for degrees-based stuff, i want to see between 0 and 360 in the y-axis.
				if (chart.y.indexOf('_deg') !== -1) {
					range_y.min = Math.min(range_y.min, 0);
					range_y.max = Math.max(range_x.max, 360);
				}
				range_y.length = range_y.max - range_y.min;
				
				// Massage the ranges, in case they're too small
				// if (range_x.length < 0.1) { range_x.min *= 0.9; range_x.max *= 1.1; range_x.length = range_x.max - range_x.min; }
				// if (range_y.length < 0.1) { range_y.min *= 0.9; range_y.max *= 1.1; range_y.length = range_y.max - range_y.min; }
				
				// Coordinate transformations. For some reason the "FOO_TO_BAR" is easier for me to use than "BAR_PER_FOO" -- i always mix up the latter.
				const REAL_TO_CANVAS = {
					x: canvas.width / range_x.length,
					y: canvas.height / range_y.length,
				};
				const CANVAS_TO_REAL = {
					x: range_x.length / canvas.width,
					y: range_y.length / canvas.height,
				};
				
				// Use these two when plotting stuff.
				const range_x_canvas = {
					min: range_x.min * REAL_TO_CANVAS.x,
					max: range_x.max * REAL_TO_CANVAS.x,
				};
				const range_y_canvas = {
					min: range_y.min * REAL_TO_CANVAS.y,
					max: range_y.max * REAL_TO_CANVAS.y,
				};
				
				const axes = {
					x: {
						start: {x: range_x_canvas.min, y: range_y_canvas.min},
						end: {x: range_x_canvas.max, y: range_y_canvas.min},
					},
					y: {
						start: {x: range_x_canvas.min, y: range_y_canvas.min},
						end: {x: range_x_canvas.min, y: range_y_canvas.max},
					},
				};
				
				// Visualize the x- and y-axis if they should appear in the "middle" of the chart
				if (range_x.min < 0 && range_x.max > 0) {
					// y-axis should be vertically "centered"
					axes.y.start.y = 0;
					axes.y.end.y = 0;
				}
				if (range_y.min < 0 && range_y.max > 0) {
					// x-axis should be horizontally "centered"
					axes.x.start.y = 0;
					axes.x.end.y = 0;
				}
				
				// Transform the canvas so the chart will show
				ctx.save();
				ctx.translate(0, canvas.height); ctx.scale(1,-1); // cartesian coords
				ctx.translate(-1 * range_x.min * REAL_TO_CANVAS.x, -1 * range_y.min * REAL_TO_CANVAS.y);
				
				
				// Draw axes, which will reside behind the points
				ctx.lineWidth = 10;
				ctx.beginPath();
				// x-axis:
				ctx.moveTo(axes.x.start.x, axes.x.start.y);
				ctx.lineTo(axes.x.end.x, axes.x.end.y);
				// y-axis:
				ctx.moveTo(axes.y.start.x, axes.y.start.y);
				ctx.lineTo(axes.y.end.x, axes.y.end.y);
				ctx.stroke();
				
				// Plot the points
				const plotPoint = (x_real, y_real) => {
					const x_canvas = x_real * REAL_TO_CANVAS.x;
					const y_canvas = y_real * REAL_TO_CANVAS.y;
					
					/*
					// one pixel
					ctx.fillRect(x_canvas, y_canvas, size, size);
					*/
					
					// Small circle
					ctx.beginPath();
					const circleRadius = 20;
					ctx.arc(x_canvas, y_canvas, circleRadius, 0, 2 * Math.PI, false);
					ctx.fill();
				};
				
				ctx.fillStyle = 'red';
				
				
				const finishedDrawingPoints = () => {
					// Gotta do this after everything else has been plotted, or else it restores the ctx before the points can be drawn
					ctx.restore(); // from [cartesian], scale, and translate
					
					// Draw axis labels in "dumb"/obvious places.
					ctx.fillStyle = 'purple';
					ctx.font = '50px serif';
					
					ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
					ctx.fillText(`(${this.numberFormat.format(range_x.min)}, ${this.numberFormat.format(range_y.min)})`, 0, canvas.height); // bottom left
					ctx.textAlign = 'left'; ctx.textBaseline = 'top';
					ctx.fillText(`(${this.numberFormat.format(range_x.min)}, ${this.numberFormat.format(range_y.max)})`, 0, 0); // top left
					ctx.textAlign = 'right'; ctx.textBaseline = 'top';
					ctx.fillText(`(${this.numberFormat.format(range_x.max)}, ${this.numberFormat.format(range_y.max)})`, canvas.width, 0); // top right
					ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
					ctx.fillText(`(${this.numberFormat.format(range_x.max)}, ${this.numberFormat.format(range_y.min)})`, canvas.width, canvas.height); // bottom right
					
					
					
					// debug text. TODO: delete
					// ctx.font = '60px monospace';
					ctx.textAlign = 'center';
					ctx.textBaseline = 'bottom';
					ctx.fillText(JSON.stringify(range_x), canvas.width / 2, canvas.height / 2);
					ctx.fillText(JSON.stringify(range_y), canvas.width / 2, canvas.height / 2 + 35);
					
					
					
					// debug - draw a square in the top left, to ensure i know that things are actually working.
					ctx.fillStyle = `rgba(0, 0, 255, ${Math.random()})`; // TODO delete
					ctx.fillRect(50, 50, 50, 50); // TODO delete
				};
				
				const alphaStart = 0.1;
				const alphaEnd = 1;
				const alphaDelta = (alphaEnd - alphaStart) / x_values.length;
				const colorDelta = 255 / x_values.length;
				
				for (let i = 0; i < x_values.length; i++) {
					// ctx.globalAlpha = alphaStart + (i * alphaDelta); // "fade in" and from red to green as time goes on
					// setTimeout(() => {
					const xx = x_values[i];
					const yy = y_values[i];
					setTimeout(() => {
						ctx.fillStyle = `rgba(${255 - (i * colorDelta)}, ${i * colorDelta}, 0, ${alphaStart + (i * alphaDelta)})`;
						plotPoint(xx, yy);
						
						if (i >= x_values.length - 1) {
							// Gotta do this after everything else has been plotted, or else it restores the ctx before the points can be drawn
							finishedDrawingPoints();
						}
					}, 5 * i);
				}
				console.log({xSlug, ySlug, x_values, y_values}); // TODO delete eventually
				
				console.log({ // TODO delete
					canvas,
					range_x,
					range_y,
					REAL_TO_CANVAS,
					CANVAS_TO_REAL,
				});
			},
		},
		
	}
</script>

<style scoped>
	canvas {
		box-shadow: 0 0 5px 0 black;
		height: auto;
		max-width: 100%;
	}
	
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	}
	
	.graph {}
	.graph .title {
		background: var(--color-light);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.graph .title:not(:hover) {
		overflow: hidden;
	}
	
	.graph .title:hover {
		transform: translate3d(0,0,0);
		z-index: 10;
	}
	
	
	.floating {
		position: fixed;
		top: 10px;
		right: 10px;
		background: rgba(255, 255, 255, 0.5);
		padding: var(--length-medium);
		border: solid 1px black;
	}
</style>
