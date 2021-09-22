<!--
 - Vue Component: BodyTail
 -     shows the "tail" of a body trailing behind it.
 -     
 -     Example usage:
 -         <BodyTail
 -             :tail="positionHistoryArray" // an array of {x,y} objects: [ {x: number, y: number}, ... ]
 -             :color="color"
 -         ></BodyTail>
 - 
 - @created 2021-09-20
 - 
 - @since 2021-09-20
-->

<template>
	<path :d="path" fill="none" :stroke="color" stroke-width="0.2" />
</template>

<script>
	export default {
		name: 'BodyTail',
		
		props: {
			tail: {
				type: Array,
				required: true,
			},
			color: {
				type: String,
				required: false,
				default: 'white',
			}
		},
		
		data() {
			return {
				path: '',
			};
		},
		
		computed: {
			lastX() {
				if (this.tail.length > 2) {
					return this.tail[this.tail.length - 1].x;
				}
				return -1;
			},
		},
		
		watch: {
			lastX(newValue, oldValue) {
				this.addToPath(newValue, this.tail[this.tail.length - 1].y, (newValue < oldValue));
			},
			
			tail(newValue, oldValue) {
				if (newValue.length !== oldValue.length) {
					const {x, y} = this.tail[this.tail.length - 1];
					this.addToPath(x, y, (newValue.x < oldValue.x));
				}
			}
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
