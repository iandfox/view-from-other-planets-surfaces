/**
 * MoonOrbitalBody
 *
 * @since 2021-07-13
 */
import {BaseOrbitalBody} from './BaseOrbitalBody.class.js';

const dcos = (angle) => Math.cos(angle * Math.PI / 180);
const dsin = (angle) => Math.sin(angle * Math.PI / 180);

class MoonOrbitalBody extends BaseOrbitalBody {
	
	constructor(
		JD = 2459404.5,
		params = {
			// Earth's moon
			// N: [125.1228, -0.0529538083],
			// i: [5.1454, 0],
			// w: [318.0634, 0.1643573223],
			// a: [60.2666, 0], // in Earth radii
			// e: [0.054900, 0],
			// M: [115.3654, 13.0649929509],
		},
		options = {}
	) {
		super(JD, params, options);
	}
	
	
	///
	/// Related Orbital Elements
	///
	
	
	/**
	 * true anomaly (angle between position and periapsis)
	 *
	 * @since 2021-07-12
	 * @return {{r: number, v: number}}
	 */
	get v_and_r() {
		if (this.getCached('v_and_r')) { return this.getCached('v_and_r') }
		
		const e = this.e,
			E = this.E,
			x_v = Math.cos(E) - e,
			y_v = Math.sqrt(1.0 - Math.pow(e, 2)) * Math.sin(E);
		
		const out = {
			v: Math.atan2(y_v, x_v),
			r: Math.sqrt(Math.pow(x_v, 2) + Math.pow(y_v, 2)),
		};
		this.setCached('v_and_r', out);
		return out;
	}
	get v() { return this.v_and_r.v }
	get r() { return this.v_and_r.r }
	/**
	 * @see v
	 * @return {number}
	 */
	get v_deg() {
		return this.getCached('v_deg') || (this.clampAngle(this.v * 180 / Math.PI));
	}
	
	
	/**
	 * E, the eccentric anomaly - angular position of body. this is the big mamma jamma.
	 *     This is from the other source, not the nice website. it has calculus in it, should be better.
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get E() {
		if (this.getCached('E')) { return this.getCached('E') }
		
		const M_deg = this.M_deg, e = this.e;
		const M = M_deg * Math.PI / 180;
		const sin = Math.sin, cos = Math.cos;
		
		let E = M + (e * sin(M));
		let sanity = 0;
		while (++sanity > 0) {
			const dM = M - (E - (e * sin(E)));
			const dE = dM / (1 - (e * cos(E)));
			E += dE;
			if (dE < 0.001) {
				break;
			}
		}
		
		const out = E;
		this.setCached('E', out);
		return out;
	}
	
	/**
	 * @see E
	 * @return {*}
	 */
	get E_deg() {
		if (this.getCached('E_deg')) { return this.getCached('E_deg') }
		
		const out = this.clampAngle(this.E * 180 / Math.PI);
		this.setCached('E_deg', out);
		return out;
	}
	
	/**
	 * Right Ascension
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get RA() {
		if (this.getCached('RA')) { return this.getCached('RA') }
		
		const equa = this.equatorialCoordinates;
		
		const out = Math.atan2(equa.y, equa.x);
		this.setCached('RA', out);
		return out;
	}
	
	/**
	 * Declination
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get Decl() {
		if (this.getCached('Decl')) { return this.getCached('Decl') }
		
		const equa = this.equatorialCoordinates;
		
		const out = Math.atan2(equa.z, Math.sqrt(Math.pow(equa.x, 2) + Math.pow(equa.y, 2)));
		this.setCached('Decl', out);
		return out;
	}
	
	
	///
	/// Coordinates
	///
	
	
	
	/**
	 * Geocentric position in the ecliptic coordinate system
	 *
	 * @since 2021-07-12
	 * @return {object}
	 */
	get geocentricCoordinates() {
		if (this.getCached('geocentricCoordinates')) { return this.getCached('geocentricCoordinates') }
		
		const cos = Math.cos,
			sin = Math.sin;
		const N = this.N_deg * Math.PI / 180,
			vw = this.v + (this.w_deg * Math.PI / 180),
			r = this.r,
			i = this.i_deg * Math.PI / 180;
		const cN = cos(N), sN = sin(N),
			cVW = cos(vw), sVW = sin(vw),
			cI = cos(i),   sI = sin(i);
		
		const out = {
			x: r * ((cN * cVW) - (sN * sVW * cI)),
			y: r * ((sN * cVW) + (cN * sVW * cI)),
			z: r * (sVW * sI),
		};
		this.setCached('geocentricCoordinates', out);
		return out;
	}
	get geocentric() { return this.geocentricCoordinates }
	
	/**
	 * Equatorial rectangular geocentric coordinates
	 *
	 * @since 2021-07-12
	 * @return {object}
	 */
	get equatorialCoordinates() {
		if (this.getCached('equatorialCoordinates')) { return this.getCached('equatorialCoordinates') }
		
		const geo = this.geocentricCoordinates,
			ecl = this.ecl_deg * Math.PI / 180;
		
		const out = {
			x: geo.x,
			y: geo.y * Math.cos(ecl),
			z: geo.y * Math.sin(ecl),
		};
		this.setCached('equatorialCoordinates', out);
		return out;
	}
	get equatorial() { return this.equatorialCoordinates() }
}

export {
	MoonOrbitalBody
}
