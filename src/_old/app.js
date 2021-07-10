import StarDraw3d from './stardraw-3d.js';

const DAYZERO = () => moment('2000-01-01 00:00:00.000+00:00');

const _numberFormatter = new Intl.NumberFormat('en-US', {
	signDisplay: 'always',
	minimumIntegerDigits: 1,
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
const formatNumber = (num) => {
	return _numberFormatter.format(num);
};
window.formatNumber = formatNumber;
Vue.filter('formatNumber', (num) => {
	return Math.floor(num * 100) / 100;
});

new Vue({
	el: '#app',
	
	/**
	 * @since 2021-03-24 StarDraw technique
	 * @since 2021-03-18
	 */
	data: {
		dayBase: 7751,
		hour: 18,
		autoAdvance: true,
		autoSpeed: 0.5,
		autoDraw: true,
		
		isDirty: true,
		
		starDraws: [], // populated in method `setupStarDraws()`
	},
	
	
	/**
	 * @since 2021-03-18
	 */
	watch: {
		dayBase() { this.isDirty = true },
		hour()    { this.isDirty = true },
	},
	
	
	/**
	 * @since 2021-03-18
	 */
	computed: {
		day() {
			return this.dayBase + (this.hour + 7) / 24; // `+ 7` so the slider at "4.5" means "4:30am tucson time"
		},
		dateTime() {
			return DAYZERO().add(this.day * 24, 'hours').format();
		},
	},
	
	
	methods: {
		/**
		 * @since 2021-03-24
		 */
		setupStarDraws() {
			this.starDraws = [];
			
			const bodiesInfo = [
				{
					name: 'moon', color: 'grey', size: 2,
					N: moon.N, i: moon.i, w: moon.w, a: moon.a, e: moon.e, M: moon.M,
					isGeocentric: moon.isGeocentric
				},
				{
					name: 'sun', color: 'yellow', size: 2,
					N: sun.N, i: sun.i, w: sun.w, a: sun.a, e: sun.e, M: sun.M,
					isGeocentric: sun.isGeocentric
				}
			];
			
			const observationPoint = {
				lat: 32.198840114469995  * Math.PI / 180,
				lng: -111.01908142663117 * Math.PI / 180,
				UT:  -7
			};
			
			this.starDraws.push(
				new StarDraw(bodiesInfo, observationPoint,
					// drawings:
					[
						{
							canvasId: 'sky', xSlug: 'az', ySlug: 'alt',
							xMin: 0, xMax: 2 * Math.PI,
							yMin: -1 * Math.PI / 2, yMax: Math.PI / 2
						}
						/*,
						{
							canvasId: 'azimuthal', xSlug: 'x', ySlug: 'y',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						},
						{
							canvasId: 'azimuthal2', xSlug: 'x', ySlug: 'z',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						},
						{
							canvasId: 'azimuthal3', xSlug: 'y', ySlug: 'z',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						},
						{
							// TODO -- in progress.
							canvasId: 'azimuthal3d', xSlug: 'x', ySlug: 'y', zSlug: 'z',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						},
						{
							canvasId: 'heliocentric', xSlug: 'xh', ySlug: 'yh',
							xMin: -150, xMax: 150,
							yMin: -150, yMax: 150,
						},
						{
							canvasId: 'geocentric', xSlug: 'xg', ySlug: 'yg',
							xMin: -100, xMax: 100,
							yMin: -100, yMax: 100,
						},
						{
							canvasId: 'geocentric2', xSlug: 'yg', ySlug: 'zg',
							xMin: -2e5, xMax: 2e5,
							yMin: -2e5, yMax: 2e5,
						},
						{
							canvasId: 'eclipticLngLat', xSlug: 'lng', ySlug: 'lat',
							xMin: -1 * Math.PI, xMax: 1 * Math.PI,
							yMin: -1 * Math.PI, yMax: 1 * Math.PI,
						},
						{
							canvasId: 'equatorial', xSlug: 'xe', ySlug: 'ye',
							xMin: -100, xMax: 100,
							yMin: -100, yMax: 100,
						},
						{
							canvasId: 'azimuthal', xSlug: 'x', ySlug: 'y',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						},
						{
							canvasId: 'azimuthal2', xSlug: 'x', ySlug: 'z',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						},
						{
							canvasId: 'azimuthal_hor', xSlug: 'xhor', ySlug: 'yhor',
							xMin: -1, xMax: 1,
							yMin: -1, yMax: 1,
						}*/
					],
					30, // positionHistoryLength
					true // fadePositionHistory
				)
			);
			
			this.starDraws.push(new StarDraw3d(
				bodiesInfo,
				observationPoint,
				{x: 'x', y: 'y', z: 'z'},
				{x: 30, y: 30, z: 30}, // position scaling
				'euclidean', // positionType: 'euclidean' or 'spherical' (in which case, xyz->r, phi (up), theta (around))
				500, // positionHistoryLength
				true // fadePositionHistory
			));
		},
		
		
		/**
		 * @since 2021-03-24 StarDraw technique
		 * @since 2021-03-18
		 */
		reset() {
			this.starDraws.forEach((starDraw) => {
				starDraw.resetPositions();
				starDraw.resetDrawings();
			});
		},
		
		
		/**
		 * @since 2021-03-24 StarDraw technique
		 * @since 2021-03-18
		 */
		drawInstant() {
			if (this.isDirty) {
				this.starDraws.forEach((starDraw) => {
					// TODO 2021-03-24: perhaps this belongs in `StarDraw` class?
					starDraw.resetDrawings(); // redraw axes, position histories, etc.
					
					
					starDraw.draw();
				});
				this.isDirty = false;
			}
		},
		
		/**
		 * @since 2021-03-xx TODO: StarDraw technique
		 * @since 2021-03-18
		 */
		drawFullDay() {
			this.hour = 0;
			for (let h = 0; h < 24; h += 0.1) {
				this.hour = h;
				// TODO 2021-03-24: implement this for new StarDraw technique
				// drawSky(this.day, this.bodies);
			}
		},
		
		
		/**
		 * @since 2021-03-24 StarDraw technique
		 * @since 2021-03-18
		 */
		loop() {
			const self = this;
			if (this.autoAdvance) {
				this.hour += (this.autoSpeed / 24);
				if (this.hour >= 24) {
					this.dayBase += 1;
					this.hour -= 24;
				}
				this.starDraws.forEach((starDraw) => {
					starDraw.addPositions(this.day);
				});
			} else if (this.isDirty) {
				// Add current day to starDraws' positions
				this.starDraws.forEach((starDraw) => {
					starDraw.addPositions(this.day);
				});
			}
			
			if (this.autoDraw) {
				this.drawInstant();
			}
			
			requestAnimationFrame(() => {
				self.loop();
			});
		},
	},
	
	
	/**
	 * @since 2021-03-24 StarDraw technique
	 * @since 2021-03-18
	 */
	mounted() {
		this.setupStarDraws();
		this.drawInstant();
		
		this.loop();
	},
});
