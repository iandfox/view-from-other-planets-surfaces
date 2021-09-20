<!--
 - Vue Component: svgview
 -     Charts planets using SVG instead of canvas.
 -     
 -     Example usage:
 -         <svgview></svgview>
 - 
 - @created 2021-09-18
 - 
 - @since 2021-09-18
-->

<template>
	<h2>SVG Planetarium</h2>
	<section>
		<svg-planetarium></svg-planetarium>
	</section>
</template>

<script>
	import SvgPlanetarium from '../svg-technique_2021-09-18/svg-planetarium';
	
	export default {
		name: 'svgview',
		components: {SvgPlanetarium},
	}
</script>
