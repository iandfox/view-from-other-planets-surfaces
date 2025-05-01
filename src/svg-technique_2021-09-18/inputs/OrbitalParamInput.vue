<template>
  <label>{{label}}</label>
  <div class="input">
    <input type="number" v-model="param[0]" />
    <input type="number" v-model="param[1]" />
  </div>
  <div style="" v-if="description">{{description}}</div>
</template>

<script>
export default {
  name: 'OrbitalParamInput',
  props: {
    label: {
      type: String,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    modelValue: {
      type: Array,
    }
  },
  computed: {
    param: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit('update:modelValue', newValue);
      },
    },
  },
}
</script>
