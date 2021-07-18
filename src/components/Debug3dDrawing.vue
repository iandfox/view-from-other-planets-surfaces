<!--
 - Vue Component: Debug3dDrawing
 -     Does some stuff.
 -     
 -     Example usage:
 -         <Debug3dDrawing
 -             :space="space"
 -         ></Debug3dDrawing>
 - 
 - @created 2021-07-18
-->

<template>
	<!--<canvas id="drawing3d" ref="3d-drawing" width="400" height="400"></canvas>-->
</template>

<script>
	import {Drawing} from '../calculations/Drawing.class';
	import { to2d } from '../calculations/Drawing3DProjections';
	
	export default {
		name: 'Debug3dDrawing',
		
		props: {
			space: Object,
		},
		
		data() {
			return {
				canvas: null,
				drawing: null,
				
				tails: [],
				maxTailLength: 100,
			};
		},
		
		mounted() {
			this.canvas = this.$refs['3d-drawing'];
			this.drawing = new Drawing(this.canvas, {x: 0, y: 0}, {left: -1, right: 1, bottom: -1, top: 1});
			this.draw();
		},
		
		watch: {
			space: {
				handler() {
					if (this.space && this.space.moons) {
						const bodies = (
							[this.space.sun, ...this.space.moons, ...this.space.planets]
						);
						bodies.forEach((ob, index) => {
							if (! this.tails[index]) { this.tails[index] = []; }
							const {x, y, z} = ob.equatorialCoordinates;
							const {x: x2d, y: y2d} = to2d(x, y, z);
							
							// Track the tail
							this.tails[index].unshift({x: x2d, y: y2d});
							console.log(this.tails);
							if (this.tails[index].length > this.maxTailLength) {
								this.tails[index].pop();
							}
							this.tails[index].forEach((tail, tailIndex) => {
								console.log(tail);
								this.drawing.circle(tail.x, tail.y, 1, ob.color);
							});
						});
					}
					
					
					this.draw();
				},
				deep: true,
			},
		},
		
		methods: {
			draw() {
				if (this.space && this.space.moons) {
					const bodies = (
						[this.space.sun, ...this.space.moons, ...this.space.planets]
					);
					this.drawing.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
					
					const {x: z_x, y: z_y} = to2d(0, 0, 1);
					const {x: z_n_x, y: z_n_y} = to2d(0, 0, -1);
					
					// x1_s, y1_s, x2_s, y2_s, color = 'white', lineWidth = 1, canvas = this.canvas, ctx = this.ctx
					// Draw axes
					this.drawing.line(z_n_x, z_n_y, z_x, z_y, 'white');
					
					this.drawing.circle(0, 0, 10, 'teal');
					
					bodies.forEach((ob, index) => {
						const {x, y, z} = ob.equatorialCoordinates;
						const {x: x2d, y: y2d} = to2d(x, y, z);
						
						// Draw the body
						this.drawing.circle(x, y, 5, ob.color);
					});
				}
			},
		},
	}
</script>

<style scoped>
	#drawing3d {
		position: fixed;
		right: 0;
		top: 0;
		z-index: 9999;
		border: solid 1px white;
	}
</style>
