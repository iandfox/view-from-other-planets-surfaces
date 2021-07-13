/**
 * MoonCoordinates
 *     for calculating various coordinates of the moon.
 *
 * @since 2021-07-11
 */
import {Moon} from './Moon.class';

const dcos = (angle) => Math.cos(angle * 180 / Math.PI);
const dsin = (angle) => Math.sin(angle * 180 / Math.PI);

class MoonCoordinates {
	
	constructor(moon = new Moon()) { // TODO 2021-07-11: use others things than earth's moon. eventually.
		this.o = moon; // Short form, o, so that it's easier to reference in code.
	}
	
	///
	/// Pass-throughs for some commonly needed things from moonparams
	///
	get JD()    { return this.o.JD }
	set JD(val) { this.o.JD = val; }
	get T()     { return this.o.T  }
	
	/*
N	=	longitude of the ascending node
i	=	inclination to the ecliptic (plane of the Earth's orbit)
w	=	argument of perihelion
a	=	semi-major axis, or mean distance from Sun
e	=	eccentricity (0=circle, 0-1=ellipse, 1=parabola)
M	=	mean anomaly (0 at perihelion; increases uniformly with time)
Related orbital elements are:
w1	=	N + w	=	longitude of perihelion
L	=	M + w1	=	mean longitude
q	=	a*(1-e)	=	perihelion distance
Q	=	a*(1+e)	=	aphelion distance
P	=	a ^ 1.5	=	orbital period (years if a is in AU, astronomical units)
T	=	Epoch_of_M - (M(deg)/360_deg) / P	=	time of perihelion
v		=	true anomaly (angle between position and perihelion)
E		=	eccentric anomaly
	
	
	Compute the planet's position in 3-dimensional space:
	xh = r * ( dcos(W_deg) * dcos(v_deg + w_deg) - dsin(W_deg) * dsin(v_deg + w_deg) * dcos(i_deg) )
	yh = r * ( dsin(W_deg) * dcos(v_deg + w_deg) + dcos(W_deg) * dsin(v_deg + w_deg) * dcos(i_deg) )
	zh = r * ( dsin(v_deg + w_deg) * dsin(i_deg) )
For the Moon, this is the geocentric (Earth-centered) position in the ecliptic coordinate system. For the planets, this is the heliocentric (Sun-centered) position, also in the ecliptic coordinate system.

If one wishes, one can compute the ecliptic longitude and latitude:
	lonecl = atan2( yh, xh )
	latecl = atan2( zh, sqrt(xh*xh+yh*yh) )
	 */
	// get heliocentric() {
	// 	const a   = this.o.a,
	// 		E_deg = this.o.E_deg,
	// 		e     = this.o.e;
	// 	return {
	// 		x: a * (dcos(E_deg) - e),
	// 		y: a * Math.sqrt(1 - Math.pow(e, 2)) * dsin(E_deg),
	// 		z: 0
	// 	}
	// }
	
	get ecliptic() {
		const W_deg = this.o.W_deg,
			w_deg = this.o.w_deg,
			i_deg = this.o.i_deg,
			r = this.r,
			v_deg = this.v_deg;
		
		const coords = {
			x: r * (dcos(W_deg) * dcos(v_deg + w_deg) - dsin(W_deg) * dsin(v_deg + w_deg) * dcos(i_deg)),
			y: r * (dsin(W_deg) * dcos(v_deg + w_deg) + dcos(W_deg) * dsin(v_deg + w_deg) * dcos(i_deg)),
			z: r * (dsin(v_deg + w_deg) * dsin(i_deg)),
		};
		
		return coords;
		
		
		// const helio = this.heliocentric,
		// 	w_deg = this.o.w_deg,
		// 	W_deg = this.o.W_deg,
		// 	i_deg = this.o.i_deg;
		//
		// const cW = dcos(W_deg),
		// 	sW = dsin(W_deg),
		// 	cw = dcos(w_deg),
		// 	sw = dsin(w_deg),
		// 	ci = dcos(i_deg),
		// 	si = dsin(i_deg);
		//
		// return {
		// 	x: helio.x * (cw * cW - sw * sW * ci),// + helio.y * (-1 * sw * cW - cw * sW * ci),
		// 	y: helio.x * (cw * sW + sw * cW * ci),// + helio.y * (-1 * sw * sW + cw * cW * ci),
		// 	z: helio.x * (sw * si),// + helio.y * (cw * si)
		// }
	}
	
	
	get equatorial() {
		const obliquity_deg = 23.43928; // obliquity, epsilon, at J2000 // TODO: make this a param maybe?
		const ecl = this.ecliptic;
		return {
			x: ecl.x,
			y: dcos(obliquity_deg) * ecl.y - dsin(obliquity_deg) * ecl.z,
			z: dsin(obliquity_deg) * ecl.y - dcos(obliquity_deg) * ecl.z,
		}
	}
	
	
	get v() {
		return Math.atan2(
			this.o.a * Math.sqrt(1 - Math.pow(this.o.e, 2) * dsin(this.o.E_deg)),
		    this.o.a * (dcos(this.o.E_deg) - this.o.e)
		);
	}
	
	get v_deg() {
		return this.v * 180 / Math.PI;
	}
	
	// true anomaly i think
	get r() {
		return Math.sqrt(Math.pow(this.o.a * (dcos(this.o.E_deg) - this.o.e), 2) + Math.pow(this.o.a * Math.sqrt(1 - Math.pow(this.o.e, 2)) * dsin(this.o.E_deg), 2));
	}
	
	
	get geocentric() {
		return this.ecliptic;
		// const r = this.r,
		// 	latlng = this.ecliptic_latlng;
		// return {
		// 	x: r * dcos(latlng.lng_deg) * dcos(latlng.lat_deg),
		// 	y: r * dsin(latlng.lng_deg) * dcos(latlng.lat_deg),
		// 	z: r * dsin(latlng.lat_deg),
		// }
	}
	
	
	get ecliptic_latlng() {
		const helio = this.heliocentric;
		const output = {
			lng: Math.atan2(helio.y, helio.x),
			lat: Math.atan2(helio.z, Math.sqrt(Math.pow(helio.x, 2) + Math.pow(helio.y, 2))),
			lng_deg: 0,
			lat_deg: 0,
		};
		output.lng_deg = output.lng * this.o.RAD_TO_DEG; // TODO: these are wrong, or this whole method is
		output.lat_deg = output.lat * this.o.RAD_TO_DEG;
		return output;
	}
	
	
	/**
	 * Right Ascension
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	get RA_deg() {
		const equa = this.equatorial;
		return (Math.atan2(equa.y, equa.x) * 180 / Math.PI);
	}
	
	
	/**
	 * Declination
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	get Decl_deg() {
		const equa = this.equatorial;
		const helio = this.heliocentric;
		return Math.atan2(equa.z, Math.sqrt(Math.pow(equa.x, 2) + Math.pow(equa.y, 2)))
	}
	
	/**
	 * Geocentric distance
	 *
	 * @since 2021-07-12
	 *
	 * @return {number}
	 */
	get r_geo() {
		const equa = this.equatorial;
		return Math.sqrt(Math.pow(equa.x, 2) + Math.pow(equa.y, 2) + Math.pow(equa.z, 2));
	}
	
}


export {
	MoonCoordinates
}
