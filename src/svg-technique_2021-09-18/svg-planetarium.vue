<!--
 - Vue Component: svg-planetarium
 -     Shows orbits
 -     
 -     Example usage:
 -         <svg-planetarium></svg-planetarium>
 - 
 - @created 2021-09-18
 - 
 - @since 2021-09-18
-->

<template>
	<div class="form">
		<div class="inline stacked fields">
			<label>Julian Date</label>
			<div class="input">
				
				<div class="buttons">
					<button type="button" @click="stop()" class="dark" :style="{opacity: ((config.isPlaying) ? 1 : 0)}"><i class="fa fa-pause"></i></button>
					<input
						type="text"
						readonly
						:style="{opacity: ((config.isPlaying && config.autoplayStep <= 0) ? 0.3 : 0), width: '7ch'}"
						:value="config.autoplayStep"
					/>
					
					<button type="button" @click="playFaster(-1)" title="autoplay controls: go backwards faster"><i class="fa fa-angle-double-left"></i></button>
					<button type="button" @click="startPlaying(-7)" title="autoplay controls: step = -7"><i class="fa fa-fast-backward"></i></button>
					<button type="button" @click="startPlaying(-1)" title="autoplay controls: step = -1"><i class="fa fa-backward"></i></button>
					<button type="button" @click="startPlaying(-1/24)" title="autoplay controls: step = -1/24"><i class="fa fa-chevron-left"></i></button>
					
					<button type="button" @click="julianDate -= 28"    class="dark">-4 Weeks</button>
					<button type="button" @click="julianDate -= 7"    class="dark">-1 Week</button>
					<button type="button" @click="julianDate -= 1"    class="dark">-1 Day</button>
					<button type="button" @click="julianDate -= 1/24" class="dark">-1 Hour</button>
					
					<input
						type="number"
						v-model="julianDate"
						min="0"
						max="99999999999"
						step="0.00001"
					/>
					
					<button type="button" @click="julianDate += 1/24" class="dark">+1 Hour</button>
					<button type="button" @click="julianDate += 1"    class="dark">+1 Day</button>
					<button type="button" @click="julianDate += 7"    class="dark">+1 Week</button>
					<button type="button" @click="julianDate += 4"    class="dark">+4 Weeks</button>
					
					<button type="button" @click="startPlaying(1/24)" title="autoplay controls: step = 1/24"><i class="fa fa-chevron-right"></i></button>
					<button type="button" @click="startPlaying(1)" title="autoplay controls: step = 1"><i class="fa fa-forward"></i></button>
					<button type="button" @click="startPlaying(7)" title="autoplay controls: step = 7"><i class="fa fa-fast-forward"></i></button>
					<button type="button" @click="playFaster()" title="autoplay controls: go forwards faster"><i class="fa fa-angle-double-right"></i></button>
					
					<input
						type="text"
						readonly
						:style="{opacity: ((config.isPlaying && config.autoplayStep >= 0) ? 0.3 : 0), width: '7ch'}"
						:value="config.autoplayStep"
					/>
					<button type="button" @click="stop()" class="dark" :style="{opacity: ((config.isPlaying) ? 1 : 0)}"><i class="fa fa-pause"></i></button>
				</div>
				
			</div>
		</div>
	</div>
	
	<svg version="1.1" xmlns="http://www.w3.org/2000/svg"
	     width="100%"
	     viewBox="-180 -90 360 180"
	>
		<Axes
			:color="config.tickMark.color"
			:gap="config.tickMark.gap"
			:halfLength="config.tickMark.halfLength"
			:width="config.tickMark.width"
		/>
		
		<SunBody
			:sun="sun"
			:color="'darkgoldenrod'"
			:radius="5"
			:x-key="'RA_deg'"
			:y-key="'Decl_deg'"
		/>
		
		<MoonBody
			:moon="moons[0]"
			:color="moons[0].color"
			:radius="moons[0].radius"
			:x-key="'RA_deg'"
			:y-key="'Decl_deg'"
		/>
		
		<!--
		<MoonBody
			:moon="moons[1]"
			:color="moons[1].color"
			:radius="moons[1].radius"
			:x-key="'RA_deg'"
			:y-key="'Decl_deg'"
		/>
		
		<MoonBody
			:moon="moons[2]"
			:color="moons[2].color"
			:radius="moons[2].radius"
			:x-key="'RA_deg'"
			:y-key="'Decl_deg'"
		/>
		-->
		
		<!--
		
		for my own reference:
		    (mdn has good tutorial for it)
		
		<rect width="100%" height="100%" fill="rgba(255,200,100,0.5)" />
		<circle cx="150" cy="100" r="80" fill="green"></circle>
		<text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
		<rect x="10" y="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
		<rect x="60" y="10" rx="10" ry="10" width="30" height="30" stroke="black" fill="transparent" stroke-width="5"/>
		
		<circle cx="25" cy="75" r="20" stroke="red" fill="transparent" stroke-width="5"/>
		<ellipse cx="75" cy="75" rx="20" ry="5" stroke="red" fill="transparent" stroke-width="5"/>
		
		<line x1="10" x2="50" y1="110" y2="150" stroke="orange" stroke-width="5"/>
		<polyline points="60 110 65 120 70 115 75 130 80 125 85 140 90 135 95 150 100 145"
		          stroke="orange" fill="transparent" stroke-width="5"/>
		
		<polygon points="50 160 55 180 70 180 60 190 65 205 50 195 35 205 40 190 30 180 45 180"
		         stroke="green" fill="transparent" stroke-width="5"/>
		
		<path d="M20,230 Q40,205 50,230 T90,230" fill="none" stroke="blue" stroke-width="5"/>
		-->
	</svg>
