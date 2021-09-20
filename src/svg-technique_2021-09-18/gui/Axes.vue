<!--
 - Vue Component: Axes
 -     Draws Axes + Tick Marks + Labels
 -     
 -     Example usage:
 -         <Axes
 -             :config="config"
 -         ></Axes>
 - 
 - @created 2021-09-18
 - 
 - @since x.x.x
-->

<template>
	<!-- x-axis -->
	<line
		x1="-180"
		x2="180"
		y1="0"
		y2="0"
		:stroke="color"
		:stroke-width="width"
	/>
	<line
		v-for="x in xAxisTickMarks"
		:x1="x"
		:x2="x"
		:y1="-1 * halfLength"
		:y2="halfLength"
		:stroke="color"
		:stroke-width="width"
	/>
	
	<!-- y-axis -->
	<line
		x1="0"
		x2="0"
		y1="-90"
		y2="90"
		:stroke="color"
		:stroke-width="width"
	/>
	<line
		v-for="(y, index) in yAxisTickMarks"
		:x1="-1 * halfLength"
		:x2="halfLength"
		:y1="y"
		:y2="y"
		:stroke="color"
		:stroke-width="width"
	/>
	
	
	<!-- TODO 2021-09-18: labels here. grid lines, but in diff component. -->
</template>

<script>
	export default {
		name: 'Axes',
		
		props: {
			color: {
				type: String,
				default: 'yellow',
			},
			gap: {
				type: Number,
				default: 10,
			},
			halfLength: {
				type: Number,
				default: 2,
			},
			width: {
				type: Number,
				default: 2,
			},
		},
		
		computed: {
			xAxisTickMarks() { return ([...Array(Math.floor(360 / this.gap)).keys()]).map((x) => x * this.gap - 180) },
			yAxisTickMarks() { return ([...Array(Math.floor(180 / this.gap)).keys()]).map((y) => y * this.gap - 90) },
		},
	}
</script>
