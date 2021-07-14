<!--
 - Vue Component: MoonViewer
 -
 -     Example usage:
 -         <MoonViewer></MoonViewer>
 - 
 - @created 2021-07-11
-->

<template>
	<h1>Look it's a moon</h1>
	<h2>Observation</h2>
	<!--<ViewFromGround></ViewFromGround>-->
	<h2>Coords</h2>
	<MoonCoords></MoonCoords>
	<h2>Params</h2>
	<!--<MoonParams></MoonParams>-->
</template>

<script>
	import MoonParams from '../components/MoonParams';
	import MoonCoords from '../components/MoonCoords';
	import ViewFromGround from '../components/ViewFromGround';
	export default {
		name: 'MoonViewer',
		components: {ViewFromGround, MoonCoords, MoonParams },
	}
</script>