</template>

<script>
	import { AzimuthalCoordinates } from '../calculations/Utils/AzimuthalCoordinates.class';
	import { MoonOrbitalBody }      from '../calculations/OrbitalBodies/MoonOrbitalBody.class';
	import MoonBody                 from './bodies/MoonBody';
	import SunBody                  from './bodies/SunBody';
	import useNumberFormat          from '../composables/useNumberFormat';
	import Axes                     from './gui/Axes';
	import { reactive, ref }        from 'vue';
	import { SunOrbitalBody }       from '../calculations/OrbitalBodies/SunOrbitalBody.class'
	
	export default {
		name: 'svg-planetarium',
		
		components: {MoonBody, SunBody, Axes},
		
		setup() {
			const { format } = useNumberFormat();
			const sun = reactive(new SunOrbitalBody(2459404.5));
			
			const moons = ref([]);
			const planets = ref([]);
			
			const moonsParams = [
				{
					name: 'Moon', // Earth's Moon
					color: 'grey',
					radius: 5,
					N: [125.1228, -0.0529538083],
					i: [5.1454, 0],
					w: [318.0634, 0.1643573223],
					a: [60.2666, 0], // in Earth radii
					e: [0.054900, 0],
					M: [115.3654, 13.0649929509],
				},
				{
					name: 'F\'an',
					color: 'orange',
					radius: 15,
					N: [125.1228, - 0.0529538083],
					i: [35.1454, 0],
					w: [318.0634, 0.1643573223],
					a: [60.2666, 0], // in Earth radii
					e: [0.054900, 0],
					M: [0.3654, 53.0649929509],
				},
				{
					name: 'Gomor',
					color: 'teal',
					radius: 40,
					N: [125.1228, -0.0529538083],
					i: [5.1454, 0],
					w: [8.0634, 0.1643573223],
					a: [1.2666, 0], // in Earth radii
					e: [0.054900, 0],
					M: [300.3654, 13.0649929509],
				}
			];
			
			// TODO: Do the instances need to be reactive, as we did above? i think that since they're in a `ref` array they are already there, but i'll have to refresh my memory
			moons.value.push(new MoonOrbitalBody(2459404.5, moonsParams[0], {
				color:  moonsParams[0].color,
				radius: moonsParams[0].radius,
				name:   moonsParams[0].name,
			}));
			
			moons.value.push(new MoonOrbitalBody(2459404.5, moonsParams[1], {
				color:  moonsParams[1].color,
				radius: moonsParams[1].radius,
				name:   moonsParams[1].name,
			}));
			
			moons.value.push(new MoonOrbitalBody(2459404.5, moonsParams[2], {
				color:  moonsParams[2].color,
				radius: moonsParams[2].radius,
				name:   moonsParams[2].name,
			}));
			
			sun.azi = new AzimuthalCoordinates(sun, sun);
			moons.value.forEach((moon) => {
				moon.azi = new AzimuthalCoordinates(moon, sun);
			});
			
			return {
				format,
				sun,
				moons,
				planets,
			}
		},
		
		data() {
			return {
				julianDate: 2459404.5,
				
				config: {
					tickMark: {
						color: 'yellow',
						gap: 10,
						halfLength: 2,
						width: 0.2
					},
					
					localLongitude: -111.01908142663117,
					localLatitude: 32.198840114469995,
					obliquity: 23.4393,
					
					intervalIds: [],
					isPlaying: true,
					autoplayStep: 0.1,
					
					// viewport: {
					// 	bottom: -90,
					// 	top:     90,
					// 	left:   -180,
					// 	right:   180,
					// },
					
					keys: [
						'N_deg',
						'i_deg',
						'w_deg',
						'a',
						'e',
						'M_deg',
						'v_deg',
						'r',
						'E_deg',
						'w1_deg',
						'L_deg',
						'q',
						'Q',
						'P',
						'T',
						'ecl_deg',
						'RA',
						'RA_deg',
						'Decl',
						'Decl_deg',
						'eclipticCoordinates.x',
						'eclipticCoordinates.y',
						'eclipticCoordinates.z',
						'equatorialCoordinates.x',
						'equatorialCoordinates.y',
						'equatorialCoordinates.z',
						'azi.HA_deg',
						'azi.HA',
						'azi.alt_az',
						'azi.alt',
						'azi.az',
					],
				},
			};
		},
		
		watch: {
			julianDate(newJD) {
				this.sun.JD = newJD;
				this.moons.forEach((moon) => {
					moon.JD = newJD;
				});
			},
		},
		
		methods: {
			
			startPlaying(autoplayStep = 0.1) {
				this.config.isPlaying = true;
				this.config.autoplayStep = autoplayStep;
				
				this.clearIntervals();
				const intervalId = setInterval(() => {
					this.julianDate += this.config.autoplayStep;
				}, 100);
				this.config.intervalIds.push(intervalId);
			},
			
			playFaster(dir = 1) {
				if (Math.sign(this.config.autoplayStep) !== Math.sign(dir)) {
					this.config.autoplayStep *= - 1;
				} else {
					this.config.autoplayStep *= 1.618;
				}
			},
			
			stop() {
				this.config.isPlaying = false;
				this.clearIntervals();
			},
			
			clearIntervals() {
				this.config.intervalIds.forEach((id) => {
					window.clearInterval(id);
					window.clearTimeout(id);
				});
			},
		},
		
		unmounted() {
			this.stop();
		},
		
		
	}
</script>

<style>
	circle {
		transition: all 0.1s linear;
	}
</style>
