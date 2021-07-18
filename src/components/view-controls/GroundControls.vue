<!--
 - Vue Component: GroundControls
 -     Controls the `ViewFromGround` stuff.
 -     
 -     Example usage:
 -         <GroundControls
 -             v-model:julian-date="julianDate"
 -             v-model:viewport="viewport"
 -             v-model:moons-parameters="moonsParameters"
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
			<ControlViewport
				v-model="viewport"
			></ControlViewport>
			
			<div>
				<button class="tiny info button" style="display: inline-block; justify-self: center; align-self: center;" @click="logCurrentParams()">Log Current Params</button>
				<InputRange
					v-model.number="miscConfig.localLongitude"
					label="Longitude"
					:min="-180"
					:max="180"
					:step="0.1"
					:fraction-digits="3"
				></InputRange>
				<InputRange
					v-model.number="miscConfig.localLatitude"
					label="Latitude"
					:min="-180"
					:max="180"
					:step="0.1"
					:fraction-digits="3"
				></InputRange>
				<InputRange
					v-model.number="miscConfig.obliquity"
					label="Obliquity"
					:min="-180"
					:max="180"
					:step="0.1"
					:fraction-digits="3"
				></InputRange>
			</div>
			
			<br>
			
			<div style="display: inline-block; text-align: left; justify-self: center;">
				<label><input type="checkbox" v-model="miscConfig.shouldDrawHorizon"> Draw Horizon</label>
				<br>
				<label><input type="checkbox" v-model="miscConfig.shouldDrawSky"> Draw Sky</label>
				<br>
				<label><input type="checkbox" v-model="miscConfig.shouldDrawCompass"> Draw Compass</label>
			</div>
			
			<div v-for="(moonParameters, index) in moonsParameters">
				<h6>{{moonParameters.name}}</h6>
				<ControlMoonParameters
					v-model:moon-parameters="moonsParameters[index]"
				></ControlMoonParameters>
			</div>
			
		</div>
	</div>
</template>

<script>
	import InputRange from '../fields/InputRange';
	import InputJulianDate from '../fields/InputJulianDate';
	import ControlViewport from './ControlViewport';
	import useNumberFormat from '../../composables/useNumberFormat';
	import DebugMoonsParameters from '../DebugMoonsParameters';
	import ControlMoonParameters from './ControlMoonParameters';
	export default {
		name: 'GroundControls',
		components: {ControlMoonParameters, DebugMoonsParameters, ControlViewport, InputJulianDate, InputRange},
		
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
			},
			viewport: {
				type: Object,
				required: false,
				default: {top: -1, right: -1, bottom: -1, left: -1},
			},
			moonsParameters: {
				type: Array,
				required: false,
				default: [],
			},
			
			miscConfig: {
				type: Object,
				default: {
					localLongitude: -111.01908142663117,
					localLatitude: 32.198840114469995,
					obliquity: 23.4393,
					
					shouldDrawHorizon: true,
					shouldDrawSky: true,
					shouldDrawCompass: true,
				}
			},
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
		],
		
		mounted() {
		},
		
		unmounted() {
		},
		
		computed: {
		},
		
		methods: {
			logCurrentParams() {
				console.log({julianDate: this.julianDate, viewport: this.viewport, moonsParameters: this.moonsParameters, miscConfig: this.miscConfig});
			}
		},
	}
</script>

<style scoped>
	.controls-wrapper, .controls {
		position: fixed;
		bottom: 0;
		left: 5vw;
		right: 5vw;
		max-height: 350px;
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
	
	
	.controls-wrapper {
		transition: all 10s ease;
		opacity: 0.05;
	}
	.controls-wrapper:hover {
		transition: all 1s ease;
		opacity: 1;
	}
</style>
