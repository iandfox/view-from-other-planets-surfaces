/**
 * MoonCoordinates
 *     for calculating various coordinates of the moon.
 *
 * @since 2021-07-11
 */

const dcos = (angle) => Math.cos(angle * 180 / Math.PI);
const dsin = (angle) => Math.sin(angle * 180 / Math.PI);

class MoonCoordinates {
	
	constructor(classInstance = new Moon()) {
		this.o = classInstance; // Short form, o, so that it's easier to reference in code.
	}
	
	get heliocentric() {
		const a = this.o.a,
			E_deg = this.o.E_deg,
			e = this.o.e;
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
