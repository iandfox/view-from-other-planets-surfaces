<!--
 - Vue Component: SunView
 -
 -     Example usage:
 -         <SunView></SunView>
 -
 - @created 2021-07-11
-->

<template>
	<h1>Here comes the sun</h1>
	<SunOBViewer></SunOBViewer>
</template>

<script>
	import SunOBViewer from '../components/SunOBViewer';
	export default {
		name: 'SunView',
		components: {SunOBViewer},
	}
</script>
