/**
 * SiderealTime
 *     a class just to calculate sidereal time, cause it really should be self contained.
 *
 * @since 2021-07-13
 */
import {SunOrbitalBody} from '../OrbitalBodies/SunOrbitalBody.class';
import {clampAngle, clampAngle180} from './ClampAngle';
import {HA_deg} from './AzimuthalCoordinates';

class SiderealTime {
	
	constructor(sun = new SunOrbitalBody()) {
		this.sun = sun;
		
		this.localLongitude_deg = -111.01908142663117;
		this.localLatitude_deg = 32.198840114469995;
		this.UT_hours = -7;
		this.UT_deg = this.UT_hours * 15;
		
		this.clampAngle = clampAngle;
		this.clampAngle180 = clampAngle180;
		
		
		// TODO 2021-07-13: probably remove this reference... I just want to plot it quickly without creating yet another view.
		this._HA_deg = HA_deg;
	}
	
	// TODO 2021-07-13: probably remove this reference... I just want to plot it quickly without creating yet another view.
	get HA_deg() { return this._HA_deg(this.LST_deg, this.sun.RA_deg) }
	get HA() { return this.HA_deg }
	
	
	get JD()    { return this.sun.JD }
	set JD(val) { this.sun.JD = val }
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @return {number}
	 */
	get GMST_deg() {
		return this.clampAngle180(99.5 + (1.0027379093 * 360 * this.sun.JD));
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
		return this.clampAngle180(this.GMST_deg + this.localLongitude_deg);
	}
}

export {
	SiderealTime
}
