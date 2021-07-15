<!--
 - Vue Component: InputRange
 -     Does some stuff.
 -     
 -     Example usage:
 -         <InputRange
 -             v-model="foo"
 -             label="Bar"
 -             min="0"
 -             max="1000"
 -             step="1"
 -             units="hours"
 -             fraction-digits="4"
 -         ></InputRange>
 - 
 - @created 2021-07-14
-->

<template>
	<div class="range-wrapper">
		<label v-if="label">{{label}} = <span class="value">{{numberFormat.format(value)}}&nbsp;{{units}}</span></label>
		<input
			type="range"
			v-model.number="value"
			:min="min"
			:max="max"
			:step="step"
			@change="draw"
			v-bind="$attrs"
			@wheel.passive="onWheel"
		/>
		<span class="min">{{min}}&nbsp;{{units}}</span>
		<span class="max">{{max}}&nbsp;{{units}}</span>
		<span class="value" v-if="! label">{{numberFormat.format(value)}}&nbsp;{{units}}</span>
	</div>
</template>

<script>
	export default {
		name: 'InputRange',
		
		props: {
			modelValue: {
				type: Number,
				required: true
			},
			label: {
				type: String,
				required: false,
				default: '',
			},
			min: {
				type: Number,
				required: false,
				default: 0,
			},
			max: {
				type: Number,
				required: false,
				default: 100,
			},
			step: {
				type: Number,
				required: false,
				default: 1,
			},
			units: {
				type: String,
				required: false,
				default: '',
			},
			fractionDigits: {
				type: Number,
				required: false,
				default: 0,
			},
		},
		
		emits: ['update:modelValue'],
		
		inheritAttrs: false,
		
		data() {
			return {
				numberFormat: new Intl.NumberFormat(
					'en-US',
					{
						minimumFractionDigits: this.fractionDigits,
						maximumFractionDigits: this.fractionDigits
					}
				),
				
				wheel: {
					speed: 0,
					epsilon: 0,
				},
				mouseWheelSpeed: 0,
			};
		},
		
		computed: {
			value: {
				get() {
					return this.modelValue;
				},
				set(newValue) {
					this.$emit('update:modelValue', newValue);
				}
			},
		},
		
		methods: {
			onWheel(event) {
				let scrollAmount = event.deltaY;
				const sign = -1 * Math.sign(scrollAmount); // scrolling up gives negative deltaY
				scrollAmount = Math.abs(scrollAmount);
				if (sign !== Math.sign(this.wheel.epsilon)) {
					// Scrolling in the other direction, so reset the epsilon
					this.wheel.epsilon = 0;
				}
				
				scrollAmount /= 100;
				let speed = Math.floor(scrollAmount);
				let epsilon = Math.abs(this.wheel.epsilon) + scrollAmount - speed;
				
				// epsilon can contribute to speed over multiple calls
				if (epsilon > 1) {
					speed += Math.abs(Math.floor(this.wheel.epsilon));
				}
				
				this.wheel.speed = sign * speed;
				this.wheel.epsilon = sign * epsilon;
				
				
				// Apply wheel speed to value
				this.value += this.wheel.speed * this.step;
			},
		},
	}
</script>

<style scoped>
	.range-wrapper {
		display: grid;
		grid-template-areas:
			" label  label  label"
			"min input max"
			" val   val   val ";
		grid-template-columns: 75px 1fr 75px;
		align-items: center;
	}
	.range-wrapper label {
		font-weight: bold;
		grid-area: label;
		text-align: center;
	}
	.range-wrapper input[type="range"] {
		grid-area: input;
		
	}
	.range-wrapper .min {
		grid-area: min;
		text-align: right;
	}
	.range-wrapper .max {
		grid-area: max;
		text-align: left;
	}
	.range-wrapper .max,
	.range-wrapper .min {
		font-size: 0.8em;
		display: inline-block;
		vertical-align: center;
	}
	.range-wrapper .value {
		grid-area: val;
		text-align: center;
		min-width: 220px
	}
	.range-wrapper .value small code {
		display: inline-block;
	}
	.range-wrapper .value small code span {
		display: inline-block;
		min-width: 5ch;
		text-align: right;
	}
</style>
