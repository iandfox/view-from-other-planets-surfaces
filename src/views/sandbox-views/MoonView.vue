<!--
 - Vue Component: MoonView
 -
 -     Example usage:
 -         <MoonView></MoonView>
 -
 - @created 2021-07-11
-->

<template>
	<h1>That's a moray</h1>
	<MoonOrbitalBodySandbox></MoonOrbitalBodySandbox>
</template>

<script>
	import MoonOrbitalBodySandbox from '../../components/sandbox-views/MoonOrbitalBodySandbox';
	export default {
		name: 'MoonView',
		components: {MoonOrbitalBodySandbox},
	}
</script>
