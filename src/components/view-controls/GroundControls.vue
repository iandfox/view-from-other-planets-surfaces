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
			
			<div v-for="(moonParameters, index) in moonsParameters">
				<h6>{{moonParameters.name}}</h6>
				<ControlMoonParameters
					v-model:moon-parameters="moonsParameters[index]"
				></ControlMoonParameters>
			</div>
			
			<!--
		
			
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
			
			
			<div style="text-align: left; width:100px; margin: 0 auto;">
				<label><input type="checkbox" v-model="cfg.shouldDrawHorizon"> Draw Horizon</label>
				<br>
				<label><input type="checkbox" v-model="cfg.shouldDrawSky"> Draw Sky</label>
				<br>
				<label><input type="checkbox" v-model="cfg.shouldDrawCompass"> Draw Compass</label>
			</div>
			
			
			</div>
			-->
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
			loop() {
			},
		},
	}
</script>

<style scoped>
	.controls-wrapper, .controls {
		position: fixed;
		bottom: 0;
		left: 5vw;
		right: 5vw;
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
	
	
	.controls-wrapper {
		transition: all 10s ease;
		opacity: 0.05;
	}
	.controls-wrapper:hover {
		transition: all 1s ease;
		opacity: 1;
	}
</style>
