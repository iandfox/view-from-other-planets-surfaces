/**
 * ChartDrawer
 *     A drawing class helper (as in, drawing) for a chart.
 *
 * @since 2021-07-12
 */

class ChartDrawer {
	
	constructor(canvas, chart, x_values, y_values, jd_values) {
		this.canvas = canvas;
		this.chart = chart;
		this.x_values = x_values;
		this.y_values = y_values;
		this.jd_values = jd_values;
		
		
		/// these are filled in within methods, but i need them here for intellisense.
		this.range = {x: 0, y: 0};
		this.axes = {x: {start: {x: 0, y: 0}, end: {x: 0, y: 0}}, y: {start: {x: 0, y: 0}, end: {x: 0, y: 0}}};
		
		this.ctx = this.canvas.getContext('2d');
		
		this.cached = null;
		
		// Store `this.range.x` and `this.range.y`
		this.calculateRanges();
		
		// Store `this.axes`
		this.calculateAxes();
		
		this.numberFormatter = new Intl.NumberFormat(
			'en-US',
			{
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}
		);
	}
	
	
	calculateRanges() {
		const range_x = {min: Math.min(...this.x_values), max: Math.max(...this.x_values), length: null};
		range_x.length = range_x.max - range_x.min;
		
		const range_y = {min: Math.min(...this.y_values), max: Math.max(...this.y_values), length: null};
		// for degrees-based stuff, i want to see between 0 and 360 in the y-axis.
		if (this.chart.y.indexOf('_deg') !== -1) {
			range_y.min = Math.min(range_y.min, 0);
			range_y.max = Math.max(range_x.max, 360);
		}
		range_y.length = range_y.max - range_y.min;
		
		this.range = {
			x: range_x,
			y: range_y,
		};
		
		return {range_x, range_y};
	}
	
	
	calculateAxes() {
		const isXAxisInMiddle = (this.range.y.min < 0 && this.range.y.max > 0);
		const isYAxisInMiddle = (this.range.x.min < 0 && this.range.x.max > 0);
		this.axes = {
			x: {
				start: this.toCanvasCoordinates(this.range.x.min, isXAxisInMiddle ? 0 : this.range.y.min),
				end: this.toCanvasCoordinates(this.range.x.max, isXAxisInMiddle ? 0 : this.range.y.min)
			},
			y: {
				start: this.toCanvasCoordinates(isYAxisInMiddle ? 0 : this.range.x.min, this.range.y.min),
				end: this.toCanvasCoordinates(isYAxisInMiddle ? 0 : this.range.x.min, this.range.y.max)
			}
		};
	}
	
	
	toCanvasCoordinates(x, y) {
		const scl_x = (x - this.range.x.min) / this.range.x.length;
		const scl_y = (y - this.range.y.min) / this.range.y.length;
		return {
			x: scl_x * this.canvas.width,
			y: (1 - scl_y) * this.canvas.height
		}
	}
	
	
	getClosestJDCoords(JD) {
		// price is right rules: closest value without going over.
		for (let i = 0; i < this.jd_values.length; i++) {
			if (this.jd_values[i].JD > JD) {
				// Return the one just before
				return this.jd_values[Math.max(0, i - 1)];
			}
		}
		
		// Fallback.
		return this.jd_values[0];
	}
	
	
	plotPoint(x, y, radius = 10) {
		const canvasCoords = this.toCanvasCoordinates(x, y);
		this.ctx.beginPath();
		this.ctx.arc(canvasCoords.x, canvasCoords.y, radius, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}
	
	
	plotAllPoints(radius = 10, colorFunction = (index) => 'red') {
		for (let i = 0; i < this.x_values.length; i++) {
			this.ctx.fillStyle = colorFunction(i);
			this.plotPoint(this.x_values[i], this.y_values[i], radius);
		}
	}
	
	plotAllPointsDelayed(radius = 10, delay = 2, colorFunction = (index) => 'red', onFinished = () => {}) {
		for (let i = 0; i < this.x_values.length; i++) {
			setTimeout(() => {
				this.ctx.fillStyle = colorFunction(i);
				this.plotPoint(this.x_values[i], this.y_values[i], radius);
				
				if (i === this.x_values.length - 1) {
					onFinished();
				}
			}, i * delay);
		}
	}
	
	
	clearCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	
	cacheCanvas() {
		this.cached = this.ctx.toDataURL('image/webp'); // image/webp only in chrome.
	}
	
	drawCached() {
		if (this.cached) {
			this.ctx.drawImage(0, 0, this.cached);
		}
	}
	
	
	drawAxes() {
		// Draw axes, which will reside behind the points
		this.ctx.lineWidth = 10;
		this.ctx.beginPath();
		// x-axis:
		this.ctx.moveTo(this.axes.x.start.x, this.axes.x.start.y);
		this.ctx.lineTo(this.axes.x.end.x, this.axes.x.end.y);
		// y-axis:
		this.ctx.moveTo(this.axes.y.start.x, this.axes.y.start.y);
		this.ctx.lineTo(this.axes.y.end.x, this.axes.y.end.y);
		this.ctx.stroke();
	}
	
	
	drawAxisLabels() {
		this.ctx.fillStyle = 'purple';
		this.ctx.font = '50px serif';
		
		this.ctx.textAlign = 'left';
		this.ctx.textBaseline = 'bottom';
		this.ctx.fillText(`(${this.formatNumber(this.range.x.min)}, ${this.formatNumber(this.range.y.min)})`, 0, this.canvas.height); // bottom left
		this.ctx.textAlign = 'left';
		this.ctx.textBaseline = 'top';
		this.ctx.fillText(`(${this.formatNumber(this.range.x.min)}, ${this.formatNumber(this.range.y.max)})`, 0, 0); // top left
		this.ctx.textAlign = 'right';
		this.ctx.textBaseline = 'top';
		this.ctx.fillText(`(${this.formatNumber(this.range.x.max)}, ${this.formatNumber(this.range.y.max)})`, this.canvas.width, 0); // top right
		this.ctx.textAlign = 'right';
		this.ctx.textBaseline = 'bottom';
		this.ctx.fillText(`(${this.formatNumber(this.range.x.max)}, ${this.formatNumber(this.range.y.min)})`, this.canvas.width, this.canvas.height); // bottom right
	}
	
	
	formatNumber(num) {
		return this.numberFormatter.format(num);
	}
}

export {
	ChartDrawer
}
