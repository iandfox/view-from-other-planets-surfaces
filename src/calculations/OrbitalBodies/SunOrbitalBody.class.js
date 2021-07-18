/**
 * SunOrbitalBody
 *
 * /**
 * Trying this a third time (ugh), this time from the book Astronomical Algorithms. Chapter 25 is Solar Coordinates, chapter 24 is maybe related, chapter 45 is the moon.
 *
 * No, not chapter 45. chapter 49 gives phases of the moon, though.
 *
 * this article suggested the book: https://celestrak.com/columns/v03n03/
 *
 * @since 2021-04-23
 
 *
 *
 * @since 2021-07-13
 */
import {BaseOrbitalBody} from './BaseOrbitalBody.class.js';

const dcos = (angle) => Math.cos(angle * Math.PI / 180);
const dsin = (angle) => Math.sin(angle * Math.PI / 180);

class SunOrbitalBody extends BaseOrbitalBody {
	
	constructor(JD = 2459404.5) {
		super(JD, {}, {color: 'yellow', radius: 30});
	}
	
	///
	/// Sun-specific
	///
	
	/**
	 * Sun's true longitude
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get lonsun_deg() {
		return this.v_deg + this.w_deg;
	}
	
	
	/**
	 * Sun's mean longitude
	 *
	 * @since 2021-07-13
	 * @return {number}
	 */
	get Ls_deg() {
		return this.M_deg + this.w_deg;
	}
	
	
	///
	/// Orbital params
	///
	
	/**
	 * Longitude of the ascending node
	 *
	 * for the sun, it's always 0 deg (cause it's on the ecliptic by defn)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get N_deg() {
		return 0;
	}
	
	/**
	 * Inclination
	 *
	 * for the sun, it's always 0 deg (cause it's on the ecliptic by defn)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get i_deg() {
		return 0;
	}
	
	/**
	 * argument of periapsis
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get w_deg() {
		return this.clampAngle(282.9404 + 4.70935E-5 * this.JD);
	}
	
	/**
	 * semi-major axis (i.e., mean distance from parent)
	 *
	 * 1 AU
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get a() {
		return 1; // AU
		
		// Alternately:
		return 1.496e+8; // KM
	}
	
	/**
	 * Eccentricity
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get e() {
		return 0.016709 - 1.151E-9 * this.JD;
	}
	
	/**
	 * Mean anomaly (0 at periapsis. increase uniformly with time)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get M_deg() {
		return this.clampAngle(356.0470 + 0.9856002585 * this.JD);
	}
	
	
	///
	/// Related Orbital Elements
	///
	
	
	/**
	 * true anomaly (angle between position and periapsis)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get v_and_r() {
		const e = this.e,
			E = this.E,
			x_v = Math.cos(E) - e,
			y_v = Math.sqrt(1.0 - Math.pow(e, 2)) * Math.sin(E);
		return {
			v: Math.atan2(y_v, x_v),
			r: Math.sqrt(Math.pow(x_v, 2) + Math.pow(y_v, 2)),
		}
	}
	get v() { return this.v_and_r.v }
	get r() { return this.v_and_r.r }
	/**
	 * @see v
	 * @return {number}
	 */
	get v_deg() {
		return this.clampAngle(this.v * 180 / Math.PI);
	}
	
	
	/**
	 * E, the eccentric anomaly - angular position of body. this is the big mamma jamma.
	 *     This is from the other source, not the nice website. it has calculus in it, should be better.
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get E() {
		const M_deg = this.M_deg, e = this.e;
		const M = M_deg * Math.PI / 180;
		const sin = Math.sin, cos = Math.cos;
		
		let E = M + (e * sin(M));
		let sanity = 0;
		while (++sanity > 0) {
			const dM = M - (E - (e * sin(E)));
			const dE = dM / (1 - (e * cos(E)));
			E += dE;
			if (dE < 0.01) {
				break;
			}
		}
		
		return E;
	}
	
	/**
	 * @see E
	 * @return {*}
	 */
	get E_deg() {
		return this.clampAngle(this.E * 180 / Math.PI);
	}
	
	/**
	 * E ---- ALT, unused:
	 * eccentric anomaly - angular position of body. this is the big mamma jamma.
	 *
	 * "Note that the formulae for computing E are not exact; however they're accurate enough here."
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	// get _E_deg_not_exact() {
	// 	const M_deg = this.M_deg,
	// 		e = this.e;
	//
	// 	return this.clampAngle(
	// 		M_deg +
	// 		((e * dsin(M_deg) * (1 + e * dcos(M_deg)))
	// 		* 180 / Math.PI)
	// 	);
	// }
	
	/**
	 * Right Ascension
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get RA() {
		const equa = this.equatorialCoordinates;
		return Math.atan2(equa.y, equa.x);
	}
	
	/**
	 * Declination
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get Decl() {
		const equa = this.equatorialCoordinates;
		return Math.atan2(equa.z, Math.sqrt(Math.pow(equa.x, 2) + Math.pow(equa.y, 2)));
	}
	
	
	///
	/// Coordinates
	///
	
	
	/**
	 * Ecliptic rectangular geocentric coordinates
	 *
	 * @since 2021-07-12
	 * @return {object}
	 */
	get eclipticCoordinates() {
		const r = this.r,
			lonsun = this.lonsun_deg * Math.PI / 180;
		return {
			x: r * Math.cos(lonsun),
			y: r * Math.sin(lonsun),
			z: 0,
		};
	}
	
	/**
	 * Equatorial rectangular geocentric coordinates
	 *
	 * @since 2021-07-12
	 * @return {object}
	 */
	get equatorialCoordinates() {
		const eclip = this.eclipticCoordinates,
			ecl = this.ecl_deg * Math.PI / 180;
		return {
			x: eclip.x,
			y: eclip.y * Math.cos(ecl),
			z: eclip.y * Math.sin(ecl),
		}
	}
}

export {
	SunOrbitalBody
}
