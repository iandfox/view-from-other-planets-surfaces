<template>
  <div class="form">
    <div class="inline fields">
      <label>Name</label>
      <input type="text" v-model="ob.name" />
      <label>Color</label>
      <input type="text" v-model="ob.color" />
      <label>Radius</label>
      <input type="text" v-model.number="ob.radius" />
      <OrbitalParamInput v-model="ob.params.N" label="N" />
      <OrbitalParamInput v-model="ob.params.i" label="i" />
      <OrbitalParamInput v-model="ob.params.w" label="w" />
      <OrbitalParamInput v-model="ob.params.a" label="a" />
      <OrbitalParamInput v-model="ob.params.e" label="e" />
      <OrbitalParamInput v-model="ob.params.M" label="M" />
    </div>
  </div>
</template>

<script>
import OrbitalParamInput from "./OrbitalParamInput";

export default {
  name: "OrbitalBodyField",

  components: {OrbitalParamInput},

  props: {
    modelValue: Object,
  },

  computed: {
    ob: {
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

