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
		<label>Date:</label> <input type="date" style="width: 34ch;" v-model="date" @input="emitDateTime()">
		<br>
		<label>Time:</label> <input type="time" style="width: 34ch;" v-model="time" @input="emitDateTime()">
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
			}, 20);
			this.setDateTime(this.modelValue);
		},
		
		unmounted() {
			clearInterval(this.autoIntervalId);
		},
		
		watch: {
			modelValue(jd) {
				this.setDateTime(this.modelValue);
			},
		},
		
		methods: {
			setDateTime(jd) {
				this.helper.JD = jd;
				const epoch = JulianDate.jdToEpoch(jd);
				const m = moment.unix(epoch);
				this.date = m.format('YYYY-MM-DD');
				this.time = m.format('hh:mm');
			},
			
			emitDateTime() {
				const date = this.date,
					time = this.time;
				const datetime = date + 'T' + time + ':00-07:00';
				console.log('emitDatetime', {date, time, datetime, jd: JulianDate.datetimeToJD(datetime)});
				this.$emit('update:modelValue', 0.5 + JulianDate.datetimeToJD(datetime));
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
