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
	 * true longitude
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get lonsun_deg() {
		return this.v_deg + this.w_deg;
	}
	
	
	
	
	///
	/// Orbital params
	///
	
	/**
	 * Longitude of the ascending node
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get N_deg() {
		console.warning('! N_deg has not been implemented !');
		return 0;
	}
	
	/**
	 * Inclination
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get i_deg() {
		console.warning('! i_deg has not been implemented !');
		return 0;
	}
	
	/**
	 * argument of periapsis
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get w_deg() {
		console.warning('! w_deg has not been implemented !');
		return 0;
	}
	
	/**
	 * semi-major axis (i.e., mean distance from parent)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get a() {
		console.warning('! a has not been implemented !');
		return 0;
	}
	
	/**
	 * Eccentricity
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get e() {
		console.warning('! e has not been implemented !');
		return 0;
	}
	
	/**
	 * Mean anomaly (0 at periapsis. increase uniformly with time)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get M_deg() {
		console.warning('! M_deg has not been implemented !');
		return 0;
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
		
		return Math.atan2(y_v, x_v);
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
		return M_deg + (e * dsin(M_deg) * (1 + e * dcos(M_deg))) * 180 / Math.PI;
	}
}
