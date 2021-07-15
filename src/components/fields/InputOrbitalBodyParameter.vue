<!--
 - Vue Component: InputOrbitalBodyParameter
 -     Does some stuff.
 -     
 -     Example usage:
 -         <InputOrbitalBodyParameter
 -             v-model="N"
 -             :min="-180"
 -             :max="180"
 -             :step="1"
 -         ></InputOrbitalBodyParameter>
 - 
 - @created 2021-07-15
-->

<template>
	<div class="param">
		<div class="slug">{{slug}}</div>
		<div class="side left">
			<div class="value">{{format(modelValue[0])}}</div>
			<InputRange
				v-model.number="modelValue[0]"
				:label="slug"
				:min="min"
				:max="max"
				:step="step"
				:fraction-digits="2"
			></InputRange>
		</div>
		<div class="side right">
			<InputRange
				v-model.number="modelValue[1]"
				:label="slug"
				:min="-360"
				:max="360"
				:step="0.01"
				:fraction-digits="2"
			></InputRange>
			<div class="value">{{format(modelValue[1])}}</div>
		</div>
	</div>
</template>

<script>
	import useNumberFormat from '../../composables/useNumberFormat';
	import InputRange from './InputRange';
	
	export default {
		name: 'InputOrbitalBodyParameter',
		components: {InputRange},
		props: {
			slug: String,
			modelValue: Array,
			min: Number,
			max: Number,
			step: Number,
		},
		
		emits: ['update:modelValue'],
		
		setup() {
			const { format } = useNumberFormat();
			
			return {
				format
			}
		},
		
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

<style lang="less" scoped>
	.param {
		display: grid;
		grid-template-areas: "slug left right";
		grid-template-columns: 20px 1fr 1fr;
		align-items: center;
	}
	
	.slug {
		grid-area: slug;
		font-weight: bold;
	}
	
	.side {
		--size: 50px;
		overflow: hidden;
		transition: all 0.2s ease;
		
		&.left {
			border: solid 1px red;
			grid-area: left;
			clip-path: polygon(0 0, var(--size) 0, var(--size) 100%, 0 100%);
			text-align: left;
			&:hover {
				clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
			}
		}
		&.right {
			border: solid 1px blue;
			grid-area: right;
			clip-path: polygon(calc(100% - var(--size)) 0, 100% 0, 100% 100%, calc(100% - var(--size)) 100%);
			text-align: right;
			&:hover {
				clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
			}
		}
		
		.value {}
	}
</style>
