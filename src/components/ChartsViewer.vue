<!--
 - Vue Component: ChartsViewer
 -     Views a bunch of charts
 -     
 -     Example usage:
 -         <ChartsViewer
 -             :name="Foo"
 -             :charts="charts"
 -             :class-instance="new foo()" ((but probably declare a new foo() in `data` ofc)
 -             julian-day-start="12345"
 -             julian-day-end="67890"
 -             julian-day-step="0.1"
 -             :delay-ms="5"
 -         ></ChartsViewer>
 - 
 - @created 2021-07-11
-->

<template>
	<teleport to="#floating-controls">
		<button @click="draw" :disabled="isDrawing">
			<span v-if="isDrawing">{{name}} has {{isDrawing}} drawings in progress...</span>
			<span v-else>Draw {{name}} Again</span>
		</button>
		<br>
		<div class="range-wrapper">
			<label>Julian Day: +{{numberFormat.format(julianDay - julianDayStart)}}</label>
			<input
				type="range"
				v-model.number="julianDay"
				:min="julianDayStart"
				:max="julianDayEnd"
				:step="julianDayStep"
			/>
			<span class="min">+{{numberFormat.format(0)}} days</span>
			<span class="max">+{{numberFormat.format(julianDayEnd - julianDayStart)}} days</span>
			<span class="value">
				{{numberFormat.format(julianDay)}}
				<br>
				<small><code>[+<span class="number__adhd-issues">{{numberFormat.format(julianDay - julianDayStart)}}</span> :: <span class="number__adhd-issues">{{numberFormat.format(Math.floor(julianDay - julianDayStart))}}</span> days and <span class="number__adhd-issues">{{numberFormat.format(((julianDay - julianDayStart) % 1) * 24)}}</span> hours]</code></small>
			</span>
		</div>
		<div class="range-wrapper" v-if="isDelayed">
			<label>Delay:</label>
			<input
				type="range"
				v-model.number="delayMs"
				:min="1"
				:max="200"
				:step="1"
			/>
			<span class="min">{{1}} ms</span>
			<span class="max">{{200}} ms</span>
			<span class="value">
				{{delayMs}} ms
			</span>
		</div>
	</teleport>
	
	
	<h3>{{name}}</h3>
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
		<div class="graph" v-for="(chart, index) in charts">
			<div class="title"><small><code>({{chart.x === 'time' ? 't' : chart.x}}, {{chart.y}})</code></small> - {{chart.title}}</div>
			<canvas
				:id="'canvas_' + chart.y + '__' + index"
				width="1366"
				height="768"
				:ref="'canvas_' + chart.y + '__' + index"
			></canvas>
			<details v-if="chart.description">
				<summary><small>Description</small></summary>
				{{chart.description}}
			</details>
		</div>
	</div>
</template>

<script>
	import { toRaw } from 'vue';
	import Timer from './Timer';
	import {ChartDrawer} from '../calculations/ChartDrawer.class';
	export default {
		name: 'ChartsViewer',
		components: {Timer},
		props: {
			name: String,
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
			},
			
			isDelayed: {
				type: Boolean,
				required: false,
				default: false,
			},
			
			delayMs: {
				type: Number,
				required: false,
				default: 50,
			}
		},
		
		data() {
			return {
				julianDay: 2459404.5,
				
				julianDayHistory: [],
				maxJulianDayHistoryLength: 100,
				
				isDrawing: 0,
				
				lastUpdatedEpoch: Date.now(),
				lastUpdated: '',
				
				numberFormat: new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}
				),
				
				drawers: [],
				
				charts_processed: [],
			}
		},
		
		mounted() {
			this.charts_processed = this.charts.map((chart, index) => {
				chart.canvasId = 'canvas_' + chart.y + '__' + index;
				chart.jdHistory = [];
				
				const {x_values, y_values, jd_values} = this.extractCoordinates(this.julianDayStart, this.julianDayEnd, this.julianDayStep, chart.x, chart.y);
				
				chart.drawer = new ChartDrawer(this.$refs[chart.canvasId], chart, x_values, y_values, jd_values);
				
				return chart;
			});
			
			this.julianDay = this.julianDayStart;
			
			this.draw();
		},
		
		computed: {
			o() {
				// "o" is too short and vague to be used as an arg. i'd have no idea wtf to put in it. but "classInstance" is wayyy too long to type over and over. This is my compromise :shrug:
				return this.classInstance;
			},
		},
		
		watch: {
			julianDay() {
				// TODO 2021-07-12: track history.
				// this.charts.forEach((chart) => {
				// 	chart.jdHistory.push(this.julianDay);
				// 	if (chart.jdHistory.length > this.maxJulianDayHistoryLength) {
				// 		chart.jdHistory.shift();
				// 	}
				// });
				
				if (this.isDrawing > 0) {
					return;
				}
				
				// Delaying the drawing to the next animation frame improves FPS somewhat
				requestAnimationFrame(() => {
					// Draw current point. much less complex than the jdHistory and likely good enough for my current debug.
					this.charts.forEach((chart) => {
						const {x, y} = chart.drawer.getClosestJDCoords(this.julianDay);
						chart.drawer.ctx.fillStyle = 'purple';
						chart.drawer.plotPoint(x, y);
						// TODO 2021-07-12: draw history.
					});
				});
			}
		},
		
		methods: {
			draw() {
				if (this.isDrawing > 0) {
					console.log('tried to draw while drawing was in progress, aborting.');
					return;
				}
				
				this.lastUpdated = (new Date()).toString();
				console.group('Drawing charts at ' + this.lastUpdated);
				
				this.charts_processed.forEach((chart) => {
					this.isDrawing += 1;
					
					chart.drawer.clearCanvas();
					chart.drawer.drawAxes();
					chart.drawer.drawAxisLabels();
					
					const alphaStart = 0.1;
					const alphaEnd = 1;
					const alphaDelta = (alphaEnd - alphaStart) / chart.drawer.x_values.length;
					const colorDelta = 255 / chart.drawer.x_values.length;
					const colorFunction = (index) => `rgba(${255 - (index * colorDelta)}, ${index * colorDelta}, 0, ${alphaStart + (index * alphaDelta)})`;
					if (this.isDelayed) {
						chart.drawer.plotAllPointsDelayed(5, this.delayMs, colorFunction, () => {
							this.isDrawing -= 1;
						});
					} else {
						chart.drawer.plotAllPoints(
							10,
							// Colors: red to green
							colorFunction
						);
						
						this.isDrawing -= 1;
					}
				});
				
				console.groupEnd();
			},
			
			extractCoordinates(jdStart, jdEnd, jdStep, xSlug ='', ySlug = '') {
				// Calculate all the points
				const x_values = [];
				const y_values = [];
				const jd_values = [];
				for (let JD = this.julianDayStart; JD <= this.julianDayEnd; JD += this.julianDayStep) {
					const t = JD - this.julianDayStart; // in days since the start
					this.o.JD = JD;
					
					let newX = -1;
					let newY = -1;
					
					if (xSlug === 'time') {
						newX = t;
					} else {
						let val = this.o;
						const slugParts = xSlug.split('.'); // Account for, say, "heliocentric.x"
						for (let i = 0; i < slugParts.length; i++) {
							val = val[slugParts[i]];
						}
						newX = val;
					}
					
					if (ySlug === 'time') {
						newY = t;
					} else {
						let val = this.o;
						const slugParts = ySlug.split('.'); // Account for, say, "heliocentric.y"
						for (let i = 0; i < slugParts.length; i++) {
							val = val[slugParts[i]];
						}
						newY = val;
					}
					
					x_values.push(newX);
					y_values.push(newY);
					jd_values.push({JD, x: newX, y: newY});
					
				}
				
				return {
					x_values,
					y_values,
					jd_values
				}
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
	
	
	/* range slider related styles TODO 2021-07-11: this is a great idea for a generic/util component, i should turn it into one. Well... not me. You. Yes, you, Future Ian. :wave: */
	.range-wrapper {
		font-size: 11px;
		display: grid;
		grid-template-areas:
			" .  label  ."
			"min input max"
			" .   val   . "
		;
		grid-template-columns:
			minmax(50px, fit-content) minmax(200px, 1fr) minmax(50px, fit-content);
	}
	.range-wrapper label {
		font-weight: bold;
		grid-area: label;
		text-align: center;
	}
	.range-wrapper input[type="range"] {
		grid-area: input;
		
	}
	.range-wrapper .min {
		grid-area: min;
		text-align: right;
	}
	.range-wrapper .max {
		grid-area: max;
		text-align: left;
	}
	.range-wrapper .value {
		grid-area: val;
		text-align: center;
		min-width: 220px
	}
	.range-wrapper .value small code {
		display: inline-block;
	}
	.range-wrapper .value small code span {
		display: inline-block;
		min-width: 5ch;
		text-align: right;
	}
</style>
