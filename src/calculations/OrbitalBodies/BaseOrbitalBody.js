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


/**
 * TODO: the following
 *     - "ecliptic rectangular geocentric coordinates"
 *         xs = r * cos(lonsun)
 *         ys = r * sin(lonsun)
 *     - "equatorial rectangular geocentric coordinates"
 *         xe = xs
 *         ye = ys * cos(ecl)
 *         ze = ys * sin(ecl)
 *     - RA
 *         RA  = atan2( ye, xe )
 *     - Decl
 *         Dec = atan2( ze, sqrt(xe*xe+ye*ye) )
 */



class BaseOrbitalBody {
	
	constructor(JD = 2459404.5) {
		this.JD = JD;
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
		console.warning('! v_deg has not been implemented !');
		return 0;
	}
	
	/**
	 * distance to parent body
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get r() {
		console.warning('! r has not been implemented !');
		return 0;
	}
	
	/**
	 * eccentric anomaly
	 *
	 * @since 2021-07-12
	 * @return {number}
	 */
	get E_deg() {
		console.warning('! E_deg has not been implemented !');
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
		return 23.4393 - 3.563E-7 * this.JD;
	}
}

export {
	BaseOrbitalBody
}
