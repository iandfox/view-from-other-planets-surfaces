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
	
	constructor(moonParams = new Moon()) { // TODO 2021-07-11: use others things than earth's moon. eventually.
		this.o = new Moon(); // Short form, o, so that it's easier to reference in code.
	}
	
	///
	/// Pass-throughs for some commonly needed things from moonparams
	///
	get JD() { return this.o.JD }
	set JD(val) { this.o.JD = val; }
	get T()  { return this.o.T  }
	
	get heliocentric() {
		const a   = this.o.a,
			E_deg = this.o.E_deg,
			e     = this.o.e;
		return {
			x: a * (dcos(E_deg) - e),
			y: a * Math.sqrt(1 - Math.pow(e, 2)) * dsin(E_deg),
			z: 0
		}
	}
	
	get ecliptic() {
		const helio = this.heliocentric,
			w_deg = this.o.w_deg,
			W_deg = this.o.W_deg,
			i_deg = this.o.i_deg;
		
		const cW = dcos(W_deg),
			sW = dsin(W_deg),
			cw = dcos(w_deg),
			sw = dsin(w_deg),
			ci = dcos(i_deg),
			si = dsin(i_deg);
		
		return {
			x: helio.x * (cw * cW - sw * sW * ci) + helio.y * (-1 * sw * cW - cw * sW * ci),
			y: helio.x * (cw * sW + sw * cW * ci) + helio.y * (-1 * sw * sW + cw * cW * ci),
			z: helio.x * (sw * si) + helio.y * (cw * si)
		}
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
	
	
	get r() {
		return Math.sqrt(Math.pow(this.o.a * (dcos(this.o.E_deg) - this.o.e), 2) + Math.pow(this.o.a * Math.sqrt(1 - Math.pow(this.o.e, 2)) * dsin(this.o.E_deg), 2));
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
	
}


export {
	MoonCoordinates
}
