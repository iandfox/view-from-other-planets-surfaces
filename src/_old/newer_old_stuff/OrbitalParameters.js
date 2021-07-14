/**
 * note on
 * @type {{a: number, e(*): *, w(*): *, i(*): number, M(*): *, isGeocentric: boolean, N(*): number}}
 */


// lecture notes https://www.faa.gov/about/office_org/headquarters_offices/avs/offices/aam/cami/library/online_libraries/aerospace_medicine/tutorial/media/III.4.1.4_Describing_Orbits.pdf

const sun_try1 = {
	N(d) { return 0 },
	i(d) { return 0 },
	w(d) { return 282.9404 + 4.70935e-5 * d },
	//a: 1, // <-- 1 AU = 1.495978707e8 km
	a: 23455.2948730009, // in Earth radii. 1 earth radius = 6738 km. 1 AU = 1.495978707e8 km.
	// a: 1.495978707e8, // in km
	e(d) { return 0.016709 - 1.151e-9 * d },
	M(d) { return 356.047 + 0.9856002585 * d },
	isGeocentric: false
};
const TO_DEG = 180 / Math.PI;
const TO_RAD = Math.PI / 180;

const sun2_try1 = {
	N(d) { return 0 },
	i(d) { return 0 },
	w(d) { return 282.9404 * TO_RAD + 4.70935e-5 * d },
	// a: 1, // <-- 1 AU = 1.495978707e8 km
	a: 23455.2948730009, // in Earth radii. 1 earth radius = 6738 km. 1 AU = 1.495978707e8 km.
	// a: 1.495978707e8, // in km
	e(d) { return 0.016709 - 1.151e-9 * d },
	M(d) { return 356.047 * TO_RAD + 0.9856002585 * d },
	isGeocentric: false
};

const moon_try1 = {
	N(d) { return 125.1228 - 0.0529538083 * d },
	i(d) { return 5.1454 },
	w(d) { return 318.0634 + 0.1643573223 * d },
	a: 60.2696770147, // Earth radii. 1 earth radius = 6738 km. dist to moon = 384,400 km. (2021-03-24: value changed from source data to wikipedia's value)
	// a: 384400, // in km
	e(d) { return 0.054900 },
	M(d) { return 115.3654 + 13.0649929509 * d },
	isGeocentric: true
};


const tucsonInfo = {
	lat: 32.198840114469995,
	lng: -111.01908142663117,
	UT: -7
};






///
///  try 3
///
// {
// 	name: 'Earth (emBary)',
// 		color: 'blue',
// 	// size: 3,
// 	semimajorAxis: [1.00000261, 0.00000562],
// 	eccentricity: [0.01671123, -0.00004392],
// 	inclination: [-0.00001531, -0.01294668],
// 	meanLongitude: [100.46457166, 35999.37244981],
// 	longitudeOfPeriapsis: [102.93768193, 0.32327364],
// 	longitudeOfTheAscendingNode: [0, 0],
// },
// {
// 	name: 'Mars',
// 		color: 'red',
// 	// size: 3,
// 	semimajorAxis: [1.52371243, 0.00000097],
// 	eccentricity: [0.09336511, 0.00009149],
// 	inclination: [1.85181869, -0.00724757],
// 	meanLongitude: [-4.56813164, 19140.29934243],
// 	longitudeOfPeriapsis: [-23.91744784, 0.45223625],
// 	longitudeOfTheAscendingNode: [49.71320984, -0.26852431],
// },


