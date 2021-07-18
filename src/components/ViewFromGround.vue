<!--
 - Vue Component: ViewFromGround
 -     Like a planetarium in my browser.
 -     
 -     Example usage:
 -         <ViewFromGround></ViewFromGround>
 - 
 - @created 2021-07-13
-->

<template>
	<GroundControls
		v-model:julian-date="julianDate"
		v-model:viewport="viewport"
		v-model:moons-parameters="moonsParameters"
	></GroundControls>
	
	<Planetarium
		:julian-date="julianDate"
		:moons-parameters="moonsParameters"
		:viewport="viewport"
	></Planetarium>
</template>

<script>
	import GroundControls from './view-controls/GroundControls';
	import Planetarium from './Planetarium';
	import useNumberFormat from '../composables/useNumberFormat';
	import DebugMoonsParameters from './DebugMoonsParameters';
	
	export default {
		name: 'ViewFromGround',
		components: {DebugMoonsParameters, Planetarium, GroundControls},
		
		data() {
			return {
				moonsParameters: [
					/*{
						name: 'Moon', // Earth's Moon
						color: 'grey',
						radius: 28,
						N: [125.1228, -0.0529538083],
						i: [5.1454, 0],
						w: [318.0634, 0.1643573223],
						a: [60.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [115.3654, 13.0649929509],
					},*/
					{
						name: 'F\'an',
						color: 'orange',
						radius: 15,
						N: [125.1228, - 0.0529538083],
						i: [5.1454, 1],
						w: [318.0634, 0.1643573223],
						a: [60.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [0.3654, 53.0649929509],
					},
					{
						name: 'Gomor',
						color: 'teal',
						radius: 40,
						N: [125.1228, -0.0529538083],
						i: [5.1454, 1],
						w: [8.0634, 0.1643573223],
						a: [1.2666, 0], // in Earth radii
						e: [0.054900, 0],
						M: [300.3654, 13.0649929509],
					}
				],
				
				///
				/// Config and Interactables
				///
				
				julianDate: 2459404.5,
				
				viewport: {
					bottom: -90,
					top:     90,
					left:   -180,
					right:   180,
				},
				
				localLongitude: -111.01908142663117,
				localLatitude: 32.198840114469995,
				
				config: {
					obliquity: 0,
					
					shouldDrawHorizon: true,
					shouldDrawSky: true,
					shouldDrawCompass: true,
					moonParams: [],
					
					isAuto: true,
					autoRate: 0.001,
					
					intervalIds: [],
				},
			}
		},
		
		setup() {
			const { format } = useNumberFormat();
			return {
				format
			}
		},
		
		mounted() {
			console.log(
				'%c-----' + '%c ViewFromGround.vue : Mounted ' + '%c-----',
				'color: white; background: darkgreen;',
				'color: black; background: #ddd;',
				'color: white; background: darkgreen;',
			);
			// set initial reactive values
			// this.config.obliquity = this.sun.ecl_param[0];
			// this.moons.forEach((moon) => {
			// 	this.config.moonParams.push(moon.params);
			// });
			//
			// this.space = new Space(
			// 	document.getElementById('stars'),
			// 	document.getElementById('space'),
			// 	document.getElementById('ground'),
			// 	this.config.viewport,
			// 	this.sun,
			// 	this.moons,
			// 	[] // planets
			// );
			// this.space.drawBackground(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			// this.space.drawStars(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			// this.draw();
		},
		
		
		watch: {
			// JD() {
			// 	this.space.JD = parseFloat(this.JD);
			// 	this.draw();
			// }
		},
		
		methods: {
			// draw() {
			// 	this.space.draw(this.config.shouldDrawHorizon, this.config.shouldDrawSky, this.config.shouldDrawCompass);
			// },
			
			/**
			 * @since 2021-07-14
			 */
			// setObliquityOnBodies() {
			// 	const obliq = parseFloat(this.config.obliquity);
			// 	[this.sun, ...this.moons, ...this.planets].forEach((ob) => {
			// 		ob.ecl_param[0] = obliq;
			// 	});
			//
			// 	if (! this.isAuto) {
			// 		this.draw();
			// 	}
			// },
			
			/**
			 * @since 2021-07-14
			 */
			// setMoonParam(moonIndex, slug, paramIndex = 0) {
			// 	this.moons[moonIndex].params[slug][paramIndex] = this.config.moonParams[moonIndex][slug][paramIndex];
			//
			// 	if (! this.isAuto) {
			// 		this.draw();
			// 	}
			// },
			
			/**
			 * @since 2021-07-14
			 */
			// setLocalLongLat() {
			// 	const lng = parseFloat(this.config.localLongitude),
			// 		lat = parseFloat(this.config.localLatitude);
			// 	[this.sun, ...this.moons, ...this.planets].forEach((ob) => {
			// 		ob.azi.siderealTime.localLongitude_deg = lng;
			// 		ob.azi.siderealTime.localLatitude_deg = lat;
			// 	});
			//
			// 	if (! this.isAuto) {
			// 		this.draw();
			// 	}
			// }
		},
	}
</script>

<style scoped>
	
	canvas {
		position: fixed; top: 0; right: 0; left: 0; bottom: 0;
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
	
	/* TODO 2021-07-15: delete */
	#debug {
		background: white;
		position: fixed;
		right: 0;
		top: 0;
		bottom: 0;
		width: 300px;
		z-index: 9999999999;
		font-size: 12px;
		overflow: auto
	}
	#debug dl {
		display: grid;
		grid-template-columns: 100px 1fr;
		grid-gap: 0;
	}
	#debug dl > dt {
		grid-column: 1;
		text-align: right;
	}
	#debug dl > dd {
		grid-column: 2;
		margin: 0;
	}
	#debug dl > dt:nth-child(4n+1), #debug dl > dd:nth-child(4n+2) { background: #eee }

</style>
