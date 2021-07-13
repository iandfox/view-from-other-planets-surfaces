/**
 * SunOrbitalBody
 *
 * @since 2021-07-13
 */
import {BaseOrbitalBody} from './BaseOrbitalBody';

const dcos = (angle) => Math.cos(angle * 180 / Math.PI);
const dsin = (angle) => Math.sin(angle * 180 / Math.PI);

class SunOrbitalBody extends BaseOrbitalBody {
	
	constructor(JD = 2459404.5) {
		super(JD);
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
	get v_deg() {
		const e = this.e,
			E_deg = this.E_deg,
			x_v = dcos(E_deg) - e, // r * cos(v)
			y_v = Math.sqrt(1.0 - Math.pow(e, 2)) * dsin(E_deg); // r * sin(v)
		
		return this.clampAngle((Math.atan2(y_v, x_v) * 180 / Math.PI));
	}
	
	/**
	 * distance to parent body
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get r() {
		const e = this.e,
			E_deg = this.E_deg,
			x_v = dcos(E_deg) - e, // r * cos(v)
			y_v = Math.sqrt(1.0 - Math.pow(e, 2)) * dsin(E_deg); // r * sin(v)
		
		return Math.sqrt(Math.pow(x_v, 2) + Math.pow(y_v, 2));
	}
	
	/**
	 * eccentric anomaly
	 *
	 * "Note that the formulae for computing E are not exact; however they're accurate enough here."
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get E_deg() {
		const M_deg = this.M_deg,
			e = this.e;
		return this.clampAngle(M_deg + (e * dsin(M_deg) * (1 + e * dcos(M_deg))) * 180 / Math.PI);
	}
	
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
			lonsun_deg = this.lonsun_deg;
		return {
			x: r * dcos(lonsun_deg),
			y: r * dsin(lonsun_deg),
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
			ecl_deg = this.ecl_deg;
		return {
			x: eclip.x,
			y: eclip.y * dcos(ecl_deg),
			z: eclip.y * dsin(ecl_deg),
		}
	}
}

export {
	SunOrbitalBody
}
