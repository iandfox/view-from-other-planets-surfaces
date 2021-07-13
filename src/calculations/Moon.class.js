/**
 * Moon viewing
 *
 * @created 2021-07-11
 */

import { MoonParameters } from './OrbitalParameters';
import {MoonCoordinates} from './MoonCoordinates.class';

class Moon {
	
	
	// TODO: orbital params as args.
	constructor(JD = 0) {
		this.JD = JD;
		
		this.DEG_TO_RAD = Math.PI / 180;
		this.RAD_TO_DEG = 180 / Math.PI;
		
		this.ONE_AU = 149597870700; // 1 AU defined as 149,597,870,700 meters
		
		this.tolerance = 1e-6;
		
		this.semimajorAxis = MoonParameters.semimajorAxis; // [initial, per century]
		this.eccentricity = MoonParameters.eccentricity; // [initial, per century]
		this.inclination_deg = MoonParameters.inclination; // [initial, per century]
		this.meanLongitude_deg = MoonParameters.meanLongitude; // [initial, per century]
		this.longitudeOfPeriapsis_deg = MoonParameters.longitudeOfPeriapsis; // [initial, per century]
		this.longitudeOfTheAscendingNode_deg = MoonParameters.longitudeOfTheAscendingNode; // [initial, per century]
		
		this.coordinates = new MoonCoordinates(this);
	}
	
	get JD() { return this._JD }
	set JD(newJD) { this._JD = newJD; }
	
	///
	/// Pass-throughs from `Moon` to `MoonCoordinates`
	///
	get heliocentric()    { return this.coordinates.heliocentric }
	get ecliptic()        { return this.coordinates.ecliptic }
	get equatorial()      { return this.coordinates.equatorial }
	get v()               { return this.coordinates.v }
	get r()               { return this.coordinates.r }
	get ecliptic_latlng() { return this.coordinates.ecliptic_latlng }
	get RA_deg() { return this.coordinates.RA_deg }
	get Decl_deg() { return this.coordinates.Decl_deg }
	get r_geo() { return this.coordinates.r_geo }
	get geocentric() { return this.coordinates.geocentric }
	
	
	
	///
	/// Basics
	///
	
	/**
	 * Math.sin, but for angles given in degrees.
	 *
	 * @since 2021-07-11
	 *
	 * @param {number} angleInDegrees
	 *
	 * @return {number}
	 */
	dsin(angleInDegrees) {
		return Math.sin(angleInDegrees * this.DEG_TO_RAD);
	}
	
	/**
	 * Math.cos, but for angles given in degrees.
	 *
	 * @since 2021-07-11
	 *
	 * @param {number} angleInDegrees
	 *
	 * @return {number}
	 */
	dcos(angleInDegrees) {
		return Math.cos(angleInDegrees * this.DEG_TO_RAD);
	}
	
	// TODO 2021-07-11: mod 360 for all of these
	
	/**
	 * Julian centuries of 36525 ephemeris days from the epoch J2000.0 (2000 January 1.5 TD)
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get T() {
		return (this.JD - 2451545) / 36525;
	}
	
	
	///
	/// Orbital params
	///
	
	
	/**
	 * Semi-major axis. Longest diameter of an ellipse
	 *
	 * @since 2021-07-11
	 *
	 * @return {number}
	 */
	get a() {
		return this.semimajorAxis[0] + this.semimajorAxis[1] * this.T;
	}
	
	
	/**
	 * Eccentricity of the moon's orbit
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get e() {
		return this.eccentricity[0] + this.eccentricity[1] * this.T;
	}
	
	
	/**
	 * Inclination, the tilt of the moon's orbit around its planet
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get i_deg() {
		return ((this.inclination_deg[0] + this.inclination_deg[1] * this.T) % 360 + 360) % 360;
	}
	
	
	/**
	 * Mean longitude. NOTE: in `try-3_calculate-position.js`, this is just "L" but I'm pretty sure "L" is the true longitude. TODO 2021-07-11: come back to this.
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get L0_deg() {
		return ((this.meanLongitude_deg[0] + this.meanLongitude_deg[1] * this.T) % 360 + 360) % 360;
	}
	
	
	/**
	 * Longitude of the periapsis
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get p_deg() {
		return ((this.longitudeOfPeriapsis_deg[0] + this.longitudeOfPeriapsis_deg[1] * this.T) % 360 + 360) % 360;
	}
	
	
	/**
	 * Longitude of the ascending node
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get W_deg() {
		return ((this.longitudeOfTheAscendingNode_deg[0] + this.longitudeOfTheAscendingNode_deg[1] * this.T) % 360 + 360) % 360;
	}
	
	
	///
	/// Derived values
	///
	
	
	/**
	 * Argument of the perihelion
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get w_deg() {
		return ((this.p_deg - this.W_deg) % 360 + 360) % 360; // note to self: this means i could derive any one given the other two. might be useful for diff data sources
	}
	
	
	/**
	 * Mean anomaly. According to wikipedia:
	 *     An orbiting body's mean longitude is calculated l = Ω + ω + M, where Ω is the longitude of the ascending
	 *     node, ω is the argument of the pericenter and M is the mean anomaly, the body's angular distance from the
	 *     pericenter as if it moved with constant speed rather than with the variable speed of an elliptical orbit.
	 *     Its true longitude is calculated similarly, L = Ω + ω + ν, where ν is the true anomaly.
	 *
	 * Therefore:
	 *     M = l - Ω - ω
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get M_deg() {
		return ((
			this.L0_deg   // mean longitude
			- this.w_deg  // argument of perihelion
			- this.p_deg
		) % 360 + 360) % 360; // longitude of periapsis
	}
	
	
	/**
	 * Eccentric anomaly
	 *     Solve M = E - e* sin(E) for E.
	 *           where e is "e_deg"
	 *
	 * @since 2021-04-23
	 *
	 * @return {number}
	 */
	get E_deg() {
		const e_deg = (180 * Math.PI) * this.e;
		let E_deg = this.M_deg + e_deg * this.dsin(this.M_deg);
		let sanity = 0;
		while (true && ++sanity < 1000) {
			const dM = this.M_deg - (E_deg - e_deg * this.dsin(E_deg));
			const dE = dM / (1 - this.e * this.dcos(E_deg));
			E_deg += dE;
			if (Math.abs(dE) < this.tolerance) {
				break;
			}
		}
		
		return (E_deg % 360 + 360) % 360;
	}
}


export {
	Moon
}
