<!--
 - Vue Component: SunViewer
 - @created 2021-07-10
-->

<template>
	<section>
		<h1>Here Comes the Sun</h1>
		<h2>Try 6 (SunOrbitalBody)</h2>
		<SunOBViewer></SunOBViewer>
		<h2>Try 5 (SolarCoordinates)</h2>
		<SC></SC>
	</section>
</template>

<script>
	import SC from '../components/SC';
	import SunOBViewer from '../components/SunOBViewer';
	export default {
		name: 'SunViewer',
		components: {SunOBViewer, SC},
	}
</script>
