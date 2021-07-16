<!--
 - Vue Component: ControlMoonParameters
 -
 -     Example usage:
 -         <ControlMoonParameters
 -             v-model:moon-parameters="moonsParameters[0]"
 -         ></ControlMoonParameters>
 - 
 - @created 2021-07-15
-->

<template>
	<div class="params">
		<InputOrbitalBodyParameter v-model="moonParameters.N" slug="N"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.i" slug="i"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.w" slug="w"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.a" slug="a"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.e" slug="e"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.M" slug="M"></InputOrbitalBodyParameter>
		
		<h1>Ian: put in appropriate min/max</h1>
		
		<!-- label="Longitude of the ascending node"
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
-->
	</div>
</template>

<script>
	import InputOrbitalBodyParameter from '../fields/InputOrbitalBodyParameter';
	export default {
		name: 'ControlMoonParameters',
		components: {InputOrbitalBodyParameter},
		props: {
			moonParameters: {
				type: Object,
				required: true,
			},
		},
		
		emits: [
			'update:moonParameters'
		],
		
		data() {
			return {
			};
		},
		
		computed: {
		},
		
		watch: {},
		
		methods: {},
		
	}
</script>

<style scoped>
	.params {
		box-shadow: 0 0 5px 0 black;
	}
</style>
