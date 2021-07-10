const DAYZERO = () => moment('2000-01-01 00:00:00.000+00:00');
class StarDraw {
	/**
	 * @since 2021-03-24
	 *
	 * @param {object} bodiesInfo = [{name, color, size, N(d), i(d), w(d), a, e(d), M(d)}, ...] // TODO 2021-03-24: param and implementation of `image`
	 * @param {object} observationPoint = {lat,	lng, UT}
	 * @param {object[]} drawings = [{canvasId, xSlug, ySlug, zSlug = null, xMin, xMax, yMin, yMax, label = [canvasId], draw = null, scale = {x: null, y: null}}, ...]
	 * @param {number} positionHistoryLength The # of positions to keep in history
	 * @param {bool} fadePositionHistory Default true. Whether to progressively fade the position history when drawing them.
	 */
	constructor(bodiesInfo, observationPoint, drawings, positionHistoryLength = 10, fadePositionHistory = true) {
		this.bodiesInfo = bodiesInfo;
		this.observationPoint = observationPoint;
		
		this.drawings = drawings;
		
		this.positionHistoryLength = positionHistoryLength;
		this.fadePositionHistory = fadePositionHistory;
		
		this.ecl = (d) => 23.4393 - 3.563e-7 * d;
		this.positionsHistory = {};
		this.positions = {};
		this.currentDay = -1;
		
		this.resetPositions();
		
		this.setupDrawings();
	}
	
	
	/**
	 * Resets positions to nothing, and sets up null/empty values for each bodyInfo.name as an object key.
	 *
	 * @since 2021-03-24
	 */
	resetPositions() {
		this.positionsHistory = {};
		this.positions = {};
		this.currentDay = -1;
		this.bodiesInfo.forEach((bodyInfo) => {
			this.positionsHistory[bodyInfo.name] = [];
			this.positions[bodyInfo.name] = null;
		});
	}
	
	
	/**
	 * Initial setup of drawings
	 *
	 * @since 2021-03-24
	 */
	setupDrawings() {
		this.drawings.forEach((drawing) => {
			// Possibly create a new canvas
			if (! document.getElementById(drawing.canvasId)) {
				// requires a `#canvases` wrapper
				const container = document.getElementById('canvases');
				if (container) {
					const newCanvas = document.createElement('canvas');
					newCanvas.id = drawing.canvasId;
					newCanvas.width  = 500;
					newCanvas.height = 500;
					container.appendChild(newCanvas);
				} else {
					throw 'StarDraw could not create canvas. unable to find wrapper #canvases';
				}
			}
			
			
			drawing.label = drawing.label ?? drawing.canvasId;
			drawing.draw  = drawing.draw  ?? new Draw(drawing.canvasId);
			drawing.scale = drawing.scale ?? {x: 0.9 * drawing.draw.canvas.width / (drawing.xMax - drawing.xMin), y: 0.9 * drawing.draw.canvas.height / (drawing.yMax - drawing.yMin)}; // the `0.9 *` is to account for the gutter
			drawing.zSlug = drawing.zSlug ?? null;
		});
		
		this.resetDrawings();
	}
	
	
	/**
	 * Resets (i.e. clears and centers canvases. draws axes.)
	 *
	 * TODO 2021-03-24: add extra `draw` and `label` callbacks so we can e.g. draw earth in center and label axes/canvas/etc
	 *
	 * @since 2021-03-24
	 */
	resetDrawings() {
		this.drawings.forEach((drawing) => {
			drawing.draw.ctx.restore();
			drawing.draw.ctx.save();
			drawing.draw.ctx.clearRect(0, 0, drawing.draw.canvas.width, drawing.draw.canvas.height);
			drawing.draw.ctx.translate(0.05 * drawing.draw.canvas.width, 0.05 * drawing.draw.canvas.height);        // Add gutter
			drawing.draw.ctx.translate(drawing.scale.x * (0 - drawing.xMin), drawing.scale.y * (0 - drawing.yMin)); // Center canvas
			
			drawing.draw.ctx.scale(1, -1); // positive y-axis is 'up'
			drawing.draw.line(drawing.scale.x * drawing.xMin, 0, drawing.scale.x * drawing.xMax, 0, 1, 'purple'); // draw x-axis
			drawing.draw.line(0, drawing.scale.y * drawing.yMin, 0, drawing.scale.y * drawing.yMax, 1, 'purple');  // draw y-axis
			
			// TODO 2021-03-24: maybe a callback for "extra drawing function" so i can e.g. draw the earth in the middle
			
			// TODO 2021-03-24: maybe a callback for "labels function" so i can e.g. draw this:
			
			/*
			// Labels!
			drawing.draw.ctx.save();
			drawing.draw.ctx.scale(1, -1);
			// altitude only really interesting at horizon and directly up
			drawing.draw.text(0.95 * drawing.draw.canvas.width, 0, 'Horizon', 'lightblue', 13, 'end', 'middle');
			// Label azimuth from 0deg=north, then 90deg=east, etc
			drawing.draw.text(0, 0, 'N', 'lightblue', 16, 'center', 'top');
			drawing.draw.text(0.5 * Math.PI * skyScale.x, 0, 'E', 'lightblue', 16, 'center', 'top');
			drawing.draw.text(1 * Math.PI * skyScale.x, 0, 'S', 'lightblue', 16, 'center', 'top');
			drawing.draw.text(1.5 * Math.PI * skyScale.x, 0, 'W', 'lightblue', 16, 'center', 'top');
			drawing.draw.ctx.restore();
			*/
		});
	}
	
	
	/**
	 * Draw existing postion(s) and position(s)History(ies)
	 *
	 * @since 2021-03-24
	 */
	draw() {
		// TODO 2021-03-24: should there be a flag like "resetDrawingEachTick" (or something), perhaps 'globally' or per-drawing?
		// TODO 2021-03-24: add in a couple optional callbacks for "calculateX" and "calculateY" so that I can do a projected 3d drawing.
		this.bodiesInfo.forEach((bodyInfo, bodyInfoIndex) => {
			const name = bodyInfo.name;
			this.drawings.forEach((drawing) => {
				const getCanvasCoords = (positionObject) => {
					if (! drawing.zSlug) {
						// 2d drawing
						return {
							x: positionObject[drawing.xSlug] * drawing.scale.x,
							y: positionObject[drawing.ySlug] * drawing.scale.y
						};
					} else {
						// 3d drawing
						// using: https://en.wikipedia.org/wiki/3D_projection
						const a = {
							x: positionObject[drawing.xSlug],
							y: positionObject[drawing.ySlug],
							z: positionObject[drawing.zSlug]
						};
						const theta = {
							x: 0 * Math.PI / 180,
							y: 0 * Math.PI / 180,
							z: 45 * Math.PI / 180
						};
						// position of camera
						const c = {
							x: 0,
							y: 0,
							z: -10,
						};
						// display surface's position relative to C
						const e = {
							x: 0,
							y: 0,
							z: 10
						};
						
						const [xx, yy, zz, cx, cy, cz, sx, sy, sz] = [a.x - c.x, a.y - c.y, a.z - c.z, Math.cos(theta.x), Math.cos(theta.y), Math.cos(theta.z), Math.sin(theta.x), Math.sin(theta.y), Math.sin(theta.z)];
						const d = {
							x: cy * (sz * yy + cz * xx) - sy * zz,
							y: sx * (cy * zz + sy * (sz * yy + cz * xx)) + cx * (cz * yy - sz * xx),
							z: cx * (cy * zz + sy * (sz * yy + cz * xx)) - sx * (cz * yy - sz * xx)
						};
						return {
							x: (d.x * e.z / d.z + e.x) * drawing.scale.x,
							y: (d.y * e.z / d.z + e.y) * drawing.scale.y
						};
					}
				};
				if (this.positions[name] !== null) {
					const c = getCanvasCoords(this.positions[name]);
					drawing.draw.circle(
						// this.positions[name][drawing.xSlug] * drawing.scale.x,
						// this.positions[name][drawing.ySlug] * drawing.scale.y,
						c.x, c.y,
						bodyInfo.size,
						bodyInfo.color
					);
				}
				
				if (this.positionHistoryLength > 0 && this.positionsHistory[name]) {
					this.positionsHistory[name].forEach((pos, positionsHistoryIndex) => {
						if (this.fadePositionHistory) {
							drawing.draw.ctx.globalAlpha = 1 - (positionsHistoryIndex / this.positionHistoryLength);
						}
						const c = getCanvasCoords(pos);
						drawing.draw.circle(
							c.x,
							c.y,
							bodyInfo.size,
							bodyInfo.color
						);
					});
					
					// Reset alpha
					drawing.draw.ctx.globalAlpha = 1;
				}
				
				// Draw text of current position
				if (this.positions[name] !== null) {
					// TODO 2021-03-24: add flag for shouldLabel or something
					const savedTransformState = drawing.draw.ctx.getTransform();
					drawing.draw.ctx.setTransform(1, 0, 0, 1, 0, 0); // Set transform to identity matrix
					drawing.draw.text(
						0,
						0 + 16 * bodyInfoIndex,
						`${name.padStart(5, ' ')}: (${formatNumber(this.positions[name][drawing.xSlug]).padStart(5, ' ')}, ${formatNumber(this.positions[name][drawing.ySlug]).padStart(5, ' ')}${drawing.zSlug ? ', ' + formatNumber(this.positions[name][drawing.zSlug]).padStart(5, ' ') : ''})` + (bodyInfoIndex === 0 ? ` = (${drawing.xSlug}, ${drawing.ySlug}${drawing.zSlug ? ', ' + drawing.zSlug : ''})` : '')
					);
					// re-apply the transform
					drawing.draw.ctx.setTransform(savedTransformState);
				}
			});
		});
		
		// Show the current datetime
		this.drawings.forEach((drawing) => {
			// TODO 2021-03-24: add flag for shouldLabel or something
			const savedTransformState = drawing.draw.ctx.getTransform();
			drawing.draw.ctx.setTransform(1, 0, 0, 1, 0, 0); // Set transform to identity matrix
			drawing.draw.text(
				0,
				0 + 16 * this.bodiesInfo.length,
				`${('Date').padStart(5, ' ')}: ${DAYZERO().add(this.currentDay * 24 * 60, 'minutes').format('YYYY-MM-DD hh:mm:ss a')}`
			);
			// re-apply the transform
			drawing.draw.ctx.setTransform(savedTransformState);
		});
	}
	
	
	/**
	 * Add positions for each body and push 'old' position(s) to position(s)History(ies), as applicable
	 *
	 * @since 2021-03-24
	 */
	addPositions(day) {
		this.currentDay = day;
		
		this.bodiesInfo.forEach((bodyInfo) => {
			const name = bodyInfo.name;
			// Add 'old' positions to positionHistory
			if (this.positions[name] !== null && this.positionHistoryLength > 0) {
				this.positionsHistory[name].unshift(this.positions[name]);
				if (this.positionsHistory[name].length > this.positionHistoryLength) {
					this.positionsHistory[name].pop();
				}
			}
			
			this.positions[name] = getDataForDay(day, bodyInfo.name, bodyInfo.N, bodyInfo.i, bodyInfo.w, bodyInfo.a, bodyInfo.e, bodyInfo.M, this.ecl, this.observationPoint.lat, this.observationPoint.lng, this.observationPoint.UT, bodyInfo.isGeocentric);
		});
	}
	
	
	
	///
	/// "Ian is forgetful" methods
	///
	/// @since 2021-03-24
	///
	resetPosition()  { this.resetPositions();   console.warn('Hey Ian! You called `resetPosition` instead of its plural form!'); }
	setupDrawing()   { this.setupDrawings();    console.warn('Hey Ian! You called `setupDrawing` instead of its plural form!'); }
	resetDrawing()   { this.resetDrawings();    console.warn('Hey Ian! You called `resetDrawing` instead of its plural form!'); }
	addPosition(day) { this.addPositions(day);  console.warn('Hey Ian! You called `addPosition` instead of its plural form!'); }
}
