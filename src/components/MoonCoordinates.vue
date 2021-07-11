<!--
 - Vue Component: MoonCoordinates
 -     Shows charts of moon params
 -     
 -     Example usage:
 -         <MoonCoordinates></MoonCoordinates>
 - 
 - @created 2021-07-11
-->

<template>
	<ChartsViewer
		:charts="charts"
		:class-instance="moon"
		:julian-day-start="2459404.5"
		:julian-day-end="2459434.5"
		:julian-day-step="1 / 24"
	></ChartsViewer>
</template>

<script>
	import ChartsViewer from './ChartsViewer';
	import {Moon} from '../calculations/Moon.class';
	
	export default {
		name: 'MoonCoordinates',
		components: {ChartsViewer},
		data() {
			return {
				moon: new Moon(2459404.5),
				
				charts: [
					{x: 'time', y: 'JD', title: 'Julian Day (sanity check)', description: ''},
					{x: 'time', y: 'T', title: 'Julian Centuries', description: ''},
					{x: 'time', y: 'a', title: 'semi-major axis', description: ''},
					{x: 'time', y: 'e', title: 'eccentricity', description: 'Eccentricity of the Earth\'s orbit'},
					{x: 'time', y: 'i_deg', title: 'inclination', description: ''},
					{x: 'time', y: 'L0_deg', title: 'geometric mean longitude', description: 'The geometric mean longitude of the Sun, referred to the mean equinox of the date'},
					{x: 'time', y: 'p_deg', title: 'Longitude of the periapsis', description: ''},
					{x: 'time', y: 'W_deg', title: 'Longitude of the ascending node', description: ''},
					{x: 'time', y: 'w_deg', title: 'argument of the perihelion', description: ''},
					{x: 'time', y: 'M_deg', title: 'mean anomaly', description: ''},
					{x: 'time', y: 'E_deg', title: 'eccentric anomaly', description: ''},
					
					
					
					// {x: 'time', y: 'M_deg', title: 'Mean anomaly of the Sun', description: 'Mean anomaly of the Sun. (This is the same as the mean anomaly of the Earth.)'},
					// {x: 'time', y: 'C_deg', title: 'Sun\'s equation of center', description: ''},
					// {x: 'time', y: 'L_deg', title: 'Sun\'s true longitude, Lambda', description: 'Sun\'s true longitude, Lambda. aka "true geometric longitude referred to the mean equinox of the date."  "This is the quantity required for instance in the calculation of geocentric planetary positions"'},
					// {x: 'time', y: 'v_deg', title: 'Sun\'s true anomaly', description: ''},
					//
					// {x: 'time', y: 'R', title: 'Sun\'s radius vector', description: 'Sun\'s radius vector -- the distance between the centers of the Sun and the Earth, expressed in astronomical units'},
					//
					// {x: 'time', y: 'l_deg', title: 'apparent longitude, lambda, of the sun', description: 'the apparent longitude, lambda, of the sun, referred to the true equinox of the date.'},
					//
					// {x: 'time', y: 'ecl_deg', title: 'obliquity, epsilon, of the ecliptic', description: 'The obliquity, epsilon, of the ecliptic, or inclination of the Earth\'s axis of rotation, is the angle between the equator and the ecliptic'},
					//
					// {x: 'time', y: 'RA', title: 'Sun\'s right ascension, alpha.', description: '(Sun\'s latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)'},
					//
					// {x: 'time', y: 'Decl', title: 'Sun\'s declination, delta.', description: ''},
					//
					// {x: 'time', y: 'RA_apparent', title: '"apparent" position of sun :shrug:', description: ''},
					//
					// {x: 'time', y: 'Decl_apparent', title: '"apparent" position of sun :shrug:', description: ''},
					// {x: 'time', y: 'RA_deg', title: 'Sun\'s right ascension, alpha.', description: '(Sun\'s latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)'},
					// {x: 'time', y: 'Decl_deg', title: 'Sun\'s declination, delta.', description: ''},
				],
			};
		},
	}
</script>
