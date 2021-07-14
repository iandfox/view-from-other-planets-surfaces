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
		<div class="range-wrapper">
			<label>JD:</label>
			<input
				type="range"
				v-model.number="JD"
				:min="2459400"
				:max="2459500"
				:step="0.0001"
				@change="draw"
			/>
			<span class="min">2459400</span>
			<span class="max">2459500</span>
			<span class="value">{{numberFormat.format(JD)}}</span>
		</div>
		<div style="font-size: 0.8em;">
			<label><input type="checkbox" v-model="isAuto"> Auto</label>
			<div>Rate: <input type="number" v-model="autoRate" step="0.001"></div>
		</div>
	</div>
	<div class="space">
		<canvas width="1600" height="800" id="stars" ref="stars"></canvas>
		<canvas width="1600" height="800" id="space" ref="space"></canvas>
	</div>
</template>

<script>
	import {MoonOrbitalBody} from '../calculations/OrbitalBodies/MoonOrbitalBody.class';
	import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
	import {AzimuthalCoordinates} from '../calculations/Utils/AzimuthalCoordinates.class';
	import {Space} from '../SpaceDrawing/Space.class';
	import { ref, toRaw } from 'vue';
	
	export default {
		name: 'ViewFromGround',
		components: {},
		
		data() {
			return {
				space: null,
				
				isAuto: true,
				autoRate: 0.001,
				
				intervalIds: [],
				
				// TODO: limit the viewport and be able to drag it around
				viewport: {
					bottom: -180,
					top:     180,
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
				document.getElementById('space'),
				document.getElementById('stars'),
				this.viewport,
				toRaw(this.moon),
				toRaw(this.sun)
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
		/*box-shadow: 0 0 5px 0 white;*/
		
		position: fixed;
		top: 0; left: 0; right: 0; bottom: 0;
	}
	
	#stars {
		z-index: 10;
	}
	#space {
		z-index: 20;
	}
	
	/*#stars { display: none; }*/
	
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
	
	/* range slider related styles TODO 2021-07-11: this is a great idea for a generic/util component, i should turn it into one. Well... not me. You. Yes, you, Future Ian. :wave: */
	.range-wrapper {
		font-size: 11px;
		display: grid;
		grid-template-areas:
			" .  label  ."
			"min input max"
			" .   val   . "
	;
		grid-template-columns:
			minmax(50px, fit-content) minmax(200px, 1fr) minmax(50px, fit-content);
	}
	.range-wrapper label {
		font-weight: bold;
		grid-area: label;
		text-align: center;
	}
	.range-wrapper input[type="range"] {
		grid-area: input;
		
	}
	.range-wrapper .min {
		grid-area: min;
		text-align: right;
	}
	.range-wrapper .max {
		grid-area: max;
		text-align: left;
	}
	.range-wrapper .value {
		grid-area: val;
		text-align: center;
		min-width: 220px
	}
	.range-wrapper .value small code {
		display: inline-block;
	}
	.range-wrapper .value small code span {
		display: inline-block;
		min-width: 5ch;
		text-align: right;
	}
</style>
