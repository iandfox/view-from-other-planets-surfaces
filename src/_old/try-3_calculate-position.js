/**
 * Trying out a brand new approach, since the previous one didn't work.
 *
 * Sources:
 *     Question - https://space.stackexchange.com/questions/21458/is-this-c-code-to-obtain-the-coordinates-of-the-planets-correct/
 *     Code - https://pastebin.com/ydse66XY
 *     Keplerian Elements for Planets - https://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf
 *
 * @since 2021-04-13
 */

/*
Data from NASA:
    a : semi-major axis [au, au/century]
    e : eccentricity    [ , /century]
    i : [I] inclination     [deg, deg/century]
    L : mean longitude  [deg, deg/century]
    p : [omega] longitude of perihelion [deg, deg/century]
    W : [Omega] longitude of the ascending node [deg, deg/century]
	
	"EM Bary":
	1.00000018, -0.00000003
	0.01673163, -0.00003661
	-0.00054346, -0.01337178
	100.46691572, 35999.37306329
	102.93005885, 0.31795260
	-5.11260389, -0.24123856
	
	Mars:
	1.52371243, 0.00000097
	0.09336511, 0.00009149
	1.85181869, -0.00724757
	-4.56813164, 19140.29934243
	-23.91744784, 0.45223625
	49.71320984, -0.26852431
*/



/**
 *
 * @since 2021-04-01
 *
 * @param {number[]} millisecondFromJ2000 array: [initial value, delta per-century]
 * @param {number} semimajorAxis
 * @param {number} eccentricity
 * @param {number} inclination
 * @param {number} meanLongitude
 * @param {number} longitudeOfPeriapsis
 * @param {number} longitudeOfTheAscendingNode
 *
 * @return {object} {
 * 		x_helio, y_helio, z_helio,
 * 		x_ecl, y_ecl, z_ecl,
 * 		x_eq, y_eq, z_eq,
 * 		x: x_eq, y: y_eq, z: z_eq,
 * 		v, r,
 * 		ecl_lng, ecl_lat,
 * 		RA, Decl, r_geo,
 * 		LST_deg, LST
 * 	}
 */
