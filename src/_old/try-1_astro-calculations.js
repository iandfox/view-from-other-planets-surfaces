console.clear();

const sun = {
	N(d) { return 0},
	i(d) { return 0},
	w(d) { return 282.9404 + 4.70935e-5 * d },
	a: 1, // 1 AU
	e(d) { return 0.016709 - 1.151e-9 * d },
	M(d) { return 356.047 + 0.9856002585 * d }
};

const moon = {
	N(d) { return 125.1228 - 0.0529538083 * d },
	i(d) {return 5.1454 },
	w(d) { return 318.0634 + 0.1643573223 * d },
	a: 60.26666, // Earth radii
	e(d) { return 0.054900 },
	M(d) { return 115.3654 + 13.0649929509 * d }
};


const tucsonInfo = {
	lat: 32.198840114469995,
	lng: -111.01908142663117,
	UT: -7
};


const getTimescaleDay = (year, month, day) => 367*year - 7 * (year + (month + 9)/12)/4 - 3 * ((year + (month - 9)/7)/100 + 1)/4 + 275 * month/9 + day - 730515;


// Another quantity we will need is ecl, the obliquity of the ecliptic, i.e. the "tilt" of the Earth's axis of rotation (currently 23.4 degrees and slowly decreasing). First, compute the "d" of the moment of interest (section 3). Then, compute the obliquity of the ecliptic:
const ecl = (d) => 23.4393 - 3.563e-7 * d;


function distanceAndTrueAnomaly(d, M, e, a) {
	let Ed = M + (e * Math.sin(M) * (1 + e * Math.cos(M)));
	if (e > 0.06) {
		let E0 = Ed;
		let E1 = null;
		let sanity = 0;
		while (++sanity < 1000 && (E1 === null || Math.abs(E1 - E0) < 1.74532925e-5)) { // 0.001 degrees = 1.74532925e-5 rad
			E1 = E0 - (E0 - e * Math.sin(E0) - M) / (1 - e * Math.cos(E0));
		}
		Ed = E1;
	}
	
	const xv = a * (Math.cos(Ed) - e);
	const yv = a * (Math.sqrt(1 - e * e) * Math.sin(Ed));
	
	const v = Math.atan2(yv, xv);
	const r = Math.sqrt(xv * xv + yv * yv);
	
	return {v, r};
}


function planetPosition(r, N, v, w, i) {
	const out = {
		x: r * (Math.cos(N) * Math.cos(v + w) - Math.sin(N) * Math.sin(v + w) * Math.cos(i)),
		y: r * (Math.sin(N) * Math.cos(v + w) + Math.cos(N) * Math.sin(v + w) * Math.cos(i)),
		z: r * (Math.sin(v + w) * Math.sin(i)),
	};
	out.lng = Math.atan2(out.y, out.x); // eclipticLongitude
	out.lat  = Math.atan2(out.z, Math.sqrt(out.x * out.x + out.y * out.y)); // eclipticLatitude
	return out;
}


/**
 *
 * @return {number} (in degrees!)
 */
function siderealTime(M, w, localLongitude, UT) {
	const Ls = M + w; // sun's mean longitude
	const GMST0 = (Ls) / 15 + 12; // in Hours
	const GMST = GMST0 + UT; // in Hours
	const LST = GMST + localLongitude / 15;
	return LST;
}


/*
 * this is ONLY for moons, not for planets. planets need a calculation for the sun's
 * position, as well.
 */
function geocentricCoordinates(r, eclipticLongitude, eclipticLatitude) {
	return {
		x: r * Math.cos(eclipticLongitude) * Math.cos(eclipticLatitude),
		y: r * Math.sin(eclipticLongitude) * Math.cos(eclipticLatitude),
		z: r * Math.sin(eclipticLatitude)
	};
}


/**
 * Takes geocentric coords -> equatorial coords
 */
