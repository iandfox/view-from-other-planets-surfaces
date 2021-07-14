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
	
	constructor(
		starsCanvas,
		spaceCanvas,
		groundCanvas,
		viewport,
		sun,
		moons = [],
		planets = [],
		JD = 2459404.5
	) {
		this.canvas = spaceCanvas;
		this.ctx = spaceCanvas.getContext('2d');
		this.starsCanvas = starsCanvas;
		this.groundCanvas = groundCanvas;
		this.viewport = viewport;
		this._JD = JD;
		
		sun.azi = new AzimuthalCoordinates(sun, sun);
		sun.JD = JD;
		this.sun = sun;
		
		moons = moons.map((moon) => {
			moon.azi = new AzimuthalCoordinates(moon, sun);
			moon.JD = JD;
			return moon;
		});
		this.moons = moons;
		
		planets = planets.map((planet) => {
			// TODO 2021-07-14: might need to change this, to represent planet vs moon diff
			planet.azi = new AzimuthalCoordinates(planet, sun);
			planet.JD = JD;
			return planet;
		});
		this.planets = planets;
		
		this.stars = [];
		
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
	 * @since 2021-07-13
	 */
	draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawHorizon();
		this.drawSky();
		this.drawSun();
		this.drawPlanets();
		this.drawMoons();
		this.drawCompass();
		
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
		// TODO 2021-07-14: allow defn for sun radius, sun color
		this.circle(az_deg, alt_deg, 30, 'yellow', canvas, ctx);
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
			this.rect(this.viewport.left, 0, this.viewport.right, 90, 'blue', canvas, ctx);
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
			// TODO 2021-07-14: allow defn for moon radius, moon color
			this.circle(az_deg, alt_deg, 28, 'grey', canvas, ctx);
		});
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param canvas
	 * @param ctx
	 */
	drawHorizon(canvas = this.canvas, ctx = this.ctx) {
		this.rect(
			this.viewport.left,
			0,
			this.viewport.right,
			this.viewport.bottom,
			'rgba(0, 200, 0, 0.3)',
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
		for (let x = -180; x <= 180; x += 10) { // TODO: only draw in viewport
			this.tickMark(x, 0, x, 'yellow', 1, 6, true, canvas, ctx);
		}
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
	circle(x_s, y_s, r, color = 'white', canvas = this.canvas, ctx = this.ctx) {
		const {x, y} = this.toCanvas(x_s, y_s, canvas, ctx);
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.arc(x, y, r, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param x1_s
	 * @param y1_s
	 * @param x2_s
	 * @param y2_s
	 * @param color
	 * @param canvas
	 * @param ctx
	 */
	rect(x1_s, y1_s, x2_s, y2_s, color = 'white', canvas = this.canvas, ctx = this.ctx) {
		const {x, y} = this.toCanvas(x1_s, y1_s, canvas, ctx);
		const {x: x2, y: y2} = this.toCanvas(x2_s, y2_s, canvas, ctx);
		const w = x2 - x, h = y2 - y;
		ctx.fillStyle = color;
		ctx.fillRect(x, y, w, h);
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param x1_s
	 * @param y1_s
	 * @param x2_s
	 * @param y2_s
	 * @param color
	 * @param lineWidth
	 * @param canvas
	 * @param ctx
	 */
	line(x1_s, y1_s, x2_s, y2_s, color = 'white', lineWidth = 1, canvas = this.canvas, ctx = this.ctx) {
		const {x: x1, y: y1} = this.toCanvas(x1_s, y1_s, canvas, ctx);
		const {x: x2, y: y2} = this.toCanvas(x2_s, y2_s, canvas, ctx);
		ctx.strokeStyle = color;
		ctx.strokeWidth = lineWidth;
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}
	
	
	/**
	 * @since 2021-07-14
	 *
	 * @param x_s
	 * @param y_s
	 * @param label
	 * @param color
	 * @param lineWidth
	 * @param tickLength
	 * @param isVertical
	 * @param canvas
	 * @param ctx
	 */
	tickMark(x_s, y_s, label = x_s, color = 'white', lineWidth = 1, tickLength = 4, isVertical = true, canvas = this.canvas, ctx = this.ctx) {
		const {x, y} = this.toCanvas(x_s, y_s, canvas, ctx);
		const halfLength_s = 0.5 * tickLength;
		ctx.fillStyle = color;
		ctx.font = '13px serif';
		
		// convert to canvas coords
		let { x: halfLength } = this.toCanvas(x_s + halfLength_s, 0);
		halfLength -= x;
		
		if (isVertical) {
			this.line(x_s, y_s - halfLength_s, x_s, y_s + halfLength_s, color, lineWidth, canvas, ctx);
			ctx.textBaseline = 'top';
			ctx.textAlign = 'center';
			ctx.fillText(label, x, y - 2 * halfLength);
		} else {
			this.line(x_s - halfLength_s, y_s, x_s + halfLength_s, y_s, color, lineWidth, canvas, ctx);
			ctx.fillText(label, x, y);
		}
	}
	
	
	text(x_s, y_s, label = x_s, color = 'white', canvas = this.canvas, ctx = this.ctx) {
		const {x, y} = this.toCanvas(x_s, y_s, canvas, ctx);
		ctx.fillStyle = color;
		ctx.fillText(label, x, y);
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
		const hor = this.viewport.right - this.viewport.left,
			ver = this.viewport.top - this.viewport.bottom;
		if (hor === 0 || ver === 0) {
			console.warn('Bad viewport given. Sending (0, 0)')
			return {x: 0, y: 0};
		}
		
		const scl_x = (x_s - this.viewport.left) / hor,
			scl_y = (y_s - this.viewport.bottom) / ver;
		return {
			x: scl_x * this.canvas.width,
			y: (1 - scl_y) * this.canvas.height
		}
	}
}

export {
	Space
}
