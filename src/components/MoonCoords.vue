<!--
 - Vue Component: MoonCoords
 -
 -     Example usage:
 -         <MoonCoords></MoonCoords>
 - 
 - @created 2021-07-11
-->

<template>
	<ChartsViewer
		:charts="charts"
		:class-instance="moonCoords"
		:julian-day-start="2459404.5"
		:julian-day-end="2459434.5"
		:julian-day-step="1 / 24"
	></ChartsViewer>
</template>

<script>
	import {MoonCoordinates} from '../calculations/MoonCoordinates.class';
	import {Moon} from '../calculations/Moon.class';
	import ChartsViewer from './ChartsViewer';
	
	export default {
		name: 'MoonCoords',
		components: {ChartsViewer},
		data() {
			return {
				moonCoords: new MoonCoordinates(new Moon(2459404.5)),
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: ''},
					// {x: 'time', y: 'T', title: 'Julian Centuries', description: ''},
					// {x: 'time', y: 'heliocentric.x', title: 'Heliocentric x-coord', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
				],
			};
		},
	}
</script>
