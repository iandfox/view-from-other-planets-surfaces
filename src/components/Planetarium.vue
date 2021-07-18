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
	<div class="space">
		<canvas width="1600" height="800" id="stars" ref="starsCanvas"></canvas>
		<canvas width="1600" height="800" id="space" ref="spaceCanvas"></canvas>
		<canvas width="1600" height="800" id="ground" ref="groundCanvas"></canvas>
	</div>
</template>
<script>
	import { onMounted, reactive, ref, watch } from 'vue';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
	import {Space} from '../SpaceDrawing/Space.class';
	import useNumberFormat from '../composables/useNumberFormat';
	import DebugMoonsParameters from './DebugMoonsParameters';
	
	export default {
		name: 'Planetarium',
		components: {DebugMoonsParameters},
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
		},
		
		data() {
			return {
				space: {},
				
				// TODO 2021-07-15: delete
				debug_activeTabIndex: 0,
			}
		},
		
		setup(props) {
			const { format } = useNumberFormat();
			
			const sun = reactive(new SunOrbitalBody(props.julianDate));
			const moons = ref([]);
			const planets = ref([]);
			
			watch(props.moonsParameters, (newParams, oldValue) => {
				// TODO
				// newParams.forEach((params, index) => {
				// 	moons.value[index].params = params;
				// });
				// TODO delete
				// TODO: alter moon params or add new moon or something.
			});
			
			
			return {
				format,
				sun,
				moons,
				planets
			}
		},
		
		mounted() {
			// Set up `Space` once we can access DOM
			this.initSpace();
			this.draw();
		},
		
		watch: {
			julianDate(jd) {
				if (this.space && this.space.JD) {
					this.space.JD = jd;
					this.draw();
				}
			},
		},
		
		methods: {
			/**
			 * @since 2021-07-15
			 */
			initSpace() {
				const starsCanvas = this.$refs['starsCanvas'];
				const spaceCanvas = this.$refs['spaceCanvas'];
				const groundCanvas = this.$refs['groundCanvas'];
				const space = new Space(
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
					this.space.draw();
				}
			}
		},
	}
</script>
<style scoped>
	.space {}
	
	canvas {
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