function equatorialCoordinates(xg, yg, zg, ecl) {
	const xe = xg;
	const ye = yg * Math.cos(ecl) - zg * Math.sin(ecl);
	const ze = yg * Math.sin(ecl) + zg * Math.cos(ecl);
	const RA = Math.atan2(ye, xe); // Right Ascension
	const Decl = Math.atan2(ze, Math.sqrt(xe * xe + ye * ye)); // declination
	const rg = Math.sqrt(xe * xe + ye * ye + ze * ze); // geocentric distance
	return {xe, ye, ze, RA, Decl, rg};
}


/**
 * notes for future ian:
 *     - azimuth:  0 at North, 90deg at East, 180deg at South, 270deg at West
 *     - altitude: 0 at 'mathematical' horizon, 90deg at zenith, negative below horizon
 *     -
 */
function azimuthalCoordinates(LST, RA, Decl, localLatitude, isLstInRadians = false) {
	if (! isLstInRadians) {
		LST = LST * Math.PI / 180;
	}
	const HA = LST - RA; // Hour Angle. Usually given in interval -12 to +12 hours, or -180 to 180 degrees. HA negative => object is east of south; HA positive => object is west of south. If outside the interval, add or subtract 24 hours / 360 degrees to correct.
	const out = {
		x: Math.cos(HA) * Math.cos(Decl),
		y: Math.sin(HA) * Math.cos(Decl),
		z: Math.sin(Decl),
		xhor: null,
		yhor: null,
		zhor: null,
		az: null,
		alt: null,
	};
	out.xhor = out.x * Math.sin(localLatitude) - out.z * Math.cos(localLatitude);
	out.yhor = out.y;
	out.zhor = out.x * Math.cos(localLatitude) + out.z * Math.sin(localLatitude);
	
	out.az = Math.atan2(out.yhor, out.xhor) + Math.PI;
	out.alt = Math.atan2(out.zhor, Math.sqrt(out.xhor * out.xhor + out.yhor * out.yhor));
	return out;
}


/**
 * ALL args (except `d` and `a`) are functions with 1 arg: d.
 */
function getDataForDay(d, name, N, i, w, a, e, M, ecl, localLat, localLng, localUT) {
	let datum = {
		d: d,
		name: name,
		xh: null,
		yh: null,
		zh: null,
		lat: null,
		lng: null,
		LST: null,
		xg: null,
		yg: null,
		zg: null,
		xe: null,
		ye: null,
		ze: null,
		RA: null,
		Decl: null,
		rg: null,
		x: null,
		y: null,
		z: null,
		xhor: null,
		yhor: null,
		zhor: null,
		az: null,
		alt: null
	};
	const Md = M(d);
	const ed = e(d);
	const Nd = N(d);
	const wd = w(d);
	const id = i(d);
	
	const {v, r} = distanceAndTrueAnomaly(d, Md, ed, a);
	
	const pos = planetPosition(r, Nd, v, wd, id);
	datum.xh = pos.x; datum.yh = pos.y; datum.zh = pos.z; datum.lat = pos.lat; datum.lng = pos.lng;
	
	datum.LST = siderealTime(Md, wd, localLng, localUT);
	
	const geo = geocentricCoordinates(r, datum.lng, datum.lat);
	datum.xg = geo.x; datum.yg = geo.y; datum.zg = geo.z;
	
	const equa = equatorialCoordinates(datum.xg, datum.yg, datum.zg, ecl(d));
	datum.xe = equa.xe; datum.ye = equa.ye; datum.ze = equa.ze;
	datum.RA = equa.RA; datum.Decl = equa.Decl; datum.rg = equa.rg;
	
	// azimuthalCoordinates(LST, RA, Decl, localLatitude, inRadians = false
	const azi = azimuthalCoordinates(datum.LST, datum.RA, datum.Decl, localLat)
	datum.x = azi.x; datum.y = azi.y; datum.z = azi.z;
	datum.xhor = azi.xhor; datum.yhor = azi.yhor; datum.zhor = azi.zhor;
	datum.az = azi.az; datum.alt = azi.alt;
	
	return datum;
}

