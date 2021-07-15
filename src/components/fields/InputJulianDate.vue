<!--
 - Vue Component: InputJulianDate
 -     Input field for Julian Date manipulation (and display, for that matter)
 -     
 -     Example usage:
 -         <InputJulianDate
 -             v-model.number="moon.JD"
 -             :label="label"
 -         ></InputJulianDate>
 - 
 - @created 2021-07-14
-->

<template>
	<div>
		<label v-if="label">{{label}}</label>
		<input type="datetime-local" style="width: 34ch;" v-model="datetime">
		<br>
		<small><em>{{format(modelValue)}}</em></small>
	</div>
</template>

<script>
	import {JulianDate} from '../../calculations/Utils/JulianDate.class';
	import useNumberFormat from '../../composables/useNumberFormat';
	
	export default {
		name: 'InputJulianDate',
		
		props: {
			label: String,
			modelValue: Number,
		},
		
		emits: ['update:modelValue'],
		
		data() {
			return {
				_datetime: '', // having this helps with reactivity
				helper: new JulianDate(this.modelValue),
			};
		},
		
		setup() {
			const { format } = useNumberFormat();
			return {
				format
			}
		},
		
		mounted() {
			// set the initial value
			this._datetime = this.helper.iso;
		},
		
		watch: {
			modelValue() {
				this.helper.JD = this.modelValue;
				this._datetime = this.helper.iso;
			},
		},
		
		computed: {
			JD: {
				get() {
					return this.modelValue;
				},
				set(newValue) {
					this.$emit('update:modelValue', newValue);
					this.helper.JD = newValue;
				}
			},
			
			datetime: {
				get() {
					return this._datetime;
				},
				set(newValue) {
					return this.setJDFromDatetime(newValue);
				}
			}
		},
		
		methods: {
			setJDFromDatetime(datetime) {
				// `datetime` has format: 2021-07-16T12:19
				if (datetime) {
					const Y = parseInt(datetime.substr(0, 4));
					const M = parseInt(datetime.substr(5, 2));
					const D = parseInt(datetime.substr(8, 2));
					const H = parseInt(datetime.substr(11, 2));
					const m = parseInt(datetime.substr(14, 2));
					const JD = this.helper.fromDate(Y, M, D, H, m);
					this.$emit('update:modelValue', JD);
				}
			},
		},
	}
</script>

<style scoped>

</style>
