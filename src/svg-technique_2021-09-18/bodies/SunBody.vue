<!--
 - Vue Component: SunBody
 -     Draws the Sun in its current position
 -     
 -     Example usage:
 -         <SunBody
 -             :sun="sunOrbitalBodyInstance"
 -             :color="'darkgoldenrod'"
 -             :radius="20"
 -             :x-key="'RA_deg'"
 -             :y-key="'Decl_deg'"
 -         ></SunBody>
 - 
 - @created 2021-09-18
 - 
 - @since 2021-09-18
-->







<!--
NOT USED AT THE MOMENT
    cause the MoonBody and the SunBody ended up being exactly the same and I was tired of editing two files. They
    should definitely be different (e.g. for solar eclipses right?) but for now i'm gonna JUST update the MoonBody file.
    SunBody should get copy/pasted if and when i need it again.
    - Ian 2019-09-20 @ 10:35 PM
-->









<template>
	<BodyTail
		:tail="history"
		:color="color"
	/>
	<circle
		:cx="x"
		:cy="y"
		:r="radius"
		:fill="color"
		stroke="transparent"
		stroke-width="0"
	/>
</template>

<script>
	import BodyTail from './BodyTail';
	
	export default {
		name: 'SunBody',
		components: { BodyTail },
		props: {
			// sun: {
			// 	type: Object, // Instance of `SunOrbitalBody` class
			// 	required: true,
			// },
			color: {
				type: String,
				default: 'darkgoldenrod',
			},
			radius: {
				type: Number,
				default: 10,
			},
			// xKey: {
			// 	type: String,
			// 	default: 'RA_deg',
			// },
			// yKey: {
			// 	type: String,
			// 	default: 'Decl_deg',
			// },
			x: {
				type: Number,
			},
			y: {
				type: Number,
			}
		},
		
		data() {
			return {
				cssTransitionTime: '0.1s',
				history: [],
				isAddingToHistory: false,
			};
		},
		
		watch: {
			x() {
				if (! this.isAddingToHistory) {
					this.isAddingToHistory = true;
					this.addCurrentToHistory();
					this.isAddingToHistory = false;
				}
			},
			y() {
				if (! this.isAddingToHistory) {
					this.isAddingToHistory = true;
					this.addCurrentToHistory();
					this.isAddingToHistory = false;
				}
			},
		},
		
		methods: {
			addCurrentToHistory() {
				this.history.push({x: this.x, y: this.y});
				if (this.history.length > 100) {
					this.history.shift();
				}
			},
		},
	}
</script>

<style scoped>
	circle {
		/*transition-duration: v-bind(cssTransitionTime);*/
	}
</style>
