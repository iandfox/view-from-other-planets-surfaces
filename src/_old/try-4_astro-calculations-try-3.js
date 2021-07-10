/**
 * Trying this a third time (ugh), this time from the book Astronomical Algorithms. Chapter 25 is Solar Coordinates, chapter 24 is maybe related, chapter 45 is the moon.
 *
 * No, not chapter 45. chapter 49 gives phases of the moon, though.
 *
 * this article suggested the book: https://celestrak.com/columns/v03n03/
 *
 * @since 2021-04-23
 */


/**
 * Calculate Julian Day from year-month-date. From chapter 7 of book
 *
 * @since 2021-04-23
 *
 * @param {number} Y the year
 * @param {number} M the month number, where January = 1
 * @param {number} D the day of the month, with decimals if any
 *
 * @return {number}
 */
function getJulianDay(Y, M, D) {
	if (M <= 2) {
		Y -= 1;
		M += 12;
	}
	const A = Math.trunc(Y / 100);
	const B = 2 - A + Math.trunc(A / 4);
	return Math.trunc(365.25 * (Y + 4716)) + Math.trunc(30.6001 * (M + 1)) + D + B - 1524.5;
}

class SolarCoordinates {
	
	constructor(JD) {
		this.DEG_TO_RAD = Math.PI / 180;
		this.RAD_TO_DEG = 180 / Math.PI;
		
		this.JD = JD;
	}
	
	
	/**
	 * Julian centuries of 36525 ephemeris days from the epoch J2000.0 (2000 January 1.5 TD)
	 *
	 * @since 2021-04-23
	 */
	get T() {
		return (this.JD - 2451545) / 36525;
	}
	
	
	/**
	 * The geometric mean longitude of the Sun, referred to the mean equinox of the date
	 *
	 * @since 2021-04-23
	 */
	get L0_deg() {
		return (280.46646 + 36000.76983 * this.T + 0.0003032 * Math.pow(this.T, 2)) % 360;
	}
	
	
	/**
	 * Mean anomaly of the Sun. (This is the same as the mean anomaly of the Earth.)
	 *
	 * @since 2021-04-23
	 */
	get M_deg() {
		return (357.52911 + 35999.05029 * this.T + 0.0001537 * Math.pow(this.T, 2)) % 360;
	}
	
	
	/**
	 * Eccentricity of the Earth's orbit
	 *
	 * @since 2021-04-23
	 */
	get e() {
		return 0.016708634 - 0.000042037 * this.T - 0.0000001267 * Math.pow(this.T, 2);
	}
	
	
	/**
	 * Sun's equation of center
	 *
	 * @since 2021-04-23
	 */
	get C_deg() {
		return (
			       (1.914602 - 0.004817 * this.T - 0.000014 * Math.pow(this.T, 2)) * Math.sin(this.M_deg * this.DEG_TO_RAD)
			       + (0.019993 - 0.000101 * this.T) * Math.sin(2 * this.M_deg * this.DEG_TO_RAD)
			       + (0.000289) * Math.sin(3 * this.M_deg * this.DEG_TO_RAD)) % 360;
	}
	
	
	/**
	 * Sun's true longitude, Lambda. aka "true geometric longitude referred to the mean equinox of the date."
	 * "This is the quantity required for instance in the calculation of geocentric planetary positions"
	 *
	 * @since 2021-04-23
	 */
	get L_deg() {
		return (this.L0_deg + this.C_deg) % 360;
	}
	
	
	/**
	 * Sun's true anomaly
	 *
	 * @since 2021-04-23
	 */
	get v_deg() {
		return (this.M_deg + this.C_deg) % 360;
	}
	
	
	/**
	 * Sun's radius vector -- the distance between the centers of the Sun and the Earth, expressed in astronomical units
	 *
	 * @since 2021-04-23
	 */
	get R() {
		return (1.000001018 * (1 - Math.pow(this.e, 2))) / (1 + this.e * Math.cos(this.v_deg * this.DEG_TO_RAD));
	}
	
	
	/**
	 * the apparent longitude, lambda, of the sun, referred to the true equinox of the date.
	 *
	 * @since 2021-04-23
	 */
	get l_deg() {
		const Omega_deg = 125.04 - 1934.136 * this.T;
		return (this.L_deg - 0.00569 - 0.00478 * Math.sin(Omega_deg * this.DEG_TO_RAD)) % 360;
	}
	
	
	/**
	 * The obliquity, epsilon, of the ecliptic, or inclination of the Earth's axis of rotation, is the angle between the equator and the ecliptic
	 *
	 * @since 2021-04-23
	 */
	get ecl_deg() {
		return (23.43929111111111 - 0.013004166666666666 * this.T - 1.638888888888889e-7
		        * Math.pow(this.T, 2) + 5.036111111111111e-7 * Math.pow(this.T, 3)) % 360;
	}
	
	
	/**
	 * Sun's right ascension, alpha.
	 *
	 * (Sun's latitude is small enough (never exceeds 1.2 arcseconds) that it can be put equal to zero, unless high accuracy is required)
	 *
	 * @since 2021-04-23
	 */
	get RA() {
		return Math.atan2(Math.cos(this.ecl_deg * this.DEG_TO_RAD) * Math.sin(this.L_deg * this.DEG_TO_RAD), Math.cos(this.L_deg * this.DEG_TO_RAD));
	}
	
	
	/**
	 * Sun's declination, delta.
	 *
	 * @since 2021-04-23
	 */
	get Decl() {
		return Math.asin(Math.sin(this.ecl_deg * this.DEG_TO_RAD) * Math.sin(this.L_deg * this.DEG_TO_RAD));
	}
	
	
	/**
	 * "apparent" position of sun :shrug:
	 *
	 * @since 2021-04-23
	 */
	get RA_apparent() {
		const Omega_deg = 125.04 - 1934.136 * this.T;
		const epsilon_deg = this.ecl_deg + 0.00256 * Math.cos(Omega_deg * this.DEG_TO_RAD);
		return Math.atan2(Math.cos(epsilon_deg * this.DEG_TO_RAD) * Math.sin(this.l_deg * this.DEG_TO_RAD), Math.cos(this.l_deg * this.DEG_TO_RAD));
	}
	
	
	/**
	 * "apparent" position of sun :shrug:
	 *
	 * @since 2021-04-23
	 */
	get Decl_apparent() {
		const Omega_deg = 125.04 - 1934.136 * this.T;
		const epsilon_deg = this.ecl_deg + 0.00256 * Math.cos(Omega_deg * this.DEG_TO_RAD);
		return Math.asin(Math.sin(epsilon_deg * this.DEG_TO_RAD) * Math.sin(this.l_deg * this.DEG_TO_RAD));
	}
	
	
	/**
	 * @since 2021-04-23
	 */
	get RA_deg() {
		return (this.RA * this.RAD_TO_DEG) % 360;
	}
	
	
	/**
	 * @since 2021-04-23
	 */
	get Decl_deg() {
		return (this.Decl * this.RAD_TO_DEG) % 360;
	}
}
