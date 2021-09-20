/**
 * AzimuthalCoordinates
 *     A class to connect an orbital body and a sun and return some body-specific coords
 *
 * Usage:
 *     const azi = new AzimuthalCoordinates(orbitalBodyObject, sunOrbitalBodyObject);
 *     azi.JD = 12345;
 *     azi.HA_deg;
 *
 * @since 2021-07-13
 */
import {clampAngle180} from './ClampAngle';
import {SiderealTime} from './SiderealTime.class';

class AzimuthalCoordinates {
	
	constructor(orbitalBody, sunOrbitalBody) {
		this.ob = orbitalBody;
		this.sun = sunOrbitalBody;
		
		this.siderealTime = new SiderealTime(this.sun);
	}
	
	
	// In case I forget the shorthand names for them :shrug:
	get orbitalBody()    { return this.ob }
	get sunOrbitalBody() { return this.sun }
	
	
	// gotta make sure times stay sync'd up
	get JD()    { return this.ob.JD }
	set JD(val) { this.ob.JD = val; this.sun.JD = val; }
	
	
	/**
	 * Hour Angle
	 *
	 * @since 2021-07-13
	 *
	 * @return {number}
	 */
	get HA_deg() {
		return clampAngle180(this.siderealTime.LST_deg - this.ob.RA_deg);
	}
	
	/**
	 * @see HA_deg
	 * @since 2021-07-13
	 * @return {number}
	 */
	get HA() { return this.HA_deg * Math.PI / 180 }
	
	
	get alt_az() {
		const HA = this.HA,
			Decl = this.ob.Decl,
			lat = this.siderealTime.localLatitude_deg * Math.PI / 180;
		const sin = Math.sin, cos = Math.cos;
		
		const alt_az = {
			x: cos(HA) * cos(Decl),
			y: sin(HA) * cos(Decl),
			z: sin(Decl),
			horizon: {
				x: 0,
				y: 0,
				z: 0,
			},
			alt: 0,
			az: 0,
			az_deg: 0,
			alt_deg: 0,
		};
		
		alt_az.horizon.x = (alt_az.x * sin(lat)) - (alt_az.z * cos(lat));
		alt_az.horizon.y = alt_az.y;
		alt_az.horizon.z = (alt_az.x * cos(lat)) + (alt_az.z * sin(lat));
		
		alt_az.alt = Math.asin(alt_az.horizon.z);
		alt_az.az  = Math.atan2(alt_az.horizon.y, alt_az.horizon.x) + Math.PI;
		
		alt_az.alt_deg = clampAngle180(alt_az.alt * 180 / Math.PI);
		alt_az.az_deg  = clampAngle180(alt_az.az * 180 / Math.PI);
		
		return alt_az;
	}
	
	get alt() { return this.alt_az.alt }
	get az()  { return this.alt_az.az }
	
	get alt_deg() { return this.alt_az.alt_deg }
	get az_deg()  { return this.alt_az.az_deg }
}

export {
	AzimuthalCoordinates
}