/*
https://ssd.jpl.nasa.gov/?sat_elem#legend
Common Table Column Headings:
	a	Semi-major Axis (mean value)
	e	Eccentricity (mean value)
	w	Argument of periapsis (mean value)
	M	Mean anomaly (mean value)
	i	Inclination with respect to the reference plane: ecliptic, ICRF, or local Laplace (mean value)
	node	Longitude of the ascending node (mean value) measured from the node of the reference plane on the ICRF equator
	n	Longitude rate (mean value)
	P	Sidereal period (mean value)
	Pw	Argument of periapsis precession period (mean value)
	Pnode	Longitude of the ascending node precession period (mean value)
	
	Moon
		a (km) = 384400
		e () = 0.0554
		w (deg) = 318.15
		M (deg) = 135.27
		i (deg) = 5.16
		node (deg) = 125.08
		n (deg/day) = 13.176358
		P (days) = 27.322
		Pw (yr) = 5.997
		Pnode (yr) = 18.600
*/
const MoonParameters = {
	name: 'Moon',
	color: 'grey',
	semimajorAxis: [1, 0], // actually 384400 / 1.496e8 but for debug i put it at 1 AU // TODO 2021-04-22
	eccentricity: [0.0554, 0],
	inclination: [5.16, 0],
	
	longitudeOfTheAscendingNode: [125.08, (13.176358 * 100 * 365.25 * 24 * 60 * 60 * 1000)],
	
	_argumentOfPeriapsis: [318.15, (5.997 * 100 * 365.25 * 24 * 60 * 60 * 1000)], // i think? (for the rate of change... might be wrong variable from NASA data)
	_meanAnomaly: [135.27, 0],
	longitudeOfPeriapsis: [318.15 + 125.08, (5.997 * 100 * 365.25 * 24 * 60 * 60 * 1000) + (13.176358 * 100 * 365.25 * 24 * 60 * 60 * 1000)], // longitudeOfPeriapsis = argumentOfPeriapsis + longitudeOfTheAscendingNode
	meanLongitude: [135.27 + 318.15 + 125.08, 0 + (13.176358 * 100 * 365.25 * 24 * 60 * 60 * 1000) + (5.997 * 100 * 365.25 * 24 * 60 * 60 * 1000)], // meanLongitude = meanAnomaly + longitudeOfPeriapsis
};
/*
N	=	longitude of the ascending node
i	=	inclination to the ecliptic (plane of the Earth's orbit)
w	=	argument of perihelion
a	=	semi-major axis, or mean distance from Sun
e	=	eccentricity (0=circle, 0-1=ellipse, 1=parabola)
M	=	mean anomaly (0 at perihelion; increases uniformly with time)
Related orbital elements are:
w1	=	N + w	=	longitude of perihelion
L	=	M + w1	=	mean longitude
q	=	a*(1-e)	=	perihelion distance
Q	=	a*(1+e)	=	aphelion distance
P	=	a ^ 1.5	=	orbital period (years if a is in AU, astronomical units)
T	=	Epoch_of_M - (M(deg)/360_deg) / P	=	time of perihelion
v		=	true anomaly (angle between position and perihelion)
E		=	eccentric anomaly
const moon = {
	longitude of the ascending node	N(d) { return 125.1228 - 0.0529538083 * d },
	i(d) { return 5.1454 },
	argument of perihelion          w(d) { return 318.0634 + 0.1643573223 * d },
	a: 60.2696770147, // Earth radii. 1 earth radius = 6738 km. dist to moon = 384,400 km. (2021-03-24: value changed from source data to wikipedia's value)
	// a: 384400, // in km
	e(d) { return 0.054900 },
	M(d) { return 115.3654 + 13.0649929509 * d },
	isGeocentric: true
};
*/


/*
alt values, from http://www.met.rdg.ac.uk/~ross/Astronomy/Planets.html
*/

// {
// 	name: 'Earth (alt)',
// 		color: 'green',
// 	// size: 3,
// 	semimajorAxis: [1.00000011, -0.00000005	/ 3600],
// 	eccentricity: [0.01671022, -0.00003804 / 3600],
// 	inclination: [0.00005, -46.94 / 3600],
// 	meanLongitude: [100.46435, 129597740.63 / 3600],
// 	longitudeOfPeriapsis: [102.94719, 1198.28 / 3600],
// 	longitudeOfTheAscendingNode: [-11.26064, -18228.25 / 3600],
// },


export {
	MoonParameters
}
