<!--
 - Vue Component: OrbitViz
 -
 -     Example usage:
 -         <OrbitViz
 -             :julian-date="julianDate"
 -             :viewport="viewport"
 -             :moons-parameters="moonsParameters"
 -             :planets-parameters="planetsParameters"
 -         ></OrbitViz>
 -
 - @created 2021-07-15
-->

<template>
	<div class="space">
		<!--<canvas width="1600" height="800" id="stars" ref="starsCanvas"></canvas>-->
		<canvas width="800" height="800" id="space" ref="canvas"></canvas>
		<!--<canvas width="1600" height="800" id="ground" ref="groundCanvas"></canvas>-->
	</div>
	
	<div style="position: relative; z-index: 999; background: white; display: inline-block;">
		JD Min: <input type="number" v-model.number="miscConfig.jdMin">
		<br>
		JD Max: <input type="number" v-model.number="miscConfig.jdMax">
		<br>
		JD Step: <input type="number" v-model.number="miscConfig.jdStep">
		<br>
		<button @click="stepDraw()">Step Draw</button>
	</div>
	
</template>
<script>
	import { onMounted, reactive, ref, watch } from 'vue';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
	import {SpaceOrbitViz} from '../SpaceDrawing/SpaceOrbitViz.class';
	import useNumberFormat from '../composables/useNumberFormat';
	import DebugMoonsParameters from './DebugMoonsParameters';
	import Debug3dDrawing from './Debug3dDrawing';
	import InputRange from './fields/InputRange';
	
	export default {
		name: 'OrbitViz',
		components: {InputRange, Debug3dDrawing, DebugMoonsParameters},
		props: {
			julianDate: {
				type: Number,
				required: true,
			},
			viewport: {
				type: Object,
				required: true,
			},
			moonsParameters: {
				type: Array,
				default: [],
				required: false,
			},
			planetsParameters: {
				type: Array,
				default: [],
				required: false,
			},
			
			miscConfig: {
				localLongitude: -111.01908142663117,
				localLatitude: 32.198840114469995,
				obliquity: 23.4393,
				
				shouldDrawHorizon: true,
				shouldDrawSky: true,
				shouldDrawCompass: true,
				
				jdMin: 2459404.5,
				jdMax: 2459405.5,
				jdStep: 0.1,
			},
		},
		
		data() {
			return {
				space: {},
				
				// TODO 2021-07-15: delete
				debug_activeTabIndex: 0,
				show3dDrawing: true,
			}
		},
		
		setup(props) {
			const { format } = useNumberFormat();
			
			const sun = reactive(new SunOrbitalBody(props.julianDate));
			const moons = ref([]);
			const planets = ref([]);
			
			return {
				format,
				sun,
				moons,
				planets
			}
		},
		
		mounted() {
			// Set up `SpaceOrbitViz` once we can access DOM
			this.initSpace();
			this.loop_draw();
		},
		
		watch: {
			julianDate(jd) {
				if (this.space && this.space.JD) {
					this.space.JD = jd;
					this.draw();
				}
			},
			
			moonsParameters: {
				handler() {
					if (this.space && this.space.replaceMoons) {
						this.space.replaceMoons(this.moonsParameters);
						this.setMiscConfig();
						this.draw();
					}
				},
				deep: true,
			},
			
			miscConfig: {
				handler() {
					this.setMiscConfig();
					this.draw();
				},
				deep: true,
			},
		},
		
		methods: {
			/**
			 * @since 2021-07-18
			 */
			setMiscConfig() {
				([this.space.sun, ...this.space.moons, ...this.space.planets]).forEach((ob) => {
					ob.azi.siderealTime.localLongitude_deg = this.miscConfig.localLongitude;
					ob.azi.siderealTime.localLatitude_deg = this.miscConfig.localLatitude;
					ob.ecl_param[0] = this.miscConfig.obliquity;
				});
			},
			
			
			
			/**
			 * @since 2021-07-15
			 */
			initSpace() {
				// const starsCanvas = this.$refs['starsCanvas'];
				const canvas = this.$refs['canvas'];
				const space = new SpaceOrbitViz(
					this.viewport,
					this.miscConfig.jdMax,
					canvas
				);
				
				space.addSun();
				this.moonsParameters.forEach((moonParams) => {
					space.addMoon(moonParams, moonParams.color, moonParams.radius, moonParams.name);
				});
				
				// this.planets.forEach((planet) => {
				// 	// TODO
				// });
				
				this.space = space;
			},
			
			
			/**
			 * @since 2021-07-15
			 */
			draw() {
				if (this.space) {
					console.log(`OrbitViz is drawing from ${this.miscConfig.jdMin} to ${this.miscConfig.jdMax} by ${this.miscConfig.jdStep}`);
					this.space.draw(this.miscConfig.jdMin, this.miscConfig.jdMax, this.miscConfig.jdStep, true, 0.2);
				}
			},
			
			/**
			 * @since 2021-07-21
			 */
			stepDraw() {
				this.space.drawState(this.space.JD + this.miscConfig.jdStep, 0.2, true);
			},
			
			loop_draw() {
				this.draw();
				// requestAnimationFrame(() => {
				// 	this.loop_draw()
				// });
			}
		},
	}
</script>
<style scoped>
	.space {}
	
	canvas {
		border: solid 2px red;
	}
	
	canvas#stars, canvas#space, canvas#ground {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
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
