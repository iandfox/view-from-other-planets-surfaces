<!--
 - Vue Component: Planetarium
 -
 -     Example usage:
 -         <Planetarium
 -             :julian-date="julianDate"
 -             :viewport="viewport"
 -             :moons-parameters="moonsParameters"
 -             :planets-parameters="planetsParameters"
 -         ></Planetarium>
 -
 - @created 2021-07-15
-->

<template>
	<div class="space" @click="show3dDrawing = ! show3dDrawing">
		<canvas width="1600" height="800" id="stars" ref="starsCanvas"></canvas>
		<canvas width="1600" height="800" id="space" ref="spaceCanvas"></canvas>
		<canvas width="1600" height="800" id="ground" ref="groundCanvas"></canvas>
	</div>
	
	
	<Debug3dDrawing v-show="show3dDrawing" :space="space"></Debug3dDrawing>
</template>
<script>
	import { onMounted, reactive, ref, watch } from 'vue';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
	import {SpacePlanetarium} from '../SpaceDrawing/SpacePlanetarium.class';
	import useNumberFormat from '../composables/useNumberFormat';
	import DebugMoonsParameters from './DebugMoonsParameters';
	import Debug3dDrawing from './Debug3dDrawing';
	
	export default {
		name: 'Planetarium',
		components: {Debug3dDrawing, DebugMoonsParameters},
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
			},
		},
		
		data() {
			return {
				space: {},
				show3dDrawing: true,
				isDirty: true,
				
				// TODO 2021-07-21: delete
				debug_lastFrame: performance.now(),
				
				// TODO 2021-07-15: delete
				debug_activeTabIndex: 0,
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
			// Set up `SpacePlanetarium` once we can access DOM
			this.initSpace();
			this.loop_draw();
		},
		
		watch: {
			julianDate(jd) {
				if (this.space && this.space.JD) {
					this.space.JD = jd;
					this.isDirty = true;
				}
			},
			
			moonsParameters: {
				handler() {
					if (this.space && this.space.replaceMoons) {
						this.space.replaceMoons(this.moonsParameters);
						this.setMiscConfig();
						this.isDirty = true;
					}
				},
				deep: true,
			},
			
			miscConfig: {
				handler() {
					this.setMiscConfig();
					this.isDirty = true;
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
				const starsCanvas = this.$refs['starsCanvas'];
				const spaceCanvas = this.$refs['spaceCanvas'];
				const groundCanvas = this.$refs['groundCanvas'];
				const space = new SpacePlanetarium(
					starsCanvas,
					spaceCanvas,
					groundCanvas,
					this.viewport,
					this.julianDate
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
					console.group('Planetarium.vue draw()');
					console.time('Planetarium Draw'); // TODO delete
					this.space.draw(this.miscConfig.shouldDrawHorizon, this.miscConfig.shouldDrawSky, this.miscConfig.shouldDrawCompass);
					console.groupEnd();
				}
			},
			
			loop_draw() {
				if (this.isDirty) {
					this.draw();
					this.isDirty = false;
				}
				window._frametime = performance.now() - this.debug_lastFrame;
				window._fps = 1 / (window._frametime / 1000);
				this.debug_lastFrame = performance.now();
				requestAnimationFrame(() => {
					this.loop_draw()
				});
			}
		},
	}
</script>
<style scoped>
	.space {}
	
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
