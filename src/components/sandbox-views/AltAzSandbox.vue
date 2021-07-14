<!--
 - Vue Component: AltAzSandbox
 -
 -     Example usage:
 -         <AltAzSandbox></AltAzSandbox>
 -
 - @created 2021-07-13
-->

<template>
	<h2>Sunbody once told me</h2>
	<ChartsViewer
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.001"
		:charts="charts"
		:class-instance="azimuthal_sun"
	></ChartsViewer>
	
	<h2>We could all use a little mooooon</h2>
	<ChartsViewer
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.001"
		:charts="charts"
		:class-instance="azimuthal_moon"
	></ChartsViewer>
</template>

<script>
	import {SunOrbitalBody} from '../../calculations/OrbitalBodies/SunOrbitalBody.class';
	import ChartsViewer from '../utils/ChartsViewer';
	import {SiderealTime} from '../../calculations/Utils/SiderealTime.class';
	import {AzimuthalCoordinates} from '../../calculations/Utils/AzimuthalCoordinates.class';
	import {MoonOrbitalBody} from '../../calculations/OrbitalBodies/MoonOrbitalBody.class';
	
	export default {
		name: 'AltAzSandbox',
		components: { ChartsViewer},
		data() {
			return {
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'alt_az.alt_deg', y: 'alt_az.az_deg', title: '', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'HA_deg', title: 'HA_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.x', title: 'alt_az.x', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.y', title: 'alt_az.y', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.z', title: 'alt_az.z', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.horizon.x', title: 'alt_az.horizon.x', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.horizon.y', title: 'alt_az.horizon.y', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.horizon.z', title: 'alt_az.horizon.z', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.alt', title: 'alt_az.alt', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'alt_az.az', title: 'alt_az.az', description: '', closestJDCoords: {x: 0, y: 0}},
				]
			};
		},
		
		setup() {
			const sun = new SunOrbitalBody(2459404.5);
			const moon = new MoonOrbitalBody(2459404.5);
			const azimuthal_sun = new AzimuthalCoordinates(sun, sun);
			const azimuthal_moon = new AzimuthalCoordinates(moon, sun);
			
			return {
				azimuthal_sun,
				azimuthal_moon,
				sun,
			}
		}
	}
</script>
