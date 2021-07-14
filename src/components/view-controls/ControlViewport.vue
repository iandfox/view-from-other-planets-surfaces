<!--
 - Vue Component: ControlViewport
 -
 -     Example usage:
 -         <ControlViewport
 -             v-model="viewport"
 -         ></ControlViewport>
 - 
 - @created 2021-07-14
-->

<template>
	<div>
		<h6>Viewport</h6>
		<fieldset class="stretched aligned inline fields">
			<label>Left</label>
			<input type="number" min="-180" max="180" step="1" v-model.number="viewport.left">
			<label>Right</label>
			<input type="number" min="-180" max="180" step="1" v-model.number="viewport.right">
			
			<label>Bottom</label>
			<input type="number" min="-180" max="180" step="1" v-model.number="viewport.bottom">
			<label>Top</label>
			<input type="number" min="-180" max="180" step="1" v-model.number="viewport.top">
		</fieldset>
	</div>
</template>

<script>
	import InputRange from '../fields/InputRange';
	export default {
		name: 'ControlViewport',
		components: {InputRange},
		props: {
			modelValue: Object,
		},
		
		emits: ['update:modelValue'],
		
		computed: {
			viewport: {
				get() {
					return this.modelValue;
				},
				set(newValue) {
					this.$emit('update:modelValue', this.modelValue);
				}
			},
		},
	}
</script>

<style scoped>
	.fields {
		grid-gap: 0;
	}
	.fields label {
		text-align: left
	}
</style>
