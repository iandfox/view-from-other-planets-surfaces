/**
 * Space
 *     The Final JS Class
 *
 * @since 2021-07-13
 */
import {MoonOrbitalBody} from '../calculations/OrbitalBodies/MoonOrbitalBody.class';
import {SiderealTime} from '../calculations/Utils/SiderealTime.class';
import {SunOrbitalBody} from '../calculations/OrbitalBodies/SunOrbitalBody.class';
import {AzimuthalCoordinates} from '../calculations/Utils/AzimuthalCoordinates.class';

class Space {
	
	constructor(canvas, starsCanvas, viewport, moon, sun, JD = 2459404.5) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.starsCanvas = starsCanvas;
		this.viewport = viewport;
		this._JD = JD;
		
		sun.azi = new AzimuthalCoordinates(sun, sun);
		sun.JD = JD;
		this.sun = sun;
		
		moon.azi = new AzimuthalCoordinates(moon, sun);
		moon.JD = JD;
		this.moon = moon;
		
		this.stars = [];
		
		// why the fuck aren't canvases going transparent when i clear them? what the fuck?!
		
		// TODO: make the stars rotate
	}
	
	get JD() { return this._JD }
	set JD(jd) {
		this._JD = jd;
		([this.sun, this.moon]).forEach((ob) => {
			ob.JD = jd;
		});
	}
	
	/**
	 * @since 2021-07-13
	 */
	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawSun();
		this.drawSky();
		this.drawPlanets();
		this.drawMoons();
		this.drawHorizon();
		this.drawCompass();
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
		const rand = {
			x: () => (
				this.viewport.left + (Math.random() * (this.viewport.right - this.viewport.left))
			),
			y: () => (
				this.viewport.bottom + (Math.random() * (this.viewport.top - this.viewport.bottom))
			),
			starColor: () => {
				return `rgba(${255 - Math.floor(Math.random() * 10)}, ${255 - Math.floor(Math.random() * 10)}, ${255 - Math.floor(Math.random() * 10)}, ${Math.floor(Math.random() * 255)})`
			},
		};
		
		for (let i = 0; i < 1000; i++) {
			this.stars.push({
				x: rand.x(),
				y: rand.y(),
				radius: (Math.random() * 2),
				color: rand.starColor(),
			});
		}
		
		this.stars.forEach((star) => {
			this.circle(star.x, star.y, star.radius, star.color, canvas, ctx);
		});
		
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawSun(canvas = this.canvas, ctx = this.ctx) {
		const sun = this.sun;
		const { alt_deg, az_deg } = sun.azi.alt_az;
		this.circle(az_deg, alt_deg, 50, 'yellow', canvas, ctx);
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawSky(canvas = this.canvas, ctx = this.ctx) {
		//
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawPlanets(canvas = this.canvas, ctx = this.ctx) {
		//
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawMoons(canvas = this.canvas, ctx = this.ctx) {
		// TODO: allow multiple moons
		const moon = this.moon;
		const { alt_deg, az_deg } = moon.azi.alt_az;
		this.circle(az_deg, alt_deg, 48, 'grey', canvas, ctx);
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawHorizon(canvas = this.canvas, ctx = this.ctx) {
		// const c = (x, y) => this.toCanvas(x, y, canvas, ctx);
		//
		// const topLeft = c(this.)
		//
		// this.ctx.beginPath();
		//
		// this.ctx.moveTo()
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawCompass(canvas = this.canvas, ctx = this.ctx) {
		//
	}
	
	
	
	///
	/// Drawing
	///
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param x_s   The x-coordinate in the space's coordinate system
	 * @param y_s   The y-coordinate in the space's coordinate system
	 * @param r
	 * @param color
	 * @param canvas
	 * @param ctx
	 */
	circle(x_s, y_s, r, color, canvas = this.canvas, ctx = this.ctx) {
		const {x, y} = this.toCanvas(x_s, y_s);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	
	/**
	 * @since 2021-07-13
	 *
	 * @param x_s
	 * @param y_s
	 * @param canvas
	 * @param ctx
	 * @return {{x: number, y: number}}
	 */
	toCanvas(x_s, y_s, canvas = this.canvas, ctx = this.ctx) {
		const scl_x = (x_s - this.viewport.left) / (this.viewport.right - this.viewport.left),
			scl_y = (y_s - this.viewport.bottom) / (this.viewport.top - this.viewport.bottom);
		return {
			x: scl_x * this.canvas.width,
			y: (1 - scl_y) * this.canvas.height
		}
	}
}

export {
	Space
}
