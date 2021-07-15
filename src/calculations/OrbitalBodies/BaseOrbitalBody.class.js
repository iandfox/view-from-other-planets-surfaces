/**
 * BaseOrbitalBody
 *
 *     Here I go again...
 *
 *     Going to set in stone what I can, then extend for the rest.
 *
 *     Going back to the OG: http://www.stjarnhimlen.se/comp/ppcomp.html
 *
 * @since 2021-07-12
 */
import { clampAngle, clampAngle180 } from '../Utils/ClampAngle';

class BaseOrbitalBody {
	
	constructor(
		JD = 2459404.5,
		{
			N = [0, 0],
			i = [0, 0],
			w = [0, 0],
			a = [0, 0],
			e = [0, 0],
			M = [0, 0],
		} = {},
		{
			ecl_param = [23.4393, -3.563E-7],
			color = 'white',
			radius = 30,
			name = 'Unnamed Orbital Body'
		} = {}
	) {
		this.JD = JD;
		
		this.params = {N, i, w, a, e, M};
		this.ecl_param = ecl_param;
		this.color = color;
		this.radius = radius;
		
		this.clampAngle = clampAngle;
		this.clampAngle180 = clampAngle180;
	}
	
	///
	/// Primary Orbital Elements
	///
	
	/**
	 * Longitude of the ascending node
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get N_deg() {
		return this.clampAngle(this.params.N[0] + this.params.N[1] * this.JD);
	}
	
	/**
	 * Inclination
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get i_deg() {
		return this.clampAngle(this.params.i[0] + this.params.i[1] * this.JD);
	}
	
	/**
	 * argument of periapsis
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get w_deg() {
		return this.clampAngle(this.params.w[0] + this.params.w[1] * this.JD);
	}
	
	/**
	 * semi-major axis (i.e., mean distance from parent)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get a() {
		return this.params.a[0] + this.params.a[1] * this.JD;
	}
	
	/**
	 * Eccentricity
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get e() {
		return this.params.e[0] + this.params.e[1] * this.JD;
	}
	
	/**
	 * Mean anomaly (0 at periapsis. increase uniformly with time)
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get M_deg() {
		return this.clampAngle(this.params.M[0] + this.params.M[1] * this.JD);
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
		console.warn('! v_deg has not been implemented !');
		return 0;
	}
	
	/**
	 * distance to parent body
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get r() {
		console.warn('! r has not been implemented !');
		return 0;
	}
	
	/**
	 * eccentric anomaly - angular position of body. this is the big mamma jamma.
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get E_deg() {
		console.warn('! E_deg has not been implemented !');
		return 0;
	}
	
	
	/**
	 * longitude of periapsis
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get w1_deg() {
		return this.N_deg + this.w_deg;
	}
	
	/**
	 * Mean longitude
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get L_deg() {
		return this.M_deg + this.w1_deg;
	}
	
	/**
	 * Periapsis distance
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get q() {
		return this.a * (1 - this.e);
	}
	
	/**
	 * apoapsis distance
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get Q() {
		return this.a * (1 + this.e);
	}
	
	/**
	 * Orbital period
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get P() {
		return Math.pow(this.a, 1.5);
	}
	
	/**
	 * time of periapsis
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get T() {
		return (this.M_deg / 360) / this.P;
	}
	
	/**
	 * obliquity of the ecliptic
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get ecl_deg() {
		return this.clampAngle180(this.ecl_param[0] + this.ecl_param[1] * this.JD);
	}
	
	/**
	 * Right Ascension
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get RA() {
		console.warn('!  has not been implemented !');
		return 0;
	}
	
	/**
	 * @see RA
	 * @return {number}
	 */
	get RA_deg() { return this.clampAngle180(this.RA * 180 / Math.PI) }
	
	/**
	 * Declination
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get Decl() {
		console.warn('!  has not been implemented !');
		return 0;
	}
	
	/**
	 * @see Decl
	 * @return {number}
	 */
	get Decl_deg() { return this.clampAngle180(this.Decl * 180 / Math.PI) }
	
	
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
		console.warn('! eclipticCoordinates has not been implemented !');
		return {x: 0, y: 0, z: 0};
	}
	
	/**
	 * Equatorial rectangular geocentric coordinates
	 *
	 * @since 2021-07-12
	 * @return {object}
	 */
	get equatorialCoordinates() {
		console.warn('!  has not been implemented !');
		return {x: 0, y: 0, z: 0};
	}
}

export {
	BaseOrbitalBody
}
