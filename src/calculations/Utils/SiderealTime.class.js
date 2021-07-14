/**
 * SiderealTime
 *     a class just to calculate sidereal time, cause it really should be self contained.
 *
 * @since 2021-07-13
 */
import {SunOrbitalBody} from '../OrbitalBodies/SunOrbitalBody.class';
import {clampAngle, clampAngle180} from './ClampAngle';

class SiderealTime {
	
	constructor(sun = new SunOrbitalBody()) {
		this.sun = sun;
		
		this.localLongitude_deg = -111.01908142663117;
		this.localLatitude_deg = 32.198840114469995;
		this.UT_hours = -7;
	}
	
	
	get JD()    { return this.sun.JD }
	set JD(val) { this.sun.JD = val }
	
	get UT_deg() { return this.UT_hours * 15 }
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @return {number}
	 */
	get GMST_deg() {
		return clampAngle180(99.5 + (1.0027379093 * 360 * this.sun.JD));
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @return {number}
	 */
	get GMST() { return this.GMST_deg * 180 / Math.PI }
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @return {number}
	 */
	get LST_deg() {
		return clampAngle180(this.GMST_deg + this.localLongitude_deg);
	}
}

export {
	SiderealTime
}