function computePositionAtDate(millisecondFromJ2000, semimajorAxis, eccentricity, inclination, meanLongitude, longitudeOfPeriapsis, longitudeOfTheAscendingNode) {
	const TWO_PI = 2 * Math.PI;
	const ONE_AU = 149597870700; // 1 AU defined as 149,597,870,700 meters
	const DEG_TO_RAD = Math.PI / 180;
	const tolerance = 1e-6;
	const centuriesFromJ2000 = millisecondFromJ2000 / (1000 * 60 * 60 * 24 * 365.25 * 100);
	const t = centuriesFromJ2000;
	const a = semimajorAxis[0] + semimajorAxis[1] * t;
	const e = eccentricity[0] + eccentricity[1] * t;
	const i_deg = inclination[0] + inclination[1] * t;
	const L_deg = (((meanLongitude[0] + meanLongitude[1] * t) % 360) + 360) % 360; // always in interval [0, 360) // NOTE there was some (likely false) speculation that it must be in (-180, 180]
	const p_deg = longitudeOfPeriapsis[0] + longitudeOfPeriapsis[1] * t;
	const W_deg = longitudeOfTheAscendingNode[0] + longitudeOfTheAscendingNode[1] * t;
	
	
	const w_deg = p_deg - W_deg; // argument of the perihelion
	const M_deg = L_deg - p_deg; // mean anomaly
	
	const w = w_deg * DEG_TO_RAD;
	const M = M_deg * DEG_TO_RAD;
	const i = i_deg * DEG_TO_RAD;
	const L = L_deg * DEG_TO_RAD;
	const p = p_deg * DEG_TO_RAD;
	const W = W_deg * DEG_TO_RAD;
	
	
	const e_deg = e * 180 / Math.PI; // only used for kepler's equation. (according to the NASA pdf)
	
	// altered to match NASA pdf rather than c# code:
	let E_deg = M_deg + e_deg * Math.sin(M);
	let sanity = 0;
	while (true && ++sanity < 1000) {
		const dM = M_deg - (E_deg - e_deg * Math.sin(E_deg * DEG_TO_RAD));
		const dE = dM / (1 - e * Math.cos(E_deg * DEG_TO_RAD));
		E_deg += dE;
		if (Math.abs(dE) < tolerance) {
			break;
		}
	}
	
	const E = E_deg * DEG_TO_RAD;
	
	///
	/// Following along with NASA pdf instead of the pre-done code from stackexchange
	///
	
	// heliocentric coordinates, r_prime, in orbital plane with x'-axis aligned from the focus to the perihelion:
	// NOTE TO SELF: NASA PDF calls this `r_prime = (x_prime, y_prime, z_prime)` (specifically, `r' = (x', y', z')`) but I want to use `_helio` instead
	x_helio = a * (Math.cos(E) - e);
	y_helio = a * Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E);
	z_helio = 0;
	
	// ecliptic coordinates, r_ecl, in the J2000 ecliptic plane, with the x-axis aligned toward the equinox:
	x_ecl = x_helio * (Math.cos(w) * Math.cos(W) - Math.sin(w) * Math.sin(W) * Math.cos(i)) + y_helio * (-1 * Math.sin(w) * Math.cos(W) - Math.cos(w) * Math.sin(W) * Math.cos(i));
	y_ecl = x_helio * (Math.cos(w) * Math.sin(W) + Math.sin(w) * Math.cos(W) * Math.cos(i)) + y_helio * (-1 * Math.sin(w) * Math.sin(W) + Math.cos(w) * Math.cos(W) * Math.cos(i));
	z_ecl = x_helio * (Math.sin(w) * Math.sin(i)) + y_helio * (Math.cos(w) * Math.sin(i));
	
	// equatorial coordinates, r_eq in the "ICRF," or "J2000 frame"
	const obliquity_deg = 23.43928; // obliquity, epsilon, at J2000
	const obliquity = obliquity_deg * DEG_TO_RAD; // from other calculations style: const ecl = (d) => 23.4393 - 3.563e-7 * d; // this is very small and likely doesn't matter.
	x_eq = x_ecl;
	y_eq = Math.cos(obliquity) * y_ecl - Math.sin(obliquity) * z_ecl;
	z_eq = Math.sin(obliquity) * y_ecl - Math.cos(obliquity) * z_ecl;
	
	
	///
	/// Filling in more values
	///     https://en.wikipedia.org/wiki/True_anomaly
	///
	// const v = Math.atan2(Math.cos(E) - e, Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E)); // True anomaly
	// const r = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(v)); // radius
	// note on 2021-04-22: the above, from wikipedia, seems blatantly wrong? r is unchanging?? Instead I will import the ones from astro-calculations.js
	// const xv = a * (Math.cos(E) - e);
	// const yv = a * (Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E));
	
	const v = Math.atan2(a * (Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E)), a * (Math.cos(E) - e)); // NOTE 2021-04-22: the inputs here seem to just be x_helio and y_helio. not using that, yet, cause i might be wrong on it :shrug:
	const r = Math.sqrt(Math.pow(a * (Math.cos(E) - e), 2) + Math.pow(a * (Math.sqrt(1 - Math.pow(e, 2)) * Math.sin(E)), 2));
	
	const ecl_lng = Math.atan2(y_helio, x_helio); // eclipticLongitude
	const ecl_lat  = Math.atan2(z_helio, Math.sqrt(Math.pow(x_helio, 2) + Math.pow(y_helio, 2))); // eclipticLatitude
	
	const RA = Math.atan2(y_eq, x_eq); // Right Ascension
	const Decl = Math.atan2(z_eq, Math.sqrt(Math.pow(x_eq, 2) + Math.pow(y_eq, 2))); // declination
	const r_geo = Math.sqrt(Math.pow(x_eq, 2) + Math.pow(y_eq, 2) + Math.pow(z_eq, 2)); // geocentric distance
	
	// Sidereal Time
	const tucsonInfo = {
		lat: 32.198840114469995,
		lng: -111.01908142663117,
		UT: -7
	};
	const Ls_deg = (M_deg + w_deg) % 360; // sun's mean longitude  // NOTE 2021-04-22: added the `% 360` cause the LST was getting ridic in size
	const GMST0 = (Ls_deg) / 15 + 12; // in Hours
	const GMST = GMST0 + tucsonInfo.UT; // in Hours
	const LST_deg = GMST + tucsonInfo.lng / 15;
	const LST = LST_deg * DEG_TO_RAD;
	
	
	// NOTE and TODO 2021-04-17: as it stands this won't work for planets, cause we'd also need to offset by sun's position to get the geocentric position of the planets. should be fine for the sun and for moons though.
	/**
	 * notes for future ian:
	 *     - azimuth:  0 at North, 90deg at East, 180deg at South, 270deg at West
	 *     - altitude: 0 at 'mathematical' horizon, 90deg at zenith, negative below horizon
	 *     -
	 */
		
		
		
		// Azimuthal coords:
	let HA = (LST - RA) / DEG_TO_RAD; // hour angle
	while (HA < -180) { HA += 360; } // ensure HA is between -180 and 180
	while (HA >  180) { HA -= 360; }
	HA *= DEG_TO_RAD;
	
	const x_something = Math.cos(HA) * Math.cos(Decl);
	const y_something = Math.sin(HA) * Math.cos(Decl);
	const z_something = Math.sin(Decl);
	const lat_rad = tucsonInfo.lat * DEG_TO_RAD;
	const x_hor = x_something * Math.sin(lat_rad) - z_something * Math.cos(lat_rad);
	const y_hor = y_something;
	const z_hor = x_something * Math.cos(lat_rad) + z_something * Math.sin(lat_rad);
	
	const az = Math.atan2(y_hor, x_hor) + Math.PI;
	const alt = Math.atan2(z_hor, Math.sqrt(Math.pow(x_hor, 2) + Math.pow(y_hor, 2)));
	
	
	
	
	return {
		x_helio, y_helio, z_helio,
		x_ecl, y_ecl, z_ecl,
		x_eq, y_eq, z_eq,
		x: x_eq, y: y_eq, z: z_eq,
		v, r,
		ecl_lng, ecl_lat,
		RA, Decl, r_geo,
		LST_deg, LST,
		
		
		// TODO: ellie is crying so future ian: check these.
		x_hor, y_hor, z_hor,
		az, alt
	};
}
