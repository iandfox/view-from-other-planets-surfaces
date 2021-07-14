<!--
 - Vue Component: SunOrbitalBodySandbox
 -     SolarCoordinates visualization
 -     
 -     Example usage:
 -         <SunOrbitalBodySandbox></SunOrbitalBodySandbox>
 - 
 - @created 2021-07-13
 - 
 - @since 2021-07-13
-->

<template>
	<h3>SunOrbitalBodySandbox - 1 day</h3>
	<ChartsViewer
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.001"
		:charts="charts"
		:class-instance="sun"
	></ChartsViewer>
	
	<h3>SunOrbitalBodySandbox - 30 days</h3>
	<!--<ChartsViewer-->
		<!--:julian-day-start="2459404.5"-->
		<!--:julian-day-end="2459434.5"-->
		<!--:julian-day-step="0.01"-->
		<!--:charts="charts"-->
		<!--:class-instance="sun"-->
	<!--&gt;</ChartsViewer>-->
	<!---->
	<!--<h3>SunOrbitalBodySandbox - 365 days</h3>-->
	<!--<ChartsViewer-->
		<!--:julian-day-start="2459404.5"-->
		<!--:julian-day-end="2459769.5"-->
		<!--:julian-day-step="1"-->
		<!--:charts="charts"-->
		<!--:class-instance="sun"-->
	<!--&gt;</ChartsViewer>-->
</template>

<script>
	import ChartsViewer from '../utils/ChartsViewer';
	import { SunOrbitalBody } from '../../calculations/OrbitalBodies/SunOrbitalBody.class.js';
	
	export default {
		name: 'SunOrbitalBodySandbox',
		components: {ChartsViewer},
		
		data() {
			return {
				
				julianDay: 2459404.5,
				
				/**
				 * getJulianDay(2021, 07, 09) = 2459404.5
				 */
				sun: new SunOrbitalBody(2459404.5),
				
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: '', closestJDCoords: {x: 0, y: 0}},
					
					// {x: 'RA_deg', y: 'Decl_deg', title: '(RA_deg, Decl_deg)', description: '', closestJDCoords: {x: 0, y: 0}},
					
					// {x: 'time', y: 'N_deg', title: 'N_deg longitude of ascending node', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'i_deg', title: 'i_deg inclination', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'w_deg', title: 'w_deg argument of periapsis', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'a', title: 'a = semi-major axis (mean dist from parent)', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'e', title: 'e eccentricity', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'M_deg', title: 'M_deg mean anomaly', description: '0 at periapsis, increase uniformly', closestJDCoords: {x: 0, y: 0}},
					//
					// {x: 'time', y: 'E_deg', title: 'E_deg = eccentric anomaly', description: '[uses M_deg, e] angular position of body. the big mamma jamma', closestJDCoords: {x: 0, y: 0}},
					//
					// {x: 'time', y: 'v_deg', title: 'v_deg = true anomaly', description: '[uses e, E] angle between position and periapsis', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'r', title: 'r = dist to parent', description: '[uses e, E]', closestJDCoords: {x: 0, y: 0}},
					//
					{x: 'time', y: 'lonsun_deg', title: 'lonsun_deg', description: '[uses v_deg, w_deg]', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'Ls_deg', title: 'Ls_deg', description: '[uses M_deg, w_deg]', closestJDCoords: {x: 0, y: 0}},
					
					{x: 'time', y: 'eclipticCoordinates.x', title: 'eclipticCoordinates.x', description: '[uses r, lonsun_deg] Ecliptic rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'eclipticCoordinates.y', title: 'eclipticCoordinates.y', description: '[uses r, lonsun_deg] Ecliptic rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					{x: 'eclipticCoordinates.x', y: 'eclipticCoordinates.y', title: '(x,y) eclipticCoordinates', description: '[uses r, lonsun_deg] Ecliptic rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					
					{x: 'time', y: 'equatorialCoordinates.x', title: 'equatorialCoordinates.x', description: '[uses eclipticCoordinates, ecl_deg] Equatorial rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'equatorialCoordinates.y', title: 'equatorialCoordinates.y', description: '[uses eclipticCoordinates, ecl_deg] Equatorial rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'equatorialCoordinates.z', title: 'equatorialCoordinates.z', description: '[uses eclipticCoordinates, ecl_deg] Equatorial rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					{x: 'equatorialCoordinates.x', y: 'equatorialCoordinates.y', title: '(x,y) equatorialCoordinates', description: '[uses eclipticCoordinates, ecl_deg] Equatorial rectangular geocentric coordinates', closestJDCoords: {x: 0, y: 0}},
					
					
					{x: 'time', y: 'RA_deg', title: 'RA_deg', description: '[uses equatorial coords]', closestJDCoords: {x: 0, y: 0}},
					{x: 'time', y: 'Decl_deg', title: 'Decl_deg', description: '[uses equatorial coords]', closestJDCoords: {x: 0, y: 0}},
					
					
					// {x: 'time', y: 'v_deg', title: 'v_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'r', title: 'r', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'lonsun_deg', title: 'lonsun_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					
					// {x: 'time', y: 'eclipticCoordinates.x', title: 'eclipticCoordinates.x', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'eclipticCoordinates.y', title: 'eclipticCoordinates.y', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'eclipticCoordinates.z', title: 'eclipticCoordinates.z', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'eclipticCoordinates.x', y: 'eclipticCoordinates.y', title: 'eclipticCoordinates (x,y)', description: '', closestJDCoords: {x: 0, y: 0}},
					//
					// {x: 'time', y: 'equatorialCoordinates.x', title: 'equatorialCoordinates.x', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'equatorialCoordinates.y', title: 'equatorialCoordinates.y', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'equatorialCoordinates.z', title: 'equatorialCoordinates.z', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'equatorialCoordinates.x', y: 'equatorialCoordinates.y', title: 'equatorialCoordinates (x,y)', description: '', closestJDCoords: {x: 0, y: 0}},
					// {x: 'equatorialCoordinates.y', y: 'equatorialCoordinates.z', title: 'equatorialCoordinates (y,z)', description: '', closestJDCoords: {x: 0, y: 0}},
					
					// {x: 'time', y: 'Ls_deg', title: 'Ls_deg', description: '', closestJDCoords: {x: 0, y: 0}},
					//
					// {x: 'time', y: 'RA_deg', title: 'Sun\'s right ascension, alpha.', description: '(Sun\'s latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)', closestJDCoords: {x: 0, y: 0}},
					// {x: 'time', y: 'Decl_deg', title: 'Sun\'s declination, delta.', description: '', closestJDCoords: {x: 0, y: 0}},
					//
					// {x: 'time', y: 'ecl_deg', title: 'obliquity, epsilon, of the ecliptic', description: 'The obliquity, epsilon, of the ecliptic, or inclination of the Earth\'s axis of rotation, is the angle between the equator and the ecliptic', closestJDCoords: {x: 0, y: 0}},
				],
			};
		},
	}
</script>
