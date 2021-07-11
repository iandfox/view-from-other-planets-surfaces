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
	<MoonCoordinates></MoonCoordinates>
</template>

<script>
	import MoonCoordinates from '../components/MoonCoordinates';
	export default {
		name: 'MoonViewer',
		components: {MoonCoordinates},
	}
</script>

<style scoped>

</style>
