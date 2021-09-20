<!--
 - Vue Component: svg-planetarium
 -     Shows Julian Date
 -
 -     Also shows equivalent datetime in tucson (or, at least, GMT-7)
 -
 -     Example usage:
 -         <JulianDateField :julian-date="julianDate"></JulianDateField>
 -
 - @created 2021-09-19
 -
 - @since 2021-09-19
-->

<template>
	<div>
		<input
			type="number"
			v-model="julianDate"
			min="0"
			max="99999999999"
			step="0.00001"
		/>
		<br>
		<span>{{tucsonDate}}</span>
	</div>
</template>

<script>
	import { DateTime } from 'luxon';
	
	export default {
		name: 'JulianDateField',
		
		props: {
			julianDate: {
				type: Number,
				required: true,
			}
		},
		
		computed: {
			tucsonDate() {
				const epoch = (this.julianDate - 2440587.5) * 86400;
				const d = new Date(epoch * 1000);
				return `${d.toLocaleDateString().replace(/\/([0-9])\//, "/0$1/").padStart(10, '0')} ${d.toLocaleTimeString().padStart(11, '0')}`; // .padStart(24, '=')
			},
		},
	}
</script>

<style scoped>
	span {
		display: inline-block;
		padding: var(--length-tiny);
		font-family: 'Fira Code', monospace;
	}
</style>
