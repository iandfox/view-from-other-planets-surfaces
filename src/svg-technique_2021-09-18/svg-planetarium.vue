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
	{{ (Math.floor(debug._dt)).toString().padStart(3, ' ') }}
	<br>
	{{ (Math.floor(debug._fps)).toString().padStart(3, ' ') }}
	<br>
	<div class="form">
		<div class="inline stacked fields">
			<label>Julian Date</label>
			<div class="input">

				<div class="buttons">
					<button type="button" @click="stop()" class="dark" :style="{opacity: ((config.isPlaying) ? 1 : 0)}">
						<i class="fa fa-pause"></i></button>
					<input
						type="text"
						readonly
						:style="{opacity: ((config.isPlaying && config.autoplayStep <= 0) ? 0.3 : 0), width: '7ch'}"
						:value="config.autoplayStep"
					/>

					<button type="button" @click="playFaster(-1)" title="autoplay controls: go backwards faster">
						<i class="fa fa-angle-double-left"></i></button>
					<button type="button" @click="startPlaying(-7)" title="autoplay controls: step = -7">
						<i class="fa fa-fast-backward"></i></button>
					<button type="button" @click="startPlaying(-1)" title="autoplay controls: step = -1">
						<i class="fa fa-backward"></i></button>
					<button type="button" @click="startPlaying(-1/24)" title="autoplay controls: step = -1/24">
						<i class="fa fa-chevron-left"></i></button>

					<button type="button" @click="julianDate -= 28" class="dark">-4 Weeks</button>
					<button type="button" @click="julianDate -= 7" class="dark">-1 Week</button>
					<button type="button" @click="julianDate -= 1" class="dark">-1 Day</button>
					<button type="button" @click="julianDate -= 1/24" class="dark">-1 Hour</button>

					<JulianDateField :julian-date="julianDate"/>

					<button type="button" @click="julianDate += 1/24" class="dark">+1 Hour</button>
					<button type="button" @click="julianDate += 1" class="dark">+1 Day</button>
					<button type="button" @click="julianDate += 7" class="dark">+1 Week</button>
					<button type="button" @click="julianDate += 28" class="dark">+4 Weeks</button>

					<button type="button" @click="startPlaying(1/24)" title="autoplay controls: step = 1/24">
						<i class="fa fa-chevron-right"></i></button>
					<button type="button" @click="startPlaying(1)" title="autoplay controls: step = 1">
						<i class="fa fa-forward"></i></button>
					<button type="button" @click="startPlaying(7)" title="autoplay controls: step = 7">
						<i class="fa fa-fast-forward"></i></button>
					<button type="button" @click="playFaster()" title="autoplay controls: go forwards faster">
						<i class="fa fa-angle-double-right"></i></button>

					<input
						type="text"
						readonly
						:style="{opacity: ((config.isPlaying && config.autoplayStep >= 0) ? 0.3 : 0), width: '7ch'}"
						:value="config.autoplayStep"
					/>
					<button type="button" @click="stop()" class="dark" :style="{opacity: ((config.isPlaying) ? 1 : 0)}">
						<i class="fa fa-pause"></i></button>
				</div>

			</div>
		</div>
	</div>

	<details>
		<summary>LatLng</summary>
		<ul>
			<li><input type="number" v-model="config.localLatitude" @change="setLatLng()"> Lat</li>
			<li><input type="number" min="-180" max="180" step="1" v-model="config.localLongitude" @change="setLatLng()"> Lng</li>
		</ul>
	</details>

	<details>
		<summary>PlotPath config</summary>
		<ul>
			<li><input type="number" min="-180" max="180" step="1" v-model="config.plotPath.jdDelta"> jdDelta </li>
			<li><input type="number" min="0" step="0.1" v-model="config.plotPath.jdStep"> jdStep</li>
		</ul>
	</details>

	<svg xmlns="http://www.w3.org/2000/svg"
	     width="100%"
	     viewBox="-180 -90 360 180"
	>


		<PlotPath
			v-for="moon in moons"
			:ob="moon"
			:sun="sun"
			:x-key="'az_deg'"
			:y-key="'alt_deg'"
			:jd-start="0"
			:jd-end="config.plotPath.jdEnd"
			:jd-step="config.plotPath.jdStep"
		/>

		<!-- NOTE: it's not a mistake, Future Ian. I meant to do MoonBody for the sun. <3 -->
		<MoonBody
			:color="sun.color"
			:radius="sun.radius"
			:x="sun.azi.az_deg"
			:y="sun.azi.alt_deg"
		/>

		<MoonBody
			v-for="moon in moons"
			:color="moon.color"
			:radius="moon.radius"
			:x="moon.azi.az_deg"
			:y="moon.azi.alt_deg"
		/>


		<!--<PredictedOrbitPath
		  v-for="moon in moons"
		  :x-key="'JD'"
		  :y-key="'alt_deg'"
		  :start-jd="2459404.5"
		  :step-jd="0.1"
		  :end-jd="2459405.5"
		  :ob-raw="moon"
		  :sun-raw="sun"
		  :is-moon="true"
		/>-->


		<Axes
			:color="config.tickMark.color"
			:gap="config.tickMark.gap"
			:halfLength="config.tickMark.halfLength"
			:width="config.tickMark.width"
		/>

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
import { reactive, ref }        from 'vue';
import { MoonOrbitalBody }      from '../calculations/OrbitalBodies/MoonOrbitalBody.class';
import { SunOrbitalBody }       from '../calculations/OrbitalBodies/SunOrbitalBody.class'
import { AzimuthalCoordinates } from '../calculations/Utils/AzimuthalCoordinates.class';
import useNumberFormat          from '../composables/useNumberFormat';
import MoonBody                 from './bodies/MoonBody';
import PredictedOrbitPath       from "./bodies/PredictedOrbitPath";
import SunBody                  from './bodies/SunBody';
import Axes                     from './gui/Axes';
import JulianDateField          from './inputs/JulianDateField';
import PlotPath                 from './PlotPath';

