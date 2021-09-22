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
		// TODO 2021-09-20: maybe just make this a more generic "body" ?
		name: 'MoonBody',
		components: {BodyTail},
		props: {
			color: {
				type: String,
				default: 'lightblue',
			},
			radius: {
				type: Number,
				default: 4,
			},
			x: {
				type: Number,
			},
			y: {
				type: Number,
			},
		},
		
		data() {
			return {
				history: [],
				isAddingToHistory: false,
				typicalTailLength: 10,
				
				radiusOfRepetition: Math.pow(10, 2), // make sure it's squared, cause i don't wanna do a square root every frame.
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
				
				if (this.history.length > this.typicalTailLength) {
					this.history.shift();
					return;
				} else if (this.history.length > 100) { // don't look at it too soon, or it'll trigger the new, smaller size of tail length
					// stop recording history (and observe what index we're at) if we have gotten sufficiently close to the zeroth history item -- i.e. we are starting to repeat.
					if ((Math.pow(this.history[this.history.length - 1].x - this.history[0].x, 2) + Math.pow(this.history[this.history.length - 1].y - this.history[0].y, 2)) < this.radiusOfRepetition) {
						console.log('new tail length', this.history.length); // todo delete
						this.typicalTailLength = 0.9 * this.history.length;
						this.history.shift();
						return;
					}
				}
			},
		},
	}
</script>
