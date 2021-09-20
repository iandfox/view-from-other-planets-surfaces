<!--
 - Vue Component: MoonBody
 -     Draws the Moon in its current position
 -
 -     Example usage:
 -         <MoonBody
 -             :moon="moonOrbitalBodyInstance"
 -             :color="'teal'"
 -             :radius="2"
 -             :x-key="'RA_deg'"
 -             :y-key="'Decl_deg'"
 -         ></MoonBody>
 -
 - @created 2021-09-18
 -
 - @since 2021-09-18
-->

<template>
	<circle
		:cx="moon[xKey]"
		:cy="moon[yKey]"
		:r="radius"
		:fill="color"
		stroke="transparent"
		stroke-width="0"
	/>
</template>

<script>
	export default {
		name: 'MoonBody',
		
		props: {
			moon: {
				type: Object, // Instance of `MoonOrbitalBody` class
				required: true,
			},
			color: {
				type: String,
				default: 'lightblue',
			},
			radius: {
				type: Number,
				default: 4,
			},
			xKey: {
				type: String,
				default: 'RA_deg',
			},
			yKey: {
				type: String,
				default: 'Decl_deg',
			}
		},
		
		data() {
			return {
				cssTransitionTime: '0.1s',
			};
		},
		
		computed: {
			x() {
				const xKeys = this.xKey.split('.');
				let val = this.moon;
				xKeys.forEach((key) => {
					val = val[key];
				});
				return val;
			},
			
			y() {
				const yKeys = this.yKey.split('.');
				let val = this.moon;
				yKeys.forEach((key) => {
					val = val[key];
				});
				return val;
			},
		},
		
		
		watch: {
			x(newValue, oldValue) {
				if (Math.sign(newValue) !== Math.sign(oldValue) && Math.abs(newValue) > 20) { // ugly hack to see if it goes across screen, but ignore when it goes across an axis. "20" is magic num
					this.pauseCssTransitions();
				}
			},
			
			y(newValue, oldValue) {
				if (Math.sign(newValue) !== Math.sign(oldValue) && Math.abs(newValue) > 20) { // ugly hack to see if it goes across screen, but ignore when it goes across an axis
					this.pauseCssTransitions();
				}
			},
		},
		
		methods: {
			pauseCssTransitions() {
				// don't want objects to transition incorrectly across screen
				this.cssTransitionTime = '0s';
				
				setTimeout(() => {
					this.cssTransitionTime = '0.1s';
				}, 100);
			}
		},
	}
</script>

<style scoped>
	circle {
		transition-duration: v-bind(cssTransitionTime);
	}
</style>
