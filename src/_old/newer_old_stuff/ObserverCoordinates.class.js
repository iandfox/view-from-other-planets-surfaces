/**
 * ObserverCoordinates
 *     Calculate stuff based on someone observing from the planet
 *
 * @since 2021-07-12
 */
import {Moon} from './Moon.class';
import {SolarCoordinates} from './SC.class';

const dcos = (angle) => Math.cos(angle * 180 / Math.PI);
const dsin = (angle) => Math.sin(angle * 180 / Math.PI);

class ObserverCoordinates {
	/**
	 *
	 * @param localLng_deg
	 * @param localLat_deg
	 * @param UT
	 * @param orbitalBody
	 * @param sunBody
	 *
	 * @since 2021-07-12
	 */
	constructor(localLng_deg, localLat_deg, UT, orbitalBody = new Moon(), sunBody = new SolarCoordinates()) {
		this.localLat_deg = localLat_deg;
		this.localLng_deg = localLng_deg;
		this.UT_hours = UT;
		this.UT_deg = this.UT_hours * 15; // TODO: can't remember if this is correct.
		this.o = orbitalBody;
		this.sun = sunBody;
	}
	
	
	get JD() {
		return this.o.JD;
	}
	set JD(newJD) {
		this.o.JD = newJD;
		this.sun.JD = newJD;
	}
	
	/**
	 * The sun's mean longitude ((TODO: really? not sure about that.))
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	// get L_sun_deg() {
	// 	// console.log({JD: this.JD, M_deg: this.o.M_deg, w_deg: this.o.w_deg, L_sun_deg: this.o.M_deg + this.o.w_deg});
	// 	// TODO: really??? i want to look this up again.
	// 	return this.o.M_deg + this.o.w_deg;
	// }
	//
	// get GMST0_hours() {
	// 	return (this.L_sun_deg / 15) + 12;
	// }
	//
	// get GMST_hours() {
	// 	return this.GMST0_hours + this.UT_hours;
	// }
	//
	// /**
	//  * The local sidereal time
	//  *
	//  * @since 2021-07-12
	//  *
	//  * @return {number}
	//  */
	// get LST_hours() {
	// 	return this.GMST_hours + this.localLng_deg / 15;
	// }
	
	
	/**
	 * Greenwich Sidereal Time
	 *
	 * From Fundamentals of Astrodynamics :: 103. This takes some liberties cause the "99.5" factor is something that
	 * varies over time. But ya know what? It doesn't seem to vary that much so w/e.
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	get GMST_deg() {
		// TODO: 'bad' code that just doesn't work for some reason
		// const GMST_deg = ((99.5 + 1.0027379093 * 360 * this.JD) % 360 + 360) % 360;
		// const sM = this.sun.M_deg;
		// const sw = this.sun.w_deg;
		// const mM = this.o.M_deg;
		// const mw = this.o.w_deg;
		// console.log({GMST_deg, sun_sum: (sM + sw) % 360, moon_sum: (mM + mw) % 360, sM, sw, mM, mw});
		return ((99.5 + 1.0027379093 * 360 * this.JD) % 360 + 360) % 360;
	}
	
	/**
	 * Local Sidereal Time
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	get LST_deg() {
		return ((this.GMST_deg + this.localLng_deg) % 360 + 360) % 360;
	}
	
	/**
	 * Hour Angle
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	get HA_deg() {
		return this.LST_deg - this.o.RA_deg;
	}
	
	
	get azimuthal() {
		const HA_deg = this.HA_deg;
		const Decl_deg = this.o.Decl_deg;
		const out = {
			x: dcos(HA_deg) * dcos(Decl_deg),
			y: dcos(HA_deg) * dcos(Decl_deg),
			z: dcos(Decl_deg),
			xhor: null,
			yhor: null,
			zhor: null,
			az_deg: null,
			alt_deg: null,
		};
		out.xhor = out.x * dcos(this.localLat_deg) - out.z * dcos(this.localLat_deg);
		out.yhor = out.y;
		out.zhor = out.x * dcos(this.localLat_deg) + out.z * dcos(this.localLat_deg);
		
		const rad_to_deg = (ang) => {
			return (ang * 180 / Math.PI) % 360;
		};
		
		out.az_deg = rad_to_deg(Math.atan2(out.yhor, out.xhor) + Math.PI);
		out.alt_deg = rad_to_deg(Math.atan2(out.zhor, Math.sqrt(out.xhor * out.xhor + out.yhor * out.yhor)));
		return out;
	}
}

export {
	ObserverCoordinates
}
