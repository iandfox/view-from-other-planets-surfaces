/**
 * Some drawing methods.
 */

class Drawing {
	constructor(canvas, origin_canvas = {x: 0, y: 0}, viewport = {left: -1000, right: 1000, bottom: -1000, top: 1000}) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.origin_canvas = origin_canvas;
		this.viewport = viewport;
	}
	
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
			ctx.textBaseline = 'bottom';
			ctx.textAlign = 'center';
			ctx.fillText(label, x, y - halfLength);
		} else {
			this.line(x_s - halfLength_s, y_s, x_s + halfLength_s, y_s, color, lineWidth, canvas, ctx);
			ctx.textBaseline = 'middle';
			ctx.textAlign = 'left';
			ctx.fillText(label, x + 1.5 * halfLength, y);
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
	 * @param {object} viewport
	 * @return {{x: number, y: number}}
	 */
	toCanvas(x_s, y_s, canvas = this.canvas, ctx = this.ctx, viewport = this.viewport) {
		const hor = viewport.right - viewport.left,
			ver = viewport.top - viewport.bottom;
		if (hor === 0 || ver === 0) {
			console.warn('Bad viewport given. Sending (0, 0)');
			return {x: 0, y: 0};
		}
		
		const scl_x = (x_s - viewport.left) / hor,
			scl_y = (y_s - viewport.bottom) / ver;
		return {
			x: scl_x * this.canvas.width,// - this.origin_canvas.x ,
			y: (1 - scl_y) * this.canvas.height// - this.origin_canvas.y
		}
	}
}

export {
	Drawing
}
