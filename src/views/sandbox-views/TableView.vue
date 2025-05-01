<!--
 - Vue Component: TableView
 -     Does some stuff.
 -     
 -     Example usage:
 -         <TableView
 -             :foo="bar"
 -         ></TableView>
 - 
 - @created 10/20/2021
 - 
 - @since x.x.x
-->

<template>
	eh, the svg planetarium is pretty darn good. i'll stick with that.
</template>

<script>



import { SunOrbitalBody } from '../../calculations/OrbitalBodies/SunOrbitalBody.class';

export default {
	name: 'TableView',

	props: {
		foo: {
			type: [String, Number],
			required: false,
			default: '',
		},

		modelValue: String,
	},

	emits: [
		'update:modelValue'
	],

	data() {
		return {
			sun: new SunOrbitalBody(),
		};
	},

	computed: {
		simple() {
			return this.foo + ' abc';
		},

		complex: {
			get() {
				return 'xyz ' + this.modelValue;
			},
			set(newValue) {
				this.foo = newValue.replace('xyz ', '');

				this.$emit('update:modelValue', this.foo);
			}
		},
	},

	watch: {},

	methods: {},

}
</script>

<style scoped>

</style>
