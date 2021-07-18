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
		v-model:misc-config="miscConfig"
	></GroundControls>
	
	<Planetarium
		:julian-date="julianDate"
		:moons-parameters="moonsParameters"
		:viewport="viewport"
		:misc-config="miscConfig"
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
				miscConfig: {
					localLongitude: -111.01908142663117,
					localLatitude: 32.198840114469995,
					obliquity: 23.4393,
					
					shouldDrawHorizon: true,
					shouldDrawSky: true,
					shouldDrawCompass: true,
				},
				
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
</style>
