/**
 * Space
 *     The Final JS Class
 *
 * @since 2021-07-13
 */
import {AzimuthalCoordinates} from '../calculations/Utils/AzimuthalCoordinates.class';

import seedrandom from 'seedrandom';
import {Drawing} from '../calculations/Drawing.class';
import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
import {MoonOrbitalBody} from '../calculations/OrbitalBodies/MoonOrbitalBody.class';

class Space {
	
	constructor(
		starsCanvas,
		spaceCanvas,
		groundCanvas,
		viewport,
		JD = 2459404.5
	) {
		/* See https://github.com/davidbau/seedrandom.
		 * I want the stars field to be consistent, so I can start to do constellations :3
		 */
		seedrandom('malta', { global: true }); // Global PRNG: set Math.random.
		
		this.starsCanvas  = starsCanvas;
		this.canvas       = spaceCanvas;
		this.groundCanvas = groundCanvas;
		this.ctx          = this.canvas.getContext('2d');
		this.viewport     = viewport;
		this._JD          = JD;
		
		this.sun     = null;
		this.moons   = [];
		this.planets = [];
		this.stars   = [];
		
		this.drawing = new Drawing(this.canvas, {x: 0, y: 0}, this.viewport);
		
		this.drawStars(this.starsCanvas, this.starsCanvas.getContext('2d'));
		
		// TODO 2021-07-13: make the stars rotate
	}
	
	get JD() { return this._JD }
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
	
	
	/**
	 * @since 2021-07-13
	 */
	draw(shouldDrawHorizon = true, shouldDrawSky = true, shouldDrawCompass = true) {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		if (shouldDrawHorizon) { this.drawHorizon(); }
		if (shouldDrawSky)     { this.drawSky(); }
		this.drawSun();
		this.drawPlanets();
		this.drawMoons();
		if (shouldDrawCompass) { this.drawCompass(); }
		
		this.drawDebug();
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawDebug(canvas = this.canvas, ctx = this.ctx) {
		let debug_y_s = this.viewport.top - 5,
			debug_x_s = this.viewport.left + 5;
		ctx.fillStyle = 'white';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.font = '30px serif';
		// this.text(debug_x_s, debug_y_s, this.sun.azi.alt_az.alt_deg, 'white', canvas, ctx);
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawBackground(canvas = this.canvas, ctx = this.ctx) {
		ctx.fillStyle = '#000000';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawStars(canvas = this.canvas, ctx = this.ctx) {
		const randColorDelta = () => Math.floor(Math.random() * 40);
		
		const rand = {
			x: () => (
				this.viewport.left + (Math.random() * (this.viewport.right - this.viewport.left))
			),
			y: () => (
				this.viewport.bottom + (Math.random() * (this.viewport.top - this.viewport.bottom))
			),
			starColor: () => {
				return `rgba(${255 - randColorDelta()}, ${255 - randColorDelta()}, ${255 - randColorDelta()}, ${Math.floor(Math.random() * 255)})`
			},
		};
		
		for (let i = 0; i < 10000; i++) {
			this.stars.push({
				x: rand.x(),
				y: rand.y(),
				radius: (Math.random() * 1.5),
				color: rand.starColor(),
			});
		}
		
		this.stars.forEach((star) => {
			ctx.fillStyle = star.color;
			// ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
			this.drawing.circle(star.x, star.y, star.radius, star.color, canvas, ctx);
		});
		
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawSun(canvas = this.canvas, ctx = this.ctx) {
		if (this.sun) {
			const sun = this.sun;
			const {alt_deg, az_deg} = sun.azi.alt_az;
			this.drawing.circle(az_deg, alt_deg, sun.radius, sun.color, canvas, ctx);
		}
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawSky(canvas = this.canvas, ctx = this.ctx) {
		const sunAlt = this.sun.azi.alt_az.alt_deg;
		if (sunAlt >= -30) {
			ctx.globalAlpha = Math.min(1, (sunAlt + 30) / 60);
			this.drawing.rect(this.viewport.left, 0, this.viewport.right, 90, 'blue', canvas, ctx);
			ctx.globalAlpha = 1;
		}
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawPlanets(canvas = this.canvas, ctx = this.ctx) {
		// TODO
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawMoons(canvas = this.canvas, ctx = this.ctx) {
		this.moons.forEach((moon) => {
			const { alt_deg, az_deg } = moon.azi.alt_az;
			this.drawing.circle(az_deg, alt_deg, moon.radius, moon.color, canvas, ctx);
		});
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawHorizon(canvas = this.canvas, ctx = this.ctx) {
		this.drawing.rect(
			this.viewport.left,
			0,
			this.viewport.right,
			this.viewport.bottom,
			'rgba(0, 100, 0, 0.6)',
			canvas,
			ctx
		);
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawCompass(canvas = this.canvas, ctx = this.ctx) {
		if (this.viewport.bottom <= 0 && this.viewport.top >= 0) {
			// Draw the azimuth-axis
			this.drawing.line(this.viewport.left, 0, this.viewport.right, 0, 'yellow', 1, canvas, ctx);
			
			const leftTick = Math.max(10 * Math.floor(this.viewport.left / 10), -180);
			const rightTick = Math.max(10 * Math.ceil(this.viewport.left / 10), 180);
			for (let x = leftTick; x <= rightTick; x += 10) {
				this.drawing.tickMark(x, 0, x, 'yellow', 1, 4, true, canvas, ctx);
			}
		}
		
		if (this.viewport.left <= 0 && this.viewport.right >= 0) {
			// Draw the altitude-axis, leaving a gap in the middle
			this.drawing.line(0, this.viewport.bottom, 0, -8, 'yellow', 1, canvas, ctx);
			this.drawing.line(0, 8, 0, this.viewport.top, 'yellow', 1, canvas, ctx);
			
			const bottomTick = Math.max(10 * Math.floor(this.viewport.bottom / 10), -90);
			const topTick = Math.max(10 * Math.ceil(this.viewport.top / 10), 90);
			for (let y = bottomTick; y <= topTick; y += 10) {
				if (Math.abs(y) < 0.0001 /* i.e., = 0 */) {
					continue;
				}
				this.drawing.tickMark(0, y, y, 'yellow', 1, 4, false, canvas, ctx);
			}
		}
	}
}

export {
	Space
}
