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
		<label>Date:</label> <input type="date" style="width: 34ch;" v-model="date" @input="parseDateAndTime">
		<br>
		<label>Time:</label> <input type="time" style="width: 34ch;" v-model="time" @input="parseDateAndTime">
		<div class="vcr">
			<button @click="stepBack()"><i class="fa fa-chevron-left"></i></button>
			<button @click="toggleAuto()"><i class="fa fa-pause" v-if="isAuto"></i><i class="fa fa-play" v-else></i></button>
			<button @click="stepForward()"><i class="fa fa-chevron-right"></i></button>
			&nbsp;<label>Step: <input type="number" style="width: 10ch;" v-model.number="step"></label>
		</div>
		<small><em>{{format(modelValue)}}</em></small>
	</div>
</template>

<script>
	import {JulianDate} from '../../calculations/Utils/JulianDate.class';
	import useNumberFormat from '../../composables/useNumberFormat';
	import moment from 'moment';
	
	export default {
		name: 'InputJulianDate',
		
		props: {
			label: String,
			modelValue: Number,
		},
		
		emits: ['update:modelValue'],
		
		data() {
			return {
				date: '2021-07-16',
				time: '00:00',
				
				helper: new JulianDate(0),
				isAuto: false,
				autoIntervalId: 0,
				step: 0.01, // in days
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
			this.autoIntervalId = setInterval(() => {
				if (this.isAuto) {
					this.stepForward();
				}
			}, 50);
		},
		
		unmounted() {
			clearInterval(this.autoIntervalId);
		},
		
		watch: {
			date() {
				const date=this.date,
					time=this.time;
				const datetime = date + 'T' + time + ':00-07:00';
				this.$emit('update:modelValue', 0.5 + JulianDate.datetimeToJD(datetime));
			},
			time() {
				const date=this.date,
					time=this.time;
				const datetime = date + 'T' + time + ':00-07:00';
				this.$emit('update:modelValue', 0.5 + JulianDate.datetimeToJD(datetime));
			},
		},
		
		computed: {
			
			
			// JD: {
			// 	get() {
			// 		return this.modelValue;
			// 	},
			// 	set(newValue) {
			// 		this.$emit('update:modelValue', newValue);
			// 		this.helper.JD = newValue;
			// 	}
			// },
			//
			// datetime: {
			// 	get() {
			// 		return this._datetime;
			// 	},
			// 	set(newValue) {
			// 		return this.setJDFromDatetime(newValue);
			// 	}
			// }
		},
		
		methods: {
			parseDateAndTime() {
				// const datetime = this.date + 'T' + this.time;
				// const epoch = Date.parse(datetime) / 1000;
				// const jd = this.helper.fromEpoch(epoch);
				// console.log('parseDateAndTime Results:', {
				// 	datetime,
				// 	jd,
				// 	'Date.parse(datetime)/1000 (the epoch)': Date.parse(datetime) / 1000,
				// 	'what if we made a (new JulianDate(jd)).iso': (new JulianDate(jd).iso)
				// });
				// this.$emit('update:modelValue', jd);
				// this.JD = jd;
			},
			
			stepBack(scl = 1) {
				this.$emit('update:modelValue', this.modelValue - (scl * this.step));
			},
			
			stepForward(scl = 1) {
				this.$emit('update:modelValue', this.modelValue + (scl * this.step));
			},
			
			toggleAuto() {
				this.isAuto = ! this.isAuto;
			}
		},
	}
</script>

<style scoped>

</style>
