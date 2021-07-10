<!--
 - Vue Component: SC
 -     SolarCoordinates visualization
 -     
 -     Example usage:
 -         <SC></SC>
 - 
 - @created 2021-07-09
 - 
 - @since 2021-07-09
-->

<template>
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
			></canvas>
			<details v-if="chart.description">
				<summary><small>Description</small></summary>
				{{chart.description}}
			</details>
		</div>
	</div>
</template>

<script>
	import { SolarCoordinates } from '../calculations/SC.class';
	import Timer from './Timer';
	
	export default {
		name: 'SC',
		components: {Timer},
		
		mounted() {
			this.draw();
		},
		
		methods: {
			draw() {
				// console.clear();
				this.lastUpdated = (new Date()).toString();
				console.groupCollapsed('Drawing charts at ' + this.lastUpdated);
				this.charts.forEach((chart) => {
					const canvas = window['canvas_' + chart.y];
					const x_values = [];
					const y_values = [];
					for (let i = 0; i < 24; i++) {
						const t = i / 24; // in days
						const JD = this.julianDay + (t);
						this.sun.JD = JD;
						x_values.push(t);
						y_values.push(this.sun[chart.y]);
					}
					
					// Find the range for both
					const range_x = {min: Math.min(...x_values), max: Math.max(...x_values), length: null};
					range_x.length = range_x.max - range_x.min;
					const range_y = {min: Math.min(...y_values), max: Math.max(...y_values), length: null};
					range_y.length = range_y.max - range_y.min;
					
					// Coordinate transformations. For some reason the "FOO_TO_BAR" is easier for me to use than "BAR_PER_FOO" -- i always mix up the latter.
					const REAL_TO_CANVAS = {
						x: canvas.width / range_x.length,
						y: canvas.height / range_y.length,
					};
					const CANVAS_TO_REAL = {
						x: range_x.length / canvas.width,
						y: range_y.length / canvas.height,
					};
					
					
					
					
					console.log({
						canvas,
						range_x,
						range_y,
						REAL_TO_CANVAS,
						CANVAS_TO_REAL,
						'test_centerRealToCanvas': {
							x: REAL_TO_CANVAS.x * (range_x.min + 0.5 * range_x.length),
							y: REAL_TO_CANVAS.y * (range_y.min + 0.5 * range_y.length),
						},
					});
					
				});
				console.groupEnd();
			},
		},
		
		data() {
			return {
				lastUpdatedEpoch: Date.now(),
				lastUpdated: '',
				
				julianDay: 2459404.5,
				
				/**
				 * getJulianDay(2021, 07, 09) = 2459404.5
				 */
				sun: new SolarCoordinates(2459404.5),
				
				charts: [
					{x: 'time', y: 'L0_deg', title: 'geometric mean longitude', description: 'The geometric mean longitude of the Sun, referred to the mean equinox of the date'},
					{x: 'time', y: 'M_deg', title: 'Mean anomaly of the Sun', description: 'Mean anomaly of the Sun. (This is the same as the mean anomaly of the Earth.)'},
					{x: 'time', y: 'e', title: 'eccentricity', description: 'Eccentricity of the Earth\'s orbit'},
					{x: 'time', y: 'C_deg', title: 'Sun\'s equation of center', description: ''},
					{x: 'time', y: 'L_deg', title: 'Sun\'s true longitude, Lambda', description: 'Sun\'s true longitude, Lambda. aka "true geometric longitude referred to the mean equinox of the date."  "This is the quantity required for instance in the calculation of geocentric planetary positions"'},
					{x: 'time', y: 'v_deg', title: 'Sun\'s true anomaly', description: ''},
					
					{x: 'time', y: 'R', title: 'Sun\'s radius vector', description: 'Sun\'s radius vector -- the distance between the centers of the Sun and the Earth, expressed in astronomical units'},
					
					{x: 'time', y: 'l_deg', title: 'apparent longitude, lambda, of the sun', description: 'the apparent longitude, lambda, of the sun, referred to the true equinox of the date.'},
					
					{x: 'time', y: 'ecl_deg', title: 'obliquity, epsilon, of the ecliptic', description: 'The obliquity, epsilon, of the ecliptic, or inclination of the Earth\'s axis of rotation, is the angle between the equator and the ecliptic'},
					
					{x: 'time', y: 'RA', title: 'Sun\'s right ascension, alpha.', description: '(Sun\'s latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)'},
					
					{x: 'time', y: 'Decl', title: 'Sun\'s declination, delta.', description: ''},
					
					{x: 'time', y: 'RA_apparent', title: '"apparent" position of sun :shrug:', description: ''},
					
					{x: 'time', y: 'Decl_apparent', title: '"apparent" position of sun :shrug:', description: ''},
					{x: 'time', y: 'RA_deg', title: 'Sun\'s right ascension, alpha.', description: '(Sun\'s latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)'},
					{x: 'time', y: 'Decl_deg', title: 'Sun\'s declination, delta.', description: ''},
				],
			};
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
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
</style>
