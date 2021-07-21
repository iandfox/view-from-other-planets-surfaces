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
	<div id="drawing3d">
		<canvas id="" ref="3d-drawing" width="400" height="400"></canvas>
		<InputRange
			v-model="perspectiveAngle"
			label="Perspective Angle"
			:min="-180"
			:max="180"
		></InputRange>
	</div>
</template>

<script>
	import {Drawing} from '../calculations/Drawing.class';
	import { to2d } from '../calculations/Drawing3DProjections';
	import InputRange from './fields/InputRange';
	
	export default {
		name: 'Debug3dDrawing',
		components: {InputRange},
		props: {
			space: Object,
		},
		
		data() {
			return {
				canvas: null,
				drawing: null,
				
				tails: [],
				maxTailLength: 100,
				perspectiveAngle: 30,
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
							
							// Track the tail
							this.tails[index].unshift(to2d(x, y, z, this.perspectiveAngle));
							if (this.tails[index].length > this.maxTailLength) {
								this.tails[index].pop();
							}
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
					
					const axes = {
						x: {
							start: to2d(-1, 0, 0, this.perspectiveAngle),
							end:   to2d(1, 0, 0, this.perspectiveAngle),
						},
						y: {
							start: to2d(0, -1, 0, this.perspectiveAngle),
							end:   to2d(0, 1, 0, this.perspectiveAngle),
						},
						z: {
							start: to2d(0, 0, -1, this.perspectiveAngle),
							end:   to2d(0, 0, 1, this.perspectiveAngle),
						}
					};
					
					// Draw axes
					this.drawing.line(axes.x.start.x, axes.x.start.y, axes.x.end.x, axes.x.end.y, 'white');
					this.drawing.line(axes.y.start.x, axes.y.start.y, axes.y.end.x, axes.y.end.y, 'white');
					this.drawing.line(axes.z.start.x, axes.z.start.y, axes.z.end.x, axes.z.end.y, 'white');
					
					this.drawing.circle(0, 0, 10, 'skyblue');
					
					bodies.forEach((ob, index) => {
						const {x, y, z} = ob.equatorialCoordinates;
						const {x: x2d, y: y2d} = to2d(x, y, z, this.perspectiveAngle);
						
						// Draw a line from object to xy-plane
						const {x: plane_x2d, y: plane_y2d} = to2d(x, 0, z, this.perspectiveAngle);
						this.drawing.ctx.globalAlpha = 0.5;
						this.drawing.line(x2d, y2d, plane_x2d, plane_y2d, 'yellow');
						this.drawing.ctx.globalAlpha = 1;
						
						// Draw the body
						this.drawing.circle(x2d, y2d, 5, ob.color);
					});
					
					
					bodies.forEach((ob, index) => {
						this.drawing.ctx.globalAlpha = 1 - (index / this.maxTailLength);
						if (this.tails[index]) {
							this.tails[index].forEach((tail, tailIndex) => {
								this.drawing.circle(tail.x, tail.y, 1, ob.color);
							});
						}
					});
					// Reset alpha
					this.drawing.ctx.globalAlpha = 1;
					
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
