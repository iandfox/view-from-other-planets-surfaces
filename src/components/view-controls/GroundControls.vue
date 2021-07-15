<!--
 - Vue Component: GroundControls
 -     Controls the `ViewFromGround` stuff.
 -     
 -     Example usage:
 -         <GroundControls
 -             v-model:config="config"
 -             v-bind:jd="JD"
 -             v-bind:sun="sun"
 -             v-bind:moons="moons"
 -             v-bind:planets="planets"
 -             @increase:jd="JD = $event"
 -             @update:obliquity="setObliquityOnBodies"
 -             @update:lnglat="setLocalLongLat"
 -         ></GroundControls>
 - 
 - @created 2021-07-14
-->

<template>
	<div class="controls-wrapper">
		<div :class="{controls: true, hide: cfg.areControlsHidden}">
			<button class="show-hide tiny button" @click="cfg.areControlsHidden = ! cfg.areControlsHidden">Show/Hide Controls</button>
			
			<InputJulianDate
				v-model="julianDate"
			></InputJulianDate>
			<!--
			<div style="font-size: 0.8em;">
				<div>
					<span>
						Rate:
						<br>
						<label><input type="checkbox" v-model="cfg.isAuto"> Auto Forward</label>
					</span> <input type="number" v-model.number="cfg.autoRate" step="0.001">
				</div>
			</div>
			
			<InputRange
				v-model="cfg.obliquity"
				label="Obliquity"
				:min="-90"
				:max="90"
				:step="0.5"
				units="deg"
				:fraction-digits="1"
				@input="$emit('update:obliquity')"
			></InputRange>
			
			<div>
				<InputRange
					v-model="cfg.localLongitude"
					label="Local Longitude"
					:min="-180"
					:max="180"
					:step="0.001"
					units="deg"
					:fraction-digits="3"
					@input="$emit('update:lnglat')"
				></InputRange>
				<InputRange
					v-model="cfg.localLatitude"
					label="Local Latitude"
					:min="-90"
					:max="90"
					:step="0.001"
					units="deg"
					:fraction-digits="3"
					@input="$emit('update:lnglat')"
				></InputRange>
			</div>
			
			<div style="text-align: left; width:100px; margin: 0 auto;">
				<label><input type="checkbox" v-model="cfg.shouldDrawHorizon"> Draw Horizon</label>
				<br>
				<label><input type="checkbox" v-model="cfg.shouldDrawSky"> Draw Sky</label>
				<br>
				<label><input type="checkbox" v-model="cfg.shouldDrawCompass"> Draw Compass</label>
			</div>
			
			<ControlViewport v-model="cfg.viewport"></ControlViewport>
			
			<div v-for="(moon, moonIndex) in moons">
				<div style="font-size: 0.8em"><strong>Moon #{{moonIndex}}</strong></div>
				<div v-if="cfg.moonParams[moonIndex]">
					<InputRange
						v-model="cfg.moonParams[moonIndex].N[0]"
						label="Longitude of the ascending node"
						:min="0" :max="360" :step="0.5"
						units="deg" :fraction-digits="1"
						@input="setMoonParam(0, 'N')"
					></InputRange>
					<InputRange
						v-model="cfg.moonParams[moonIndex].i[0]"
						label="Inclination"
						:min="-90" :max="90" :step="0.5"
						units="deg" :fraction-digits="1"
						@input="setMoonParam(0, 'i')"
					></InputRange>
					<InputRange
						v-model="cfg.moonParams[moonIndex].w[0]"
						label="Arg of periapsis"
						:min="0" :max="360" :step="0.5"
						units="deg" :fraction-digits="1"
						@input="setMoonParam(0, 'w')"
					></InputRange>
					<InputRange
						v-model="cfg.moonParams[moonIndex].a[0]"
						label="Semi-major axis"
						:min="0" :max="500" :step="0.6"
						units="" :fraction-digits="1"
						@input="setMoonParam(0, 'a')"
					></InputRange>
					<InputRange
						v-model="cfg.moonParams[moonIndex].e[0]"
						label="Eccentricity"
						:min="0" :max="1" :step="0.01"
						units="" :fraction-digits="2"
						@input="setMoonParam(0, 'e')"
					></InputRange>
					<InputRange
						v-model="cfg.moonParams[moonIndex].M[0]"
						label="Mean Anomaly"
						:min="-180" :max="180" :step="0.5"
						units="deg" :fraction-digits="1"
						@input="setMoonParam(0, 'M')"
					></InputRange>
				</div>
				<p v-else>Error: couldn't find moonParams[{{moonIndex}}]</p>
			</div>
			-->
		</div>
	</div>
	
	
	<teleport to="#debug">
		<h5>GroundControls Params</h5>
		<p><small>
			<em><code>[P]</code>: prop</em><br>
		</small></p>
		<dl>
			<dt>JD</dt><dd>[P] {{format(julianDate)}}</dd>
			<!--<dt style="align-self: center">Viewport</dt><dd><pre style="text-align: left; border-left: none;"> _______________