export default {
	name: 'svg-planetarium',

	components: {PredictedOrbitPath, JulianDateField, MoonBody, SunBody, Axes, PlotPath},

	setup() {
		const {format} = useNumberFormat();
		const sun = reactive(new SunOrbitalBody(2459404.5));

		const moons = ref([]);
		const planets = ref([]);

		const moonsParams = [
			{
				name: 'F\'an',
				color: 'tan',
				radius: 3,
				N: [125.1228, - 0.0529538083],
				i: [35.1454, 0],
				w: [318.0634, 0.1643573223],
				a: [60.2666, 0], // in Earth radii
				e: [0.054900, 0],
				M: [0.3654, 53.0649929509],
			},
			{
				name: 'Moon', // Earth's Moon
				color: 'grey',
				radius: 5,
				N: [125.1228, - 0.0529538083],
				i: [5.1454, 0],
				w: [318.0634, 0.1643573223],
				a: [60.2666, 0], // in Earth radii
				e: [0.054900, 0],
				M: [115.3654, 13.0649929509],
			},
			{
				name: 'Gomor',
				color: 'skyblue',
				radius: 7,
				N: [125.1228, - 0.0529538083],
				i: [5.1454, 0],
				w: [8.0634, 0.1643573223],
				a: [1.2666, 0], // in Earth radii
				e: [0.054900, 0],
				M: [300.3654, 13.0649929509],
			}
		];

		moonsParams.forEach((params) => {
			moons.value.push(new MoonOrbitalBody(2459404.5, params, {
				color: params.color,
				radius: params.radius,
				name: params.name,
			}))
		});

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

			debug: {
				_fps: - 1,
				_dt: - 1,
			},

			config: {
				tickMark: {
					color: 'yellow',
					gap: 10,
					halfLength: 2,
					width: 0.2
				},

				localLongitude: -111.01908142663117,
				localLatitude: 0, // 32.198840114469995, // TODO: set to malta's latitude
				obliquity: 23.4393,

				intervalIds: [- 1],
				isPlaying: false,
				autoplayStep: 1 / 24,

				// viewport: {
				// 	bottom: -90,
				// 	top:     90,
				// 	left:   -180,
				// 	right:   180,
				// },


				// for PlotPath's:
				plotPath: {
					jdEnd: 30,
					jdStep: 0.1,
				},


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
		loop(then) {
			const now = performance.now();
			const dt = now - then;
			this.debug._dt = now - then; // todo delte
			this.debug._fps = Math.floor(1000 / this.debug._dt); // todo delte
			if (this.config.isPlaying) {
				this.julianDate += (this.config.autoplayStep / 1000) * dt;
			}
			this.config.intervalIds[0] = requestAnimationFrame(() => {
				this.loop(now)
			});
		},


		startPlaying(autoplayStep = 0.1) {
			this.config.isPlaying = true;
			this.config.autoplayStep = autoplayStep;

			// this.clearIntervals();
			// const intervalId = setInterval(() => {
			// 	this.julianDate += this.config.autoplayStep;
			// }, 100);
			// this.config.intervalIds.push(intervalId);
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
				window.cancelAnimationFrame(id);
			});
		},

		// 2021-10-23
		setLatLng() {
			if (this.sun.azi && this.sun.azi.siderealTime) {
				this.sun.azi.siderealTime.localLongitude_deg = this.lng;
				this.sun.azi.siderealTime.localLatitude_deg = this.lat;
			}
			this.moons.forEach((moon) => {
				if (moon.azi && moon.azi.siderealTime) {
					moon.azi.siderealTime.localLongitude_deg = this.lng;
					moon.azi.siderealTime.localLatitude_deg = this.lat;
				}
			});
		},
	},

	mounted() {
		// this.startPlaying(1 / 24 / 60); // autoplay speed of 1 minute. a pleasant default setting -- 1 hour is too fast! 1 sec = 1 min is also easy to grok, and you still can see motion
		this.loop(performance.now());
	},

	unmounted() {
		this.stop();
	},


}
</script>

<style>
circle {
	/*transition: all 0.1s linear;*/
}
</style>
