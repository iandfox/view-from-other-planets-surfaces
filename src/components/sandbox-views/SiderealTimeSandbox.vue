<!--
 - Vue Component: SiderealTimeSandbox
 -
 -     Example usage:
 -         <SiderealTimeSandbox></SiderealTimeSandbox>
 -
 - @created 2021-07-13
-->

<template>
	<ChartsViewer
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.001"
		:charts="charts"
		:class-instance="siderealTime"
	></ChartsViewer>
</template>

<script>
	import {SunOrbitalBody} from '../../calculations/OrbitalBodies/SunOrbitalBody.class';
	import ChartsViewer from '../utils/ChartsViewer';
	import {SiderealTime} from '../../calculations/Utils/SiderealTime.class';
	
	export default {
		name: 'SiderealTimeSandbox',
		components: { ChartsViewer},
		data() {
			return {
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'GMST_deg', title: 'GMST_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'LST_deg', title: 'LST_deg', description: '', closestJDCoords: {x: 0, y: 0}},
				]
			};
		},
		
		setup() {
			const sun = new SunOrbitalBody(2459404.5);
			const siderealTime = new SiderealTime(sun);
			
			return {
				siderealTime,
				sun,
			}
		}
	}
</script>