|       {{viewport.top}}
| {{viewport.left}}      {{viewport.right}}
|      {{viewport.bottom}}
 ---------------
</pre></dd>-->
			<dt></dt><dd>{{}}</dd>
			<dt></dt><dd>{{}}</dd>
		</dl>
	</teleport>
</template>

<script>
	import InputRange from '../fields/InputRange';
	import InputJulianDate from '../fields/InputJulianDate';
	import ControlViewport from './ControlViewport';
	import useNumberFormat from '../../composables/useNumberFormat';
	export default {
		name: 'GroundControls',
		components: {ControlViewport, InputJulianDate, InputRange},
		
		// TODO 2021-07-15: temp replacement while i'm refactoring. remove and revonfig
		data() {
			return {
				cfg: {
					areControlsHidden: false
				}
			}
		},
		
		
		props: {
			julianDate: {
				type: Number,
				required: false,
				default: 0
			}
			// config: Object,
			// jd: {
			// 	type: Number,
			// 	default: 2459045, // sometime in 2021
			// },
			// sun: Object,
			// moons: Array,
			// planets: Array,
		},
		
		setup() {
			const { format } = useNumberFormat();
			return {
				format
			}
		},
		
		watch: {
			julianDate(jd) { this.$emit('update:julianDate', jd) },
		},
		
		emits: [
			'update:julianDate',
			// 'update:config',
			// 'update:jd',
			// 'increase:jd',
			// 'update:obliquity',
			// 'update:lnglat',
		],
		
		mounted() {
			// this.loop();
		},
		
		unmounted() {
			// this.config.intervalIds.forEach((id) => {
			// 	clearTimeout(id);
			// 	clearInterval(id);
			// 	cancelAnimationFrame(id);
			// });
		},
		
		computed: {
			// cfg: {
				// get() { return this.config },
				// set(val) {
				// 	this.$emit('update:config', val);
				// }
			// }
		},
		
		methods: {
			loop() {
				// this.cfg.intervalIds = []; // TODO i dunno, do this better.
				// if (this.cfg.isAuto) {
				// 	if (! this.cfg.autoRate) {
				// 		this.cfg.isAuto = 0;
				// 	} else {
				// 		this.$emit('increase:jd', parseFloat(this.cfg.autoRate));
				// 	}
				// }
				// this.cfg.intervalIds.push(requestAnimationFrame(() => {
				// 	this.loop();
				// }))
			},
		},
	}
</script>

<style scoped>
	.controls-wrapper, .controls {
		position: fixed;
		bottom: 0;
		left: 10vw;
		right: 10vw;
		max-height: 300px;
		max-width: 80vw;
		z-index: 999;
	}
	.controls {
		font-size: 11px;
		
		overflow: auto;
		
		background: rgba(200, 200, 200, 0.9);
		padding: var(--length-small);
		z-index: 999;
		
		transition: all 1s ease;
		
		display: flex; flex-direction: column; flex-wrap: wrap;
	}
	.controls.hide {
		transform: translateY(calc(100% - 50px));
	}
	.controls > *:not(button.show-hide) {
		width: 300px;
	}
	
	label {
		user-select: none;
	}
	
	.show-hide {
	}
</style>
