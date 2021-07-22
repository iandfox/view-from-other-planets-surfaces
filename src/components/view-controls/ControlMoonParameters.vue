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
		<InputOrbitalBodyParameter v-model="moonParameters.N" slug="N" :min="0" :max="360"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.i" slug="i" :min="-90" :max="90"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.w" slug="w" :min="0" :max="360"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.a" slug="a" :min="0" :max="500"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.e" slug="e" :min="0" :max="1" :step="0.01"></InputOrbitalBodyParameter>
		<InputOrbitalBodyParameter v-model="moonParameters.M" slug="M" :min="-180" :max="180"></InputOrbitalBodyParameter>
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
