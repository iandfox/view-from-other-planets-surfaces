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
	
}


export {
	MoonCoordinates
}
