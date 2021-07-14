<!--
 - Vue Component: ViewFromGround
 -     Like a stellarium in my browser.
 -     
 -     Example usage:
 -         <ViewFromGround></ViewFromGround>
 - 
 - @created 2021-07-13
-->

<template>
	<GroundControls
		v-model:config="config"
		v-bind:jd="JD"
		v-bind:sun="sun"
		v-bind:moons="moons"
		v-bind:planets="planets"
		@increase:jd="JD += $event"
		@update:obliquity="setObliquityOnBodies"
		@update:lnglat="setLocalLongLat"
	></GroundControls>
	
	<div class="space">
		<canvas width="1600" height="800" id="stars" ref="stars"></canvas>
		<canvas width="1600" height="800" id="space" ref="space"></canvas>
		<canvas width="1600" height="800" id="ground" ref="ground"></canvas>
	</div>
</template>

<script>
	import {MoonOrbitalBody} from '../calculations/OrbitalBodies/MoonOrbitalBody.class';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
	import {Space} from '../SpaceDrawing/Space.class';
	import { ref } from 'vue';
	import InputRange from './fields/InputRange';
	import ChartsViewer from './utils/ChartsViewer';
	import InputJulianDate from './fields/InputJulianDate';
	import ControlViewport from './view-controls/ControlViewport';
	import GroundControls from './view-controls/GroundControls';
	
	export default {
		name: 'ViewFromGround',
		components: {GroundControls, ControlViewport, InputJulianDate, ChartsViewer, InputRange},
		
		data() {
			return {
				space: null,
				
				numberFormat: new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: 4,
						maximumFractionDigits: 4
					}
				),
				
				config: {
					obliquity: 0,
					localLongitude: -111.01908142663117,
					localLatitude: 32.198840114469995,
					shouldDrawHorizon: true,
					shouldDrawSky: true,
					shouldDrawCompass: true,
					moonParams: [],
					
					isAuto: true,
					autoRate: 0.001,
					
					intervalIds: [],
					
					viewport: {
						bottom: -90,
						top:     90,
						left:   -180,
						right:   180,
					},
				},
			}
		},
		
		setup() {
			const JD   = ref(2459404.5); //ref(2459404.5);
			const moons = [
				// Earth's moon
				new MoonOrbitalBody(
					JD.value,
					{
						N: [125.1228, -0.0529538083],
						i: [5.1454, 0],
						w: [318.0634, 0.1643573223],
						a: [60.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [115.3654, 13.0649929509],
					},
					{
						color: 'grey',
						radius: 28,
					}
				),
				
				// Gomor
				new MoonOrbitalBody(
					JD.value,
					{
						N: [125.1228, -0.0529538083],
						i: [5.1454, 1],
						w: [8.0634, 0.1643573223],
						a: [1.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [300.3654, 13.0649929509],
					},
					{
						color: 'teal',
						radius: 40,
					}
				),
				
				// F'an
				new MoonOrbitalBody(
					JD.value,
					{
						N: [125.1228, -0.0529538083],
						i: [5.1454, 1],
						w: [318.0634, 0.1643573223],
						a: [60.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [0.3654, 53.0649929509],
					},
					{
						color: 'orange',
						radius: 10,
					}
				),
			];
			const sun  = new SunOrbitalBody(JD.value);
			const planets = [];
			
			return {
				JD,
				moons,
				sun,
				planets,
			}
		},
		
		computed: {
			viewport() { return this.config.viewport }
		},
		
		mounted() {
			// set initial reactive values
			this.config.obliquity = this.sun.ecl_param[0];
			this.moons.forEach((moon) => {
				this.config.moonParams.push(moon.params);
			});
			
			this.space = new Space(
				document.getElementById('stars'),
				document.getElementById('space'),
				document.getElementById('ground'),
				this.config.viewport,
				this.sun,
				this.moons,
				[] // planets
			);
			this.space.drawBackground(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			this.space.drawStars(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			this.draw();
		},
		
		
		watch: {
			JD() {
				this.space.JD = parseFloat(this.JD);
				this.draw();
			}
		},
		
		methods: {
			draw() {
				this.space.draw(this.config.shouldDrawHorizon, this.config.shouldDrawSky, this.config.shouldDrawCompass);
			},
			
			/**
			 * @since 2021-07-14
			 */
			setObliquityOnBodies() {
				const obliq = parseFloat(this.config.obliquity);
				[this.sun, ...this.moons, ...this.planets].forEach((ob) => {
					ob.ecl_param[0] = obliq;
				});
				
				if (! this.isAuto) {
					this.draw();
				}
			},
			
			/**
			 * @since 2021-07-14
			 */
			setMoonParam(moonIndex, slug, paramIndex = 0) {
				this.moons[moonIndex].params[slug][paramIndex] = this.config.moonParams[moonIndex][slug][paramIndex];
				
				if (! this.isAuto) {
					this.draw();
				}
			},
			
			/**
			 * @since 2021-07-14
			 */
			setLocalLongLat() {
				const lng = parseFloat(this.config.localLongitude),
					lat = parseFloat(this.config.localLatitude);
				[this.sun, ...this.moons, ...this.planets].forEach((ob) => {
					ob.azi.siderealTime.localLongitude_deg = lng;
					ob.azi.siderealTime.localLatitude_deg = lat;
				});
				
				if (! this.isAuto) {
					this.draw();
				}
			}
		},
	}
</script>

<style scoped>
	.space {
	}
	
	#space, #stars {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		display: block;
		
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
	}
	
	#stars {
		z-index: 10;
	}
	#space {
		z-index: 20;
	}
	#ground {
		z-index: 30
	}
</style>

<style>
	body {
		max-height: 100vh;
		max-width: 100vw;
		overflow: hidden;
	}
</style>
