<!--
 - Vue Component: Timer
 -     Counts seconds since a given starting epoch (default is Date.now())
 -     
 -     Example usage:
 -         <Timer
 -             :start-epoch="12345" (optional. default is Date.now())
 -         ></Timer>
 -
 -     Example with custom template:
 -         <Timer>
 -             It has been {{pretty}} seconds since render.
 -         </Timer>
 -
 - @created 2021-07-10
-->

<template>
	<slot>
		{{pretty}} seconds ago
	</slot>
</template>

<script>
	export default {
		name: 'Timer',
		
		props: {
			startEpoch: {
				type: [String, Number],
				required: false,
				default: Date.now(),
			},
		},
		
		data() {
			return {
				numberFormat: new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: 1,
						maximumFractionDigits: 1
					}
				),
				timerLoopingId: 0, // either animation id or timeout id or interval id, apparently depending on how many times i change my mind.
				secondsSinceLastUpdate: 0,
			};
		},
		
		computed: {
			/** formatted seconds since startEpoch */
			pretty() {
				return this.numberFormat.format(this.secondsSinceLastUpdate);
			},
		},
		
		mounted() {
			const timer = () => {
				this.secondsSinceLastUpdate = (Date.now() - this.startEpoch) / 1000;
				// this.timerLoopingId = setTimeout(timer, 1000);
				this.timerLoopingId = requestAnimationFrame(timer);
			};
			timer();
		},
		
		unmounted() {
			// lol since i can't decide what to use, i wonder if there's any harm in using all of them
			clearTimeout(this.timerLoopingId);
			clearInterval(this.timerLoopingId);
			cancelAnimationFrame(this.timerLoopingId);
		},
	}
</script>

<style scoped>

</style>
