class Draw {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		
		this.plotScale = {x: 1, y: 1};
	}
	
	point(x, y, size = 10, color = 'white') {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, size, size);
	}
	
	line(x1, y1, x2, y2, size = 1, color = 'white') {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = size;
		this.ctx.beginPath();
		this.ctx.moveTo(x1, y1);
		this.ctx.lineTo(x2, y2);
		this.ctx.stroke();
	}
	
	text(x, y, content, color = 'white', {fontSize = 16, align = 'start', valign = 'top'} = {}) {
		this.ctx.fillStyle = color;
		this.ctx.font = fontSize + 'px monospace';
		this.ctx.textAlign = align;
		this.ctx.textBaseline = valign;
		this.ctx.fillText(content, x, y);
	}
	
	circle(x, y, r = 1, color = 'white') {
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		// this.ctx.arc(x, y, r, start, end, anticlockwise) ((centered at x,y))
		this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}
	
	/**
	 * Helper function to help me plot data
	 *
	 *
	 *
	 * @since 2021-04-13
	 *
	 * @param {object[]} data          An array of 'objects' of data
	 * @param {string}   xSlug         The key (from the elements of `data`) we will use for the x-axis
	 * @param {string}   ySlug         The key (from the elements of `data`) we will use for the y-axis
	 * @param {string}   color         Optional, default 'black'. The color of the data points
	 * @param {string}   resetCanvas   Optional, default true. Whether to reset and translate the canvas first thing
	 * @param {string}   drawAxes      Optional, default true. Whether to draw the x- and y- axes.
	 * @param {string}   labelAxes     Optional, default true. Whether to label the x- and y- axes with their min/max values
	 * @param {string}   setPlotScale  Optional, default true. Whether to calculate the scaling for the plot. Use false if plotting multiple things against each other
	 * @param {string}   connectPoints Optional, default true. Whether to drawtimes in between each point
	 * @param {string}   timeDelay     Optional, default 0. Delay between drawing each point (if 0, then all points drawn at once)
	 * @param {string}   fadeIn        Optional, default true. Starts at 0 opacity, fades in
	 * @param {object}   range         Optional, default null. Allows a range override, format is {x: {min, max}, y: {min, max}}. When not specified, the range is computed based on the data array
	 */
	plot(data, xSlug, ySlug, color = 'black', {resetCanvas = true, drawAxes = true, labelAxes = true, setPlotScale = true, connectPoints = true, timeDelay = 0, fadeIn = true, range = null} = {}) {
		if (range === null) {
			// compute range ourselves
			range = {
				x: {min: 99999999999999999, max: -9999999999999999},
				y: {min: 99999999999999999, max: -9999999999999999},
			};
			data.forEach((row) => {
				range.x.min = Math.min(range.x.min, row[xSlug]);
				range.x.max = Math.max(range.x.max, row[xSlug]);
				range.y.min = Math.min(range.y.min, row[ySlug]);
				range.y.max = Math.max(range.y.max, row[ySlug]);
			});
		}
		
		if (setPlotScale) {
			this.plotScale = {
				// the `0.9 *` is to account for the gutter
				x: 0.9 * this.canvas.width / (range.x.max - range.x.min),
				y: 0.9 * this.canvas.height / (range.y.max - range.y.min)
			};
		}
		
		if (resetCanvas) {
			this.ctx.restore();
			this.ctx.save();
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.translate(0.05 * this.canvas.width, 0.05 * this.canvas.height); // Add gutter
			const centerTranslation = {
				// Want center of plot, (0.5 * (xMin + xMax), 0.5 * (yMin + yMax)) -> canvas center
				// TODO 2021-04-17: not sure why this isn't working. Going back to basics until it matters.
				// x: this.plotScale.x * (0.5 * (range.x.min + range.x.max)) - (0.5 * 0.9 * this.canvas.width),
				// y: this.plotScale.y * (0.5 * (range.y.min + range.y.max)) + (0.5 * 0.9 * this.canvas.height),
				x: this.plotScale.x * (range.x.min),
				y: this.plotScale.y * (range.y.min)
			};
			this.ctx.translate(-1 * centerTranslation.x, -1 * centerTranslation.y); // Center canvas
			this.ctx.scale(1, -1); // positive y-axis is 'up'
		}
		
		const axisCenter = {
			x: Math.max(0, this.plotScale.x * range.x.min),
			y: Math.max(0, this.plotScale.y * range.y.min),
		};
		
		if (drawAxes) {
			const xAxisColor = (range.y.min <= 0 ? 'black' : 'rgba(40, 0, 0, 0.2)');
			this.line(this.plotScale.x * range.x.min, axisCenter.y, this.plotScale.x * range.x.max, axisCenter.y, 1, xAxisColor); // draw x-axis
			
			const yAxisColor = (range.x.min <= 0 ? 'black' : 'rgba(40, 0, 0, 0.2)');
			this.line(axisCenter.x, this.plotScale.y * range.y.min, axisCenter.x, this.plotScale.y * range.y.max, 1, yAxisColor);  // draw y-axis
			
			// Label what's being plotted
			this.ctx.save();
			this.ctx.scale(1, -1);
			this.text(this.plotScale.x * range.x.min, 0, xSlug === 'index' ? 'time' : xSlug, 'black', {align: 'left', valign: 'bottom'});
			this.text(axisCenter.x - 5, this.plotScale.y * range.y.min, ySlug === 'index' ? 'time' : ySlug, 'black', {align: 'right', valign: 'top'});
			this.ctx.restore();
		}
		
		if (labelAxes) {
			this.ctx.save();
			this.ctx.scale(1, -1);
			this.text(this.plotScale.x * range.x.min, 0, Math.round(range.x.min * 100) / 100, 'black'); // (x, y, content, color = 'white', fontSize = 16, align = 'start', valign = 'top')
			this.text(this.plotScale.x * range.x.max, 0, Math.round(range.x.max * 100) / 100, 'black');
			
			// NOTE: for y-axis, we put the max value at the min range (and vice versa) due to canvas trickery.
			this.text(axisCenter.x, this.plotScale.y * range.y.min, Math.round(range.y.max * 100) / 100, 'black', {valign: 'middle'});
			this.text(axisCenter.x, this.plotScale.y * range.y.max, Math.round(range.y.min * 100) / 100, 'black', {valign: 'middle'});
			
			this.ctx.restore();
		}
		
		// Plot points
		const fadeDelta = data.length > 0 ? 1 / data.length : 1;
		const previousAlpha = this.ctx.globalAlpha;
		data.forEach((row, index) => {
			if (timeDelay < 1) {
				if (fadeIn) {
					this.ctx.globalAlpha = fadeDelta * index;
				}
				
				this.point(row[xSlug] * this.plotScale.x, row[ySlug] * this.plotScale.y, 1, color);
				if (connectPoints && index > 0) {
					this.line(data[index - 1][xSlug] * this.plotScale.x, data[index - 1][ySlug] * this.plotScale.y, data[index][xSlug] * this.plotScale.x, data[index][ySlug] * this.plotScale.y, 1, color);
				}
				
				if (fadeIn) {
					this.ctx.globalAlpha = previousAlpha; // reset alpha
				}
			} else {
				setTimeout(() => {
					if (fadeIn) {
						this.ctx.globalAlpha = fadeDelta * index;
					}
					this.point(row[xSlug] * this.plotScale.x, row[ySlug] * this.plotScale.y, 1, color);
					if (connectPoints && index > 0) {
						this.line(data[index - 1][xSlug] * this.plotScale.x, data[index - 1][ySlug] * this.plotScale.y, data[index][xSlug] * this.plotScale.x, data[index][ySlug] * this.plotScale.y, 1, color);
					}
					if (fadeIn) {
						this.ctx.globalAlpha = previousAlpha; // reset alpha
					}
				}, index * timeDelay);
			}
		});
	}
};
