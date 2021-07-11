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
	<MoonParams></MoonParams>
</template>

<script>
	import MoonParams from '../components/MoonParams';
	export default {
		name: 'MoonViewer',
		components: { MoonParams },
	}
</script>

<style scoped>

</style>
