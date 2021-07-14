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
	<div class="controls">
		<button class="show-hide" @click="config.areControlsHidden = ! config.areControlsHidden">Show/Hide Controls</button>
		
		<InputRange
			v-model="JD"
			label="JD"
			:min="0"
			:max="365"
			:step="autoRate"
			:fraction-digits="4"
		></InputRange>
		
		<div style="font-size: 0.8em;">
			<div>
				<span>
					Rate:
					<br>
					<label><input type="checkbox" v-model="isAuto"> Auto Forward</label>
				</span> <input type="number" v-model.number="autoRate" step="0.001">
			</div>
		</div>
		
		<InputRange
			v-model="config.obliquity"
			label="Obliquity"
			:min="-90"
			:max="90"
			:step="0.5"
			units="deg"
			:fraction-digits="1"
			@input="setObliquityOnBodies"
		></InputRange>
		
		<div>
			<InputRange
				v-model="config.localLongitude"
				label="Local Longitude"
				:min="-180"
				:max="180"
				:step="0.001"
				units="deg"
				:fraction-digits="3"
				@input="setLocalLongLat"
			></InputRange>
			<InputRange
				v-model="config.localLatitude"
				label="Local Latitude"
				:min="-90"
				:max="90"
				:step="0.001"
				units="deg"
				:fraction-digits="3"
				@input="setLocalLongLat"
			></InputRange>
		</div>
		
		<div style="text-align: left; width:100px; margin: 0 auto;">
			<label><input type="checkbox" v-model="config.shouldDrawHorizon"> Draw Horizon</label>
			<br>
			<label><input type="checkbox" v-model="config.shouldDrawSky"> Draw Sky</label>
			<br>
			<label><input type="checkbox" v-model="config.shouldDrawCompass"> Draw Compass</label>
		</div>
		
		<!--<div>-->
			<!-- TODO -->
			<!--<div style="font-size: 0.8em"><strong>Viewport</strong></div>-->
			<!--<input type="number" v-model.number="">-->
		<!--</div>-->
		
		<div v-for="(moon, moonIndex) in moons">
			<div style="font-size: 0.8em"><strong>Moon #{{moonIndex}}</strong></div>
			<div v-if="config.moonParams[moonIndex]">
				<InputRange
					v-model="config.moonParams[moonIndex].N[0]"
					label="Longitude of the ascending node"
					:min="0" :max="360" :step="0.5"
					units="deg" :fraction-digits="1"
					@input="setMoonParam(0, 'N')"
				></InputRange>
				<InputRange
					v-model="config.moonParams[moonIndex].i[0]"
					label="Inclination"
					:min="-90" :max="90" :step="0.5"
					units="deg" :fraction-digits="1"
					@input="setMoonParam(0, 'i')"
				></InputRange>
				<InputRange
					v-model="config.moonParams[moonIndex].w[0]"
					label="Arg of periapsis"
					:min="0" :max="360" :step="0.5"
					units="deg" :fraction-digits="1"
					@input="setMoonParam(0, 'w')"
				></InputRange>
				<InputRange
					v-model="config.moonParams[moonIndex].a[0]"
					label="Semi-major axis"
					:min="0" :max="500" :step="0.6"
					units="" :fraction-digits="1"
					@input="setMoonParam(0, 'a')"
				></InputRange>
				<InputRange
					v-model="config.moonParams[moonIndex].e[0]"
					label="Eccentricity"
					:min="0" :max="1" :step="0.01"
					units="" :fraction-digits="2"
					@input="setMoonParam(0, 'e')"
				></InputRange>
				<InputRange
					v-model="config.moonParams[moonIndex].M[0]"
					label="Mean Anomaly"
					:min="-180" :max="180" :step="0.5"
					units="deg" :fraction-digits="1"
					@input="setMoonParam(0, 'M')"
				></InputRange>
			</div>
			<p v-else>Error: couldn't find moonParams[{{moonIndex}}]</p>
		</div>
	</div>
	
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
	
	export default {
		name: 'ViewFromGround',
		components: {ChartsViewer, InputRange},
		
		data() {
			return {
				space: null,
				
				isAuto: true,
				autoRate: 0.001,
				
				intervalIds: [],
				
				// TODO: limit the viewport and be able to drag it around
				viewport: {
					bottom: -90,
					top:     90,
					left:   -180,
					right:   180,
				},
				
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
				},
			}
		},
		
		setup() {
			const JD   = ref(0); //ref(2459404.5);
			const moons = [
				new MoonOrbitalBody(JD.value),
				new MoonOrbitalBody(
					JD.value,
					{
						N: [125.1228, -0.0529538083],
						i: [5.1454, 1],
						w: [318.0634, 0.1643573223],
						a: [60.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [0.3654, 13.0649929509],
					},
					{
						color: ''
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
				this.viewport,
				this.sun,
				this.moons,
				[] // planets
			);
			this.space.drawBackground(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			this.space.drawStars(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			this.draw();
			
			this.loop();
		},
		
		unmounted() {
			this.intervalIds.forEach((id) => {
				clearTimeout(id);
				clearInterval(id);
				cancelAnimationFrame(id);
			});
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
			
			loop() {
				this.intervalIds = []; // TODO i dunno, do this better.
				if (this.isAuto) {
					if (! this.autoRate) {
						this.isAuto = 0;
					} else {
						this.JD += parseFloat(this.autoRate);
					}
				}
				this.intervalIds.push(requestAnimationFrame(() => {
					this.loop();
				}))
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
	
	.controls {
		font-size: 11px;
		position: fixed;
		bottom: 0;
		left: 10vw;
		right: 10vw;
		max-height: 200px;
		max-width: 80vw;
		overflow: auto;
		background: rgba(200, 200, 200, 0.9);
		padding: var(--length-small);
		z-index: 999;
		
		/*display: grid;*/
		/*grid-template-columns: repeat(auto-fill, 300px);*/
		/*align-items: start;*/
		/*grid-auto-flow: row dense;*/
		
		display: flex; flex-direction: column; flex-wrap: wrap;
		/*align-items: center*/
	}
	.controls > *:not(button.show-hide) {
		width: 300px;
	}
	
	input, code {
		color: white;
	}
	
	label {
		user-select: none;
	}
	
	.show-hide {
		position: absolute;
		bottom: 100%;
		left: 0;
	}
</style>
