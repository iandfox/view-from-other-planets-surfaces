<!--
 - Vue Component: SunOBViewer
 -     SolarCoordinates visualization
 -     
 -     Example usage:
 -         <SunOBViewer></SunOBViewer>
 - 
 - @created 2021-07-13
 - 
 - @since 2021-07-13
-->

<template>
	<ChartsViewer
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.001"
		:charts="charts"
		:class-instance="sun"
	></ChartsViewer>
</template>

<script>
	import ChartsViewer from './ChartsViewer';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody';
	
	export default {
		name: 'SunOBViewer',
		components: {ChartsViewer},
		
		data() {
			return {
				
				julianDay: 2459404.5,
				
				/**
				 * getJulianDay(2021, 07, 09) = 2459404.5
				 */
				sun: new SunOrbitalBody(2459404.5),
				
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: ''},
					
					// {x: 'RA_deg', y: 'Decl_deg', title: '(RA_deg, Decl_deg)', description: ''},
					
					{x: 'time', y: 'N_deg', title: 'N_deg longitude of ascending node', description: ''},
					{x: 'time', y: 'i_deg', title: 'i_deg inclination', description: ''},
					{x: 'time', y: 'w_deg', title: 'w_deg argument of periapsis', description: ''},
					{x: 'time', y: 'a', title: 'a = semi-major axis (mean dist from parent)', description: ''},
					{x: 'time', y: 'e', title: 'e eccentricity', description: ''},
					{x: 'time', y: 'M_deg', title: 'M_deg mean anomaly (0 at periapsis, increase uniformly)', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					
					// {x: 'time', y: 'v_deg', title: 'v_deg', description: ''},
					// {x: 'time', y: 'r', title: 'r', description: ''},
					// {x: 'time', y: 'lonsun_deg', title: 'lonsun_deg', description: ''},
					
					// {x: 'time', y: 'eclipticCoordinates.x', title: 'eclipticCoordinates.x', description: ''},
					// {x: 'time', y: 'eclipticCoordinates.y', title: 'eclipticCoordinates.y', description: ''},
					// {x: 'time', y: 'eclipticCoordinates.z', title: 'eclipticCoordinates.z', description: ''},
					// {x: 'eclipticCoordinates.x', y: 'eclipticCoordinates.y', title: 'eclipticCoordinates (x,y)', description: ''},
					//
					// {x: 'time', y: 'equatorialCoordinates.x', title: 'equatorialCoordinates.x', description: ''},
					// {x: 'time', y: 'equatorialCoordinates.y', title: 'equatorialCoordinates.y', description: ''},
					// {x: 'time', y: 'equatorialCoordinates.z', title: 'equatorialCoordinates.z', description: ''},
					// {x: 'equatorialCoordinates.x', y: 'equatorialCoordinates.y', title: 'equatorialCoordinates (x,y)', description: ''},
					// {x: 'equatorialCoordinates.y', y: 'equatorialCoordinates.z', title: 'equatorialCoordinates (y,z)', description: ''},
					
					// {x: 'time', y: 'Ls_deg', title: 'Ls_deg', description: ''},
					//
					// {x: 'time', y: 'RA_deg', title: 'Sun\'s right ascension, alpha.', description: '(Sun\'s latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)'},
					// {x: 'time', y: 'Decl_deg', title: 'Sun\'s declination, delta.', description: ''},
					//
					// {x: 'time', y: 'ecl_deg', title: 'obliquity, epsilon, of the ecliptic', description: 'The obliquity, epsilon, of the ecliptic, or inclination of the Earth\'s axis of rotation, is the angle between the equator and the ecliptic'},
				],
			};
		},
	}
</script>
