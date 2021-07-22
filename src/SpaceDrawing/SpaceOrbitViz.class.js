/**
 * Drawing orbits
 *
 * @since 2021-07-20
 */
import {BaseSpace} from './BaseSpace.class';
import {Drawing} from '../calculations/Drawing.class';
import {to2d} from '../calculations/Drawing3DProjections';

class SpaceOrbitViz extends BaseSpace {
	constructor(viewport, JD, canvas) {
		super(viewport, JD);
		
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		
		this.drawing = new Drawing(this.canvas, {x: 0, y: 0}, this.viewport);
		
		this.perspectiveAngle = 60;
	}
	
	get bodies() {
		return [this.sun, ...this.moons, ...this.planets];
	}
	
	reset() {
		this.drawing.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		const axes = {
			x: {
				start: to2d(-1, 0, 0, this.perspectiveAngle),
				end:   to2d(1, 0, 0, this.perspectiveAngle),
			},
			y: {
				start: to2d(0, -1, 0, this.perspectiveAngle),
				end:   to2d(0, 1, 0, this.perspectiveAngle),
			},
			z: {
				start: to2d(0, 0, -1, this.perspectiveAngle),
				end:   to2d(0, 0, 1, this.perspectiveAngle),
			}
		};
		
		// Draw axes
		this.drawing.line(axes.x.start.x, axes.x.start.y, axes.x.end.x, axes.x.end.y, 'white');
		this.drawing.line(axes.y.start.x, axes.y.start.y, axes.y.end.x, axes.y.end.y, 'white');
		this.drawing.line(axes.z.start.x, axes.z.start.y, axes.z.end.x, axes.z.end.y, 'white');
		
		this.drawing.circle(0, 0, 10, 'skyblue');
	}
	
	drawState(jd, radiusScale = 1, drawLinesToPlanes = false) {
		this.JD = jd; // Also sets JD on all the bodies
		const bodies = this.bodies;
		bodies.forEach((ob, index) => {
			const {x, y, z} = ob.equatorialCoordinates;
			const {x: x2d, y: y2d} = to2d(x, y, z, this.perspectiveAngle);
			
			// Draw a line from object to xy-plane
			if (drawLinesToPlanes) {
				this.ctx.save();
				const {x: x_plane_x, y: x_plane_y} = to2d(0, y, z, this.perspectiveAngle);
				const {x: y_plane_x, y: y_plane_y} = to2d(x, 0, z, this.perspectiveAngle);
				const {x: z_plane_x, y: z_plane_y} = to2d(x, y, 0, this.perspectiveAngle);
				this.ctx.globalAlpha = 0.2;
				this.drawing.line(x2d, y2d, x_plane_x, x_plane_y, 'yellow');
				this.drawing.line(x2d, y2d, y_plane_x, y_plane_y, 'yellow');
				this.drawing.line(x2d, y2d, z_plane_x, z_plane_y, 'yellow');
				this.ctx.globalAlpha = 1;
				this.ctx.restore();
			}
			
			// Draw the body
			const r = Math.max(0.3, radiusScale * ob.radius);
			this.drawing.circle(x2d, y2d, r, ob.color);
		});
	}
	
	draw(jdMin = 0, jdMax = 1, jdStep = 0.1, doReset = true, radiusScale = 1) {
		if (doReset) {
			// We will usually want to reset the canvas before drawing all the orbits
			this.reset();
		}
		
		for (let jd = jdMin; jd < jdMax; jd += jdStep) {
			this.ctx.globalAlpha = ((jd - jdMin) / (jdMax - jdMin));
			this.drawState(jd, 0.0001, false);
		}
		
		this.drawing.ctx.globalAlpha = 1;
		
		// Draw the jdMax as the final point
		this.drawState(jdMax, radiusScale, true);
		
		this.drawing.ctx.globalAlpha = 1;
	}
	
	
	drawWithLines(jdMin = 0, jdMax = 1, jdStep = 0.1, doReset = true, radiusScale = 1) {
		if (doReset) {
			// We will usually want to reset the canvas before drawing all the orbits
			this.reset();
		}
		
		const bodies = this.bodies;
		
		bodies.forEach((ob, index) => {
			let isFirst = true;
			let previousPosition = {};
			for (let jd = jdMin; jd < jdMax; jd += jdStep) {
				this.ctx.globalAlpha = ((jd - jdMin) / (jdMax - jdMin));
				
				ob.JD = jd; // Also sets JD on all the bodies
				const {x, y, z} = ob.equatorialCoordinates;
				const {x: x2d, y: y2d} = to2d(x, y, z, this.perspectiveAngle);
				const {x: xCanvas, y: yCanvas} = this.drawing.toCanvas(x2d, y2d);
				
				if (isFirst) {
					previousPosition = {x: x2d, y: y2d};
					isFirst = false;
				} else {
					this.drawing.line(previousPosition.x, previousPosition.y, x2d, y2d, ob.color, 0.0001);
					previousPosition = {x: x2d, y: y2d};
				}
			}
		});
		
		// Draw the jdMax as the final point
		this.ctx.globalAlpha = 1;
		this.JD = jdMax;
		this.drawState(jdMax, radiusScale, true);
		this.ctx.globalAlpha = 1;
	}
}

export {
	SpaceOrbitViz
}