/*
///
/// calculate.
///
const dayStart = 0;
const dayEnd = 365 * 1;
const dayDelta = 0.01;
let data = [];
// data.push(['d', 'name', 'xh', 'yh', 'zh', 'lat', 'lng', 'LST', 'xg', 'yg', 'zg', 'xe', 'ye', 'ze', 'RA', 'Decl', 'rg', 'x', 'y', 'z', 'xhor', 'yhor', 'zhor', 'az', 'alt']);
for (let d = dayStart; d <= dayEnd; d += dayDelta) {
	data.push(getDataForDay(d, 'moon', moon.N, moon.i, moon.w, moon.a, moon.e, moon.M, ecl, tucsonInfo.lat, tucsonInfo.lng, tucsonInfo.UT));
}
*/



///
/// Draw
///
class Draw {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
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
	
	text(x, y, content, color = 'white', fontSize = 16, align = 'start', valign = 'top') {
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
};


const drawStuff = (
	data,
	xSlug,
	ySlug,
	canvasId,
	drawAxes = true,
	xAxisMin = 0,
	xAxisMax = null,
	yAxisMin = 0,
	yAxisMax = null
) => {
	// find min/max
	let xMax = 0;
	let xMin = 99999999999999999999;
	let yMax = 0;
	let yMin = 99999999999999999999;
	data.forEach((datum) => {
		xMax = Math.max(xMax, datum[xSlug]);
		xMin = Math.min(xMin, datum[xSlug]);
		yMax = Math.max(yMax, datum[ySlug]);
		yMin = Math.min(yMin, datum[ySlug]);
	});
	const totalWidth = xMax - xMin;
	const totalHeight = yMax - yMin;
	
	const d = new Draw(canvasId);
	const xScl = 0.9 * (d.canvas.width / totalWidth);
	const yScl = 0.9 * (d.canvas.height / totalHeight);
	
	d.text(0, 0, `x-axis: ${xSlug} ε [${Math.floor(xMin * 100) / 100}, ${Math.floor(xMax * 100) / 100}]`);
	d.text(0, 16, `y-axis: ${ySlug} ε [${Math.floor(yMin * 100) / 100}, ${Math.floor(yMax * 100) / 100}]`);
	
	d.ctx.translate(
		0.05 * d.canvas.width,
		0.05 * d.canvas.height
	);
	d.ctx.translate(
		xScl * (0 - xMin),
		yScl * (0 - yMin)
	);
	d.point(0, 0, 10, 'white');
	d.point(50, -50, 10, 'red');
	d.point(50, 50, 10, 'green');
	d.point(-50, 50, 10, 'blue');
	d.point(-50, -50, 10, 'orange');
	
	if (drawAxes) {
		if (xAxisMax === null) { xAxisMax = xMax; }
		if (yAxisMax === null) { yAxisMax = yMax; }
		// x-axis:
		d.line(0, 0, xScl * xAxisMax, 0, 1, 'purple');
		// x-axis:
		d.line(0, 0, 0, yScl * yAxisMax, 1, 'purple');
	}
	
	data.forEach((datum, index) => {
		setTimeout(() => {
			d.point(xScl * datum[xSlug], yScl * datum[ySlug], 1, datum.name == 'sun' ? 'yellow' : 'grey');
		}, index);
	});
};

// drawStuff(data, 'lat', 'lng', 'eclipticLatLng');
// drawStuff(data, 'xe', 'ye', 'equatorial');
// drawStuff(data, 'az', 'alt', 'azimuthal');



///
/// Vue:
///
Vue.filter('formatNumber', (num) => {
	return Math.floor(num * 100) / 100;
});
/*new Vue({
	el: '#app',
	data: {
		config: {
			dayStart: 0,
			dayEnd: 2,
			dayDelta: 0.2,
		},
		data: [],
	},
	
	mounted() {
		this.data = data.slice(0, 10);
	},
});*/





///
/// okay new stuff. interactive sky
///
let skyScale = {
	x: 1,
	y: 1
};
const DAYZERO = () => moment('2000-01-01 00:00:00.000+00:00');
const resetSky = () => {
	let sky = new Draw('sky');
	sky.ctx.restore();
	sky.ctx.save();
	sky.ctx.clearRect(0, 0, sky.canvas.width, sky.canvas.height);
	
	// we know the max range of alt and az
	let xMax = 2 * Math.PI;
	let xMin = 0;
	let yMax = Math.PI / 2;
	let yMin = -1 * Math.PI / 2;
	const totalWidth = xMax - xMin;
	const totalHeight = yMax - yMin;
	skyScale.x = 0.9 * (sky.canvas.width / totalWidth);
	skyScale.y = 0.9 * (sky.canvas.height / totalHeight);
	
	sky.ctx.translate(
		0.05 * sky.canvas.width,
		0.05 * sky.canvas.height
	);
	sky.ctx.translate(
		skyScale.x * (0 - xMin),
		skyScale.y * (0 - yMin)
	);
	sky.ctx.scale(1, -1);
	sky.line(0, 0, skyScale.x * xMax, 0, 1, 'purple'); // x-axis
	sky.line(0, skyScale.y * yMin, 0, skyScale.y * yMax, 1, 'purple'); // y-axis
	
	// Labels!
	sky.ctx.save();
	sky.ctx.scale(1, -1);
	// altitude only really interesting at horizon and directly up
	sky.text(0.95 * sky.canvas.width, 0, 'Horizon', 'lightblue', 13, 'end', 'middle');
	// Label azimuth from 0deg=north, then 90deg=east, etc
	sky.text(0, 0, 'N', 'lightblue', 16, 'center', 'top');
	sky.text(0.5 * Math.PI * skyScale.x, 0, 'E', 'lightblue', 16, 'center', 'top');
	sky.text(1 * Math.PI * skyScale.x, 0, 'S', 'lightblue', 16, 'center', 'top');
	sky.text(1.5 * Math.PI * skyScale.x, 0, 'W', 'lightblue', 16, 'center', 'top');
	
	sky.ctx.restore();
};

const _numberFormatter = new Intl.NumberFormat('en-US', {
	signDisplay: 'always',
	minimumIntegerDigits: 1,
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const formatNumber = (num) => {
	return _numberFormatter.format(num);
};


let isDrawing = false;
const drawSky = (
	day,
	bodies,
	planetInfo = {
		lat: 32.198840114469995 * Math.PI / 180,
		lng: -111.01908142663117 * Math.PI / 180,
		UT: -7
	}
) => {
	if (isDrawing) {
		console.warn('skipped drawing for day #' + day);
		return;
	}
	isDrawing = true;
	
	const sky = new Draw('sky');
	
	// clear the text area
	sky.ctx.save();
	sky.ctx.scale(1, -1);
	sky.ctx.clearRect(0, -0.5 * sky.canvas.height, sky.canvas.width, 16 * bodies.length);
	sky.ctx.restore();
	
	bodies.forEach((b, index) => {
		const datum = getDataForDay(day, b.name, b.N, b.i, b.w, b.a, b.e, b.M, ecl, planetInfo.lat, planetInfo.lng, planetInfo.UT);
		sky.circle(skyScale.x * datum.az, skyScale.y * datum.alt, 4, b.dynamicColor ? b.dynamicColor(day) : b.color);
		
		// Draw text of current position
		sky.ctx.save();
		sky.ctx.scale(1, -1);
		sky.text(0, -0.5 * sky.canvas.height + 16 * index, `${b.name}: (${formatNumber(datum.az).padStart(5, ' ')}, ${formatNumber(datum.alt).padStart(5, ' ')})) = (${formatNumber(datum.az * 180 / Math.PI).padStart(6, ' ')}°, ${formatNumber(datum.alt * 180 / Math.PI).padStart(6, ' ')}°)`);
		sky.ctx.restore();
	});
	
	isDrawing = false;
};


const resetGeo = () => {
	const geo = new Draw('geocentric');
	geo.ctx.restore();
	geo.ctx.save();
	geo.ctx.translate(0.5 * geo.canvas.width, 0.5 * geo.canvas.height);
	geo.ctx.scale(1, -1);
};
const drawGeocentric = (day, bodies) => {
	const planetRadius = 10;
	const scl = 1;
	const geo = new Draw('geocentric');
	geo.ctx.clearRect(-1 * geo.canvas.width, -1 * geo.canvas.height, 2 * geo.canvas.width, 2 * geo.canvas.height);
	geo.circle(0, 0, 1 * planetRadius, 'blue');
	bodies.forEach((b, index) => {
		const datum = getDataForDay(day, b.name, b.N, b.i, b.w, b.a, b.e, b.M, ecl, 0, 0, 0);
		geo.circle(scl * datum.yg, scl * datum.zg, 4, b.color);
	});
};


new Vue({
	el: '#app',
	data: {
		dayBase: 7672,
		hour: 18,
		autoAdvance: true,
		autoSpeed: 0.5,
		autoDraw: true,
		
		isDirty: true,
		
		bodies: [
			{
				name: 'Moon',
				color: '#aaa',
				dynamicColor(d) {
					d = (Math.floor(d * 100000)).toString().padStart(6, '0'); // get a 9 digit number
					return `#${parseInt(d.substring(0, 2)).toString(16)}${parseInt(d.substring(3, 5)).toString(16)}${parseInt(d.substring(6, 8)).toString(16)}`; // to hex
				},
				N(d) { return 125.1228 - 0.0529538083 * d },
				i(d) { return 5.1454 },
				w(d) { return 318.0634 + 0.1643573223 * d },
				a: 60.26666, // Earth radii
				e(d) { return 0.054900 },
				M(d) { return 115.3654 + 13.0649929509 * d }
			}
		],
	},
	
	
	watch: {
		dayBase() { this.isDirty = true },
		hour()    { this.isDirty = true },
	},
	
	
	computed: {
		day() {
			return this.dayBase + (this.hour + 7) / 24; // `+ 7` so the slider at "4.5" means "4:30am tucson time"
		},
		dateTime() {
			return DAYZERO().add(this.day * 24, 'hours').format();
		},
	},
	
	
	methods: {
		reset() {
			resetSky();
			resetGeo();
		},
		
		drawInstant() {
			if (this.isDirty) {
				drawSky(this.day, this.bodies);
				
				drawGeocentric(this.day, this.bodies);
				this.isDirty = false;
			}
		},
		
		drawFullDay() {
			this.hour = 0;
			for (let h = 0; h < 24; h += 0.1) {
				this.hour = h;
				drawSky(this.day, this.bodies);
			}
		},
		
		loop() {
			const self = this;
			if (this.autoAdvance) {
				this.hour += (this.autoSpeed / 24);
				if (this.hour >= 24) {
					this.dayBase += 1;
					this.hour -= 24;
				}
			}
			
			if (this.autoDraw) {
				this.drawInstant();
			}
			
			requestAnimationFrame(() => {
				self.loop();
			});
		},
	},
	
	mounted() {
		this.reset();
		this.drawInstant();
		
		this.loop();
	},
});


/*
<div style="">
	<canvas id="sky" width="800" height="400"></canvas>
	<br>
	<canvas id="geocentric" width="500" height="500"></canvas>
</div>

<div class="form">
	<div class="stretched aligned fields">
		<div style="grid-column: 1 / span 2">Day # {{day | formatNumber}}
			<br>
			{{dateTime}}
		</div>
		<div style="grid-column: 1 / span 2">isDirty: {{isDirty}}</div>
		
		<div style="grid-column: 1 / span 2">TODO: Advance time by BLAH days (hint: 1 hour = 0.xx days) over the next BLAH seconds</div>
		
		<label>Autospeed</label>
		<div class="input" style="min-height: 35px;">
			<label style="user-select: none;"><input type="checkbox" v-model="autoAdvance"> Auto-advance time</label>
			<span>at:</span> <input type="number" min="0" max="1000" v-model="autoSpeed"> <span>speed (in days)</span>
		</div>
		
		<label>Autodraw</label>
		<div class="checkbox">
			<label><input type="checkbox" v-model="autoDraw"> Automatically draw</label>
		</div>
		
		<label>Day</label>
		<div class="input">
			<span style="min-width: 7ch;">{{dayBase}}</span>
			<input type="number" min="0" max="20000" v-model.number="dayBase">
		</div>
		<label>Day</label>
		<div class="input">
			<span style="min-width: 7ch;">{{dayBase | formatNumber}}</span>
			<input type="range" min="0" max="20000" v-model.number="dayBase">
		</div>
		<label>+ Hour</label>
		<div class="input">
			<span style="min-width: 7ch;">{{hour | formatNumber}}</span>
			<input type="range" min="0" max="24" step="0.01" v-model.number="hour">
		</div>
		<div class="action">
			<button type="button" class="info" @click="drawInstant" :disabled="autoDraw">Draw</button>
			
			<button type="button" class="info" @click="drawFullDay" :disabled="autoDraw">Draw Full Day</button>
		</div>
		<div class="action">
			<button type="button" class="warning" @click="reset">Reset</button>
		</div>
	</div>
</div>
</section>


<!--
<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr))">
	<div style="margin: 13px;">
		<h3>Ecliptic Lat/Lng:</h3>
		<canvas id="eclipticLatLng" width="500" height="500"></canvas>
	</div>
	
	<div style="margin: 13px;">
		<h3>Equatorial (xe, ye) [omits ze]:</h3>
		<canvas id="equatorial" width="500" height="500"></canvas>
	</div>
	
	
	<div style="margin: 13px;">
		<h3>Azimuthal (az, alt):</h3>
		<canvas id="azimuthal" width="500" height="500"></canvas>
	</div>
</div>
-->


<!--
<div id="app_previous" style="display: none;">
	<table style="color: white;">
		<thead>
			<tr>
				<th rowspan="2" valign="bottom">day</th>
				<th colspan="2">space position</th>
				<th rowspan="2">LST</th>
				<th>Geocentric coords</th>
				<th colspan="2">equatorial coords</th>
				<th colspan="3">azimuthal coords</th>
			</tr>
			<tr>
				<th>(xh, yh, zh)</th>
				<th>
					<small><em>ecliptic lat lng</em></small>
					<br>
					(lat, lng)
				</th>
				
				<th>(xg, yg, zg)</th>
				
				<th>(xe, ye, ze)</th>
				<th>(RA, Decl, rg)</th>
				
				<th>(x, y, z)</th>
				<th>(xhor, yhor, zhor)</th>
				<th>(az, alt)</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="datum in data">
				<td>{{datum.d | formatNumber}}</td>
				<td>({{datum.xh | formatNumber}}, {{datum.yh | formatNumber}}, {{datum.zh | formatNumber}})</td>
				<td>({{datum.lat | formatNumber}}, {{datum.lng | formatNumber}})</td>
				<td>{{datum.LST | formatNumber}}</td>
				<td>({{datum.xg | formatNumber}}, {{datum.yg | formatNumber}}, {{datum.zg | formatNumber}})</td>
				<td>({{datum.xe | formatNumber}}, {{datum.ye | formatNumber}}, {{datum.ze | formatNumber}})</td>
				<td>({{datum.RA | formatNumber}}, {{datum.Decl | formatNumber}}, {{datum.rg | formatNumber}})</td>
				<td>({{datum.x | formatNumber}}, {{datum.y | formatNumber}}, {{datum.z | formatNumber}})</td>
				<td>({{datum.xhor | formatNumber}}, {{datum.yhor | formatNumber}}, {{datum.zhor | formatNumber}})</td>
				<td>({{datum.az | formatNumber}}, {{datum.alt | formatNumber}})</td>
			</tr>
		</tbody>
	</table>
</div>
-->
 */
