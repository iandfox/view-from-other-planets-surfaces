<!--
 - Vue Component: PlotPath
 -     Does some stuff.
 -     
 -     Example usage:
 -         <PlotPath
 -             :foo="bar"
 -         ></PlotPath>
 - 
 - @created 10/25/2021
 - 
 - @since x.x.x
-->

<template>
	<ClampedPath
		:color="ob.color"
		:path="path"
		:stroke-width="strokeWidth"
	/>
</template>

<script>
import ClampedPath              from './bodies/ClampedPath';
import BodyTail                 from './bodies/BodyTail';
import { AzimuthalCoordinates } from '../calculations/Utils/AzimuthalCoordinates.class';

export default {
	name: 'PlotPath',
	components: {ClampedPath, BodyTail},
	props: {
		ob: Object,
		sun: Object,
		xKey: String,
		yKey: String,
		jdStart: Number,
		jdDelta: Number,
		jdStep: Number,
		strokeWidth: {
			type: Number,
			default: 0.2,
		},
	},

	data() {
		return {
			obClone: null,
			sunClone: null,
		}
	},

	computed: {
		path() {
			const p = [];
			if (this.obClone) {
				for (let t = this.jdStart; t < this.jdEnd; t += this.jdStep) {
					this.obClone.JD = t;
					this.sunClone.JD = t;
					p.push({x: this.obClone[this.xKey], y: this.obClone[this.yKey]});
				}
			} else {
				console.warn('no obClone found. path is probably empty');
			}
			console.log('path in PlotPath:', p);
			return p;
		},
	},

	methods: {
		cloneBodies() {
			this.sunClone = this.sun.clone();
			this.obClone = this.ob.clone();
			this.obClone.azi = new AzimuthalCoordinates(this.obClone, this.sunClone);
		},
	},

	created() {
		this.cloneBodies();
	},
}
</script>

<style scoped>

</style>
