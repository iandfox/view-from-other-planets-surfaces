<!--
 - Vue Component: MoonOrbitalBodySandbox
 -
 -     Example usage:
 -         <MoonOrbitalBodySandbox></MoonOrbitalBodySandbox>
 - 
 - @created 2021-07-13
 - 
 - @since 2021-07-13
-->

<template>
	<h3>MoonOrbitalBodySandbox - 1 day</h3>
	<ChartsViewer
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.001"
		:charts="charts"
		:class-instance="moon"
	></ChartsViewer>
	
	<h3>MoonOrbitalBodySandbox - 30 days</h3>
	<!--<ChartsViewer-->
		<!--:julian-day-start="2459404.5"-->
		<!--:julian-day-end="2459434.5"-->
		<!--:julian-day-step="0.01"-->
		<!--:charts="charts"-->
		<!--:class-instance="moon"-->
	<!--&gt;</ChartsViewer>-->
	<!---->
	<!--<h3>MoonOrbitalBodySandbox - 365 days</h3>-->
	<!--<ChartsViewer-->
		<!--:julian-day-start="2459404.5"-->
		<!--:julian-day-end="2459769.5"-->
		<!--:julian-day-step="1"-->
		<!--:charts="charts"-->
		<!--:class-instance="moon"-->
	<!--&gt;</ChartsViewer>-->
</template>

<script>
	import ChartsViewer from '../utils/ChartsViewer';
	import { MoonOrbitalBody } from '../../calculations/OrbitalBodies/MoonOrbitalBody.class.js';
	
	export default {
		name: 'MoonOrbitalBodySandbox',
		components: {ChartsViewer},
		
		data() {
			return {
				
				julianDay: 2459404.5,
				
				/**
				 * getJulianDay(2021, 07, 09) = 2459404.5
				 */
				moon: new MoonOrbitalBody(2459404.5),
				
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: '', closestJDCoords: {x: 0, y: 0}},
					
					{x: 'time', y: 'RA_deg', title: 'RA_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'RA', title: 'RA', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'Decl_deg', title: 'Decl_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'RA_deg', y: 'Decl_deg', title: '(RA_deg, Decl_deg)', description: '', closestJDCoords: {x: 0, y: 0}},
					
					{x: 'time', y: 'N_deg', title: 'N_deg longitude of ascending node', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'i_deg', title: 'i_deg inclination', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'w_deg', title: 'w_deg argument of periapsis', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'a', title: 'a = semi-major axis (mean dist from parent)', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'e', title: 'e eccentricity', description: '', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'M_deg', title: 'M_deg mean anomaly', description: '0 at periapsis, increase uniformly', closestJDCoords: {x: 0, y: 0}},

					{x: 'time', y: 'E_deg', title: 'E_deg = eccentric anomaly', description: '[uses M_deg, e] angular position of body. the big mamma jamma', closestJDCoords: {x: 0, y: 0}},

					{x: 'time', y: 'v_deg', title: 'v_deg = true anomaly', description: '[uses e, E] angle between position and periapsis', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'r', title: 'r = dist to parent', description: '[uses e, E]', closestJDCoords: {x: 0, y: 0}},
					
				],
			};
		},
	}
</script>
