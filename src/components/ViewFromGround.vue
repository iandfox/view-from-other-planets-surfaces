<!--
 - Vue Component: ViewFromGround
 -     Like a stellarium in my browser.
 -     
 -     Example usage:
 -         <ViewFromGround></ViewFromGround>
 - 
 - @created 2021-07-13
-->

<template>
	<div class="controls">
		<InputRange
			v-model="JD"
			label="JD"
			:min="0"
			:max="365"
			:step="autoRate"
			:fraction-digits="4"
		></InputRange>
		<div style="font-size: 0.8em;">
			<label><input type="checkbox" v-model="isAuto"> Auto</label>
			<div>Rate: <input type="number" v-model.number="autoRate" step="0.001"></div>
		</div>
	</div>
	
	<div class="space">
		<canvas width="1600" height="800" id="stars" ref="stars"></canvas>
		<canvas width="1600" height="800" id="space" ref="space"></canvas>
		<canvas width="1600" height="800" id="ground" ref="ground"></canvas>
	</div>
</template>

<script>
	import {MoonOrbitalBody} from '../calculations/OrbitalBodies/MoonOrbitalBody.class';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
	import {AzimuthalCoordinates} from '../calculations/Utils/AzimuthalCoordinates.class';
	import {Space} from '../SpaceDrawing/Space.class';
	import { ref, toRaw } from 'vue';
	import InputRange from './fields/InputRange';
	
	export default {
		name: 'ViewFromGround',
		components: {InputRange},
		
		data() {
			return {
				space: null,
				
				isAuto: true,
				autoRate: 0.001,
				
				intervalIds: [],
				
				// TODO: limit the viewport and be able to drag it around
				viewport: {
					bottom: -90,
					top:     90,
					left:   -180,
					right:   180,
				},
				
				numberFormat: new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: 4,
						maximumFractionDigits: 4
					}
				),
			}
		},
		
		setup() {
			const JD   = ref(0); //ref(2459404.5);
			const moon = new MoonOrbitalBody(JD.value);
			const sun  = new SunOrbitalBody(JD.value);
			
			return {
				JD,
				moon,
				sun,
			}
		},
		
		mounted() {
			this.space = new Space(
				document.getElementById('stars'),
				document.getElementById('space'),
				document.getElementById('ground'),
				this.viewport,
				toRaw(this.sun),
				[toRaw(this.moon)],
				[] // planets
			);
			this.space.drawBackground(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			this.space.drawStars(this.space.starsCanvas, this.space.starsCanvas.getContext('2d'));
			this.draw();
			
			this.loop();
		},
		
		unmounted() {
			this.intervalIds.forEach((id) => {
				clearTimeout(id);
				clearInterval(id);
				cancelAnimationFrame(id);
			});
		},
		
		watch: {
			JD() {
				this.space.JD = parseFloat(this.JD);
				this.space.draw();
			}
		},
		
		methods: {
			draw() {
				this.space.draw();
			},
			
			loop() {
				this.intervalIds = []; // TODO i dunno, do this better.
				if (this.isAuto) {
					if (! this.autoRate) {
						this.isAuto = 0;
					} else {
						this.JD += parseFloat(this.autoRate);
					}
				}
				this.intervalIds.push(requestAnimationFrame(() => {
					this.loop();
				}))
			},
		},
	}
</script>

<style scoped>
	.space {
	}
	
	#space, #stars {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		display: block;
		
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
	}
	
	#stars {
		z-index: 10;
	}
	#space {
		z-index: 20;
	}
	#ground {
		z-index: 30
	}
	
	.controls {
		position: fixed;
		bottom: 0;
		left: 50%;
		transform: translate(-50%);
		background: rgba(255, 255, 255, 0.5);
	}
	
	input, code {
		color: white;
	}
</style>
