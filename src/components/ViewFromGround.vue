<!--
 - Vue Component: ViewFromGround
 -     Does some stuff.
 -     
 -     Example usage:
 -         <ViewFromGround></ViewFromGround>
 - 
 - @created 2021-07-12
-->

<template>
	<ChartsViewer
		name="View from ground (1 day)"
		:charts="charts"
		:class-instance="observerCoordinates"
		:julian-day-start="2459404.5"
		:julian-day-end="2459405.5"
		:julian-day-step="0.01"
		:is-delayed="true"
	></ChartsViewer>
</template>

<script>
	import {ObserverCoordinates} from '../calculations/ObserverCoordinates.class';
	import ChartsViewer from './utils/ChartsViewer';
	import {Moon} from '../calculations/Moon.class';
	import {SolarCoordinates} from '../calculations/SC.class';
	
	export default {
		name: 'ViewFromGround',
		components: {ChartsViewer},
		
		data() {
			return {
				sun: new SolarCoordinates(2459404.5),
				moon: new Moon(2459404.5),
				
				observerCoordinates: null,
				
				charts: [
					{x: 'time', y: 'JD', title: 'JD (sanity check)', description: ''},
					{x: 'time', y: 'GMST_deg', title: 'GMST_deg', description: ''},
					{x: 'time', y: 'LST_deg', title: 'LST_deg', description: ''},
					{x: 'time', y: 'HA_deg', title: 'HA_deg', description: ''},
					
					
					{x: 'time', y: 'o.geocentric.x', title: 'o.geocentric.x', description: ''},
					{x: 'time', y: 'o.geocentric.y', title: 'o.geocentric.y', description: ''},
					{x: 'time', y: 'o.geocentric.z', title: 'o.geocentric.z', description: ''},
					{x: 'o.geocentric.x', y: 'o.geocentric.y', title: 'o.geocentric (x,y)', description: ''},
					{x: 'time', y: 'o.ecliptic_latlng.lng_deg', title: 'o.ecliptic_latlng.lng_deg', description: ''},
					
					
					{x: 'time', y: 'azimuthal.x', title: 'azimuthal.x', description: ''},
					{x: 'time', y: 'azimuthal.y', title: 'azimuthal.y', description: ''},
					{x: 'time', y: 'azimuthal.z', title: 'azimuthal.z', description: ''},
					{x: 'azimuthal.x', y: 'azimuthal.y', title: 'azimuthal (x,y)', description: ''},
					{x: 'time', y: 'azimuthal.az_deg', title: 'azimuthal.az_deg', description: ''},
					{x: 'time', y: 'azimuthal.alt_deg', title: 'azimuthal.alt_deg', description: ''},
					{x: 'azimuthal.az_deg', y: 'azimuthal.alt_deg', title: 'azimuthal (az_deg, alt_deg)', description: ''},
				],
			}
		},
		
		created() {
			const tucson = {
				lng: -111.01908142663117,
				lat: 32.198840114469995,
				UT: -7
			};
			this.observerCoordinates = new ObserverCoordinates(tucson.lng, tucson.lat, tucson.UT, this.moon, this.sun);
		},
	}
</script>
