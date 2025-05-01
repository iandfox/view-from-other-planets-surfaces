<template>
	<BodyTail
		:color="ob.color"
		:tail="path"
	/>
</template>

<script>
import BodyTail            from "./BodyTail";
import { MoonOrbitalBody } from '../../calculations/OrbitalBodies/MoonOrbitalBody.class';
import { SunOrbitalBody } from '../../calculations/OrbitalBodies/SunOrbitalBody.class';
import { AzimuthalCoordinates } from '../../calculations/Utils/AzimuthalCoordinates.class';

export default {
	name: "PredictedOrbitPath",
	components: {BodyTail},
	props: {
		obRaw: Object, // an OrbitalBody; only used for cloning on created()
		xKey: String,
		yKey: String,
		startJd: Number,
		endJd: Number,
		stepJd: Number,
		sunRaw: Object, // a SunOrbitalBody; will be cloned. needed for alt_az
		isMoon: Boolean,
	},

	data() {
		return {
			ob: null, // this will clone the input `obRaw` so we don't trigger reactivity
			sun: null, // this will clone the input `sun` so we don't trigger reactivity
		}
	},

	computed: {
		path() {
			return this.computePath(this.ob, this.xKey, this.yKey, this.startJd, this.endJd, this.stepJd);
		},
	},

	methods: {
		computePath(ob, xKey, yKey, startJd, endJd, stepJd) {
			if (ob[xKey] === undefined || ob[yKey] === undefined) {
				throw new Error(`Invalid keys for PredictedOrbitPath. Tried: (${xKey}, ${yKey}). Got: (${ob[xKey]}, ${ob[yKey]})`);
			}
			const path = [];
			for (let jd = startJd; jd < endJd; jd += stepJd) {
				ob.JD = jd;
				// NOTE 2021-10-20: will probably want to unshift this, so that i can fade in one direction or another.
				path.push({
					x: ob[xKey],
					y: ob[yKey],
				});
			}
			console.group();
			console.table(path); // TODO delete
			console.groupEnd();
			return path;
		},
	},

	created() {
		const params = JSON.parse(JSON.stringify(this.obRaw.params));
		const ecl_param = JSON.parse(JSON.stringify(this.obRaw.ecl_param));
		const color = JSON.parse(JSON.stringify(this.obRaw.color));
		const radius = JSON.parse(JSON.stringify(this.obRaw.radius));

		if (this.isMoon) {
			const sun_params = JSON.parse(JSON.stringify(this.sunRaw.params));
			const sun_ecl_param = JSON.parse(JSON.stringify(this.sunRaw.ecl_param));
			const sun_color = JSON.parse(JSON.stringify(this.sunRaw.color));
			const sun_radius = JSON.parse(JSON.stringify(this.sunRaw.radius));

			this.ob = new MoonOrbitalBody(this.startJd, params, {ecl_param, color, radius});
			this.sun = new SunOrbitalBody(this.startJd, sun_params, {ecl_param: sun_ecl_param, color: sun_color, radius: sun_radius});
			this.ob.azi = new AzimuthalCoordinates(this.ob, this.sun);
			this.sun.azi = new AzimuthalCoordinates(this.sun, this.sun);
		} else {
			this.ob = new SunOrbitalBody(this.startJd, params, {ecl_param, color, radius});
			this.sun = this.ob;
			this.ob.azi = new AzimuthalCoordinates(this.ob, this.ob);
		}


		const path = this.computePath(this.ob, this.xKey, this.yKey, this.startJd, this.endJd, this.stepJd);
		//console.table(path); // TODO remove
	},

}
</script>

<style scoped>

</style>
