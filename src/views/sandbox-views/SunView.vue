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
	<SunOrbitalBodySandbox></SunOrbitalBodySandbox>
</template>

<script>
	import SunOrbitalBodySandbox from '../../components/sandbox-views/SunOrbitalBodySandbox';
	export default {
		name: 'SunView',
		components: {SunOrbitalBodySandbox},
	}
</script>
