import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
import {AzimuthalCoordinates} from '../calculations/Utils/AzimuthalCoordinates.class';
import {MoonOrbitalBody} from '../calculations/OrbitalBodies/MoonOrbitalBody.class';

/**
 * Keep code DRY.
 *
 * @since 2021-07-20
 */

class BaseSpace {
	
	constructor(viewport = {left: -180, right: 180, top: 180, bottom: -180}, JD = 2459404.5) {
		this.viewport = viewport;
		
		this.sun = null;
		this.moons = [];
		this.planets = [];
		
		this._JD = JD;
	}
	
	get JD() {
		return this._JD;
	}
	set JD(jd) {
		this._JD = jd;
		([this.sun, ...this.moons, ...this.planets]).forEach((ob) => {
			ob.JD = jd;
		});
	}
	
	
	/**
	 * Add the sun. Only call this once.
	 *
	 * @since 2021-07-15
	 * @return {SunOrbitalBody}
	 */
	addSun() {
		const sun = new SunOrbitalBody(this.JD);
		sun.azi = sun.azi ? sun.azi : new AzimuthalCoordinates(sun, sun);
		this.sun = sun;
		return this.sun;
	}
	
	
	/**
	 * Add a moon.
	 *
	 * @since 2021-07-15
	 *
	 * @param {object} moonParameters
	 * @param {string} color
	 * @param {number} radius
	 * @param {string} name
	 * @return {MoonOrbitalBody}
	 */
	addMoon(moonParameters = {}, color = 'grey', radius = 20, name = 'Unnamed Moon') {
		if (! this.sun) {
			console.error('Cannot add a moon unless there is already a sun. Aborting.');
			return null;
		}
		const moon = new MoonOrbitalBody(this.JD, moonParameters, {color, radius, name});
		moon.azi = moon.azi ? moon.azi : new AzimuthalCoordinates(moon, this.sun);
		this.moons.push(moon);
		return moon;
	}
	
	
	/**
	 * Replace 'em all! The easiest way to reactive change the moon params.
	 *
	 * @param moonsParameters
	 *
	 * @since 2021-07-17
	 */
	replaceMoons(moonsParameters) {
		this.moons = [];
		moonsParameters.forEach((moonParameters) => {
			const color = moonParameters.color ? moonParameters.color : 'grey';
			const radius = moonParameters.radius ? moonParameters.radius : 20;
			const name = moonParameters.name ? moonParameters.name : 'Unnamed re-Moon';
			this.addMoon(moonParameters, color, radius, name);
		});
	}
	
	
	// TODO.
	// addPlanet() {}
}


export {
	BaseSpace
}
