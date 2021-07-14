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
		name="Moon Coords (1 day)"
		:charts="charts"
		:class-instance="moonCoords"
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="1 / 24"
	></ChartsViewer>
	<ChartsViewer
		name="Moon Coords (30 days)"
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
					{x: 'time', y: 'T', title: 'Julian Centuries', description: ''},
					
					{x: 'time', y: 'v_deg', title: 'v_deg true anom', description: ''},
					{x: 'time', y: 'r', title: 'r', description: ''},
					
					{x: 'time', y: 'o.W_deg', title: 'o.W_deg Longitude of the ascending node', description: ''},
					{x: 'time', y: 'o.w_deg', title: 'o.w_deg Argument of the perihelion', description: ''},
					{x: 'time', y: 'o.i_deg', title: 'o.i_deg inclination', description: ''},
					{x: 'time', y: 'ecliptic.x', title: 'ecliptic.x', description: ''},
					
					// {x: 'time', y: 'heliocentric.x', title: 'Heliocentric x-coord', description: ''},
					// {x: 'time', y: 'heliocentric.y', title: 'Heliocentric y-coord', description: ''},
					// {x: 'heliocentric.x', y: 'heliocentric.y', title: 'Heliocentric (x,y)-coords', description: ''},
					//
					// {x: 'time', y: 'ecliptic.x', title: 'ecliptic x-coord', description: ''},
					// {x: 'time', y: 'ecliptic.y', title: 'ecliptic y-coord', description: ''},
					// {x: 'time', y: 'ecliptic.z', title: 'ecliptic z-coord', description: ''},
					// {x: 'ecliptic.x', y: 'ecliptic.y', title: 'ecliptic (x,y)-coords', description: ''},
					// {x: 'ecliptic.x', y: 'ecliptic.z', title: 'ecliptic (x,z)-coords', description: ''},
					// {x: 'ecliptic.y', y: 'ecliptic.z', title: 'ecliptic (y,z)-coords', description: ''},

					{x: 'time', y: 'equatorial.x', title: 'equatorial x-coord', description: ''},
					{x: 'time', y: 'equatorial.y', title: 'equatorial y-coord', description: ''},
					{x: 'time', y: 'equatorial.z', title: 'equatorial z-coord', description: ''},
					{x: 'equatorial.x', y: 'equatorial.y', title: 'equatorial (x,y)-coords', description: ''},
					{x: 'equatorial.x', y: 'equatorial.z', title: 'equatorial (x,z)-coords', description: ''},
					{x: 'equatorial.y', y: 'equatorial.z', title: 'equatorial (y,z)-coords', description: ''},
					// {x: 'time', y: 'ecliptic_latlng.lng', title: 'ecliptic longitude (horizontal angle)', description: ''},
					// {x: 'time', y: 'ecliptic_latlng.lat', title: 'ecliptic latitude (vertical angle)', description: ''},
					// {x: 'ecliptic_latlng.lng', y: 'ecliptic_latlng.lat', title: 'ecliptic (lng, lat)-coords', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
					// {x: 'time', y: '', title: '', description: ''},
				],
			};
		},
	}
</script>
