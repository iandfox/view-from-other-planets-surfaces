<!--
 - Vue Component: ClampedPath
 -     Does some stuff.
 -     
 -     Example usage:
 -         <ClampedPath
 -             :path="path"
 -             :color="ob.color"
 -             :stroke-width="1"
 -         ></ClampedPath>
 - 
 - @created 10/25/2021
 - 
 - @since x.x.x
-->

<template>
	<path :d="svgPath" fill="none" :stroke="color" :stroke-width="strokeWidth"/>
</template>

<script>
export default {
	name: 'ClampedPath',

	props: {
		path: Array,
		strokeWidth: {
			type: [Number, String],
			default: 0.2,
		},
		color: {
			type: String,
			default: 'hsl(1222deg, 50%, 50%)',
		},
	},

	computed: {
		svgPath() {
			let d = 'M';
			this.path.forEach(({x, y}, index) => {
				if (index > 0) {
					d += ', ';
					const {x: lastX, y: lastY} = this.path[index - 1];
					if (x < lastX) {
						// i'm never gonna plot from right to left, so this is sufficient!
						d += 'M';
					} else {
						d += 'L';
					}
				}
				d += `${x} ${y}`;
			});
			return d;
		},
	},

	methods: {
		addToPath(x, y, isNewLessThanOld = false) {
			if (this.path === '') {
				this.path += 'M';
			} else if (isNewLessThanOld) {
				this.path += ', M';
			} else {
				this.path += ', L';
			}
			this.path += x + ' ' + y;
		},
	},

}
</script>

<style scoped>

</style>
