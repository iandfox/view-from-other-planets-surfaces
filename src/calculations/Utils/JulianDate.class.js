/**
 * JulianDate
 *     Helper class to format, add, etc julian dates
 *
 * @since 2021-07-14
 */

class JulianDate {
	constructor(JD = 0, UT_hours = -7) {
		this.JD = JD;
		this.UT_hours = UT_hours;
		
		const numberFormat = new Intl.NumberFormat(
			'en-US',
			{
				useGrouping: false,
				minimumIntegerDigits: 2,
				minimumFractionDigits: 0,
				maximumFractionDigits: 0,
			}
		);
		this.format = (num) => numberFormat.format(num);
	}
	
	get pretty() {
		// TODO
		// for now i'll just return iso
		return this.iso;
	}
	
	get parts() {
		// See https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
		const Q = this.JD + 0.5;
		const Z = Math.trunc(Q);
		const W = Math.trunc((Z - 1867216.25) / 36524.25);
		const X = Math.trunc(W / 4);
		const A = Z + 1 + W - X;
		const B = A + 1524;
		const C = Math.trunc((B - 122.1) / 365.25);
		const D = Math.trunc(365.25 * C);
		const E = Math.trunc((B - D) / 30.6001);
		const F = Math.trunc(30.6001 * E);
		
		const dayOfMonth = B - D - F + (Q - Z);
		const month = (E - 1 <= 12 ? E - 1 : E - 13); // "(must get number less than or equal to 12)"
		const year = (month <= 2 ? C - 4715 : C - 4716); // "year = C - 4715 : (if Month is January or February) or C-4716 (otherwise)"
		
		
		let fractionalPart = Q % 1; // can also use Math.trunc(dayOfMonth)
		const hours = fractionalPart * 24;
		const minutes = (hours % 1) * 60;
		const seconds = (minutes % 1) * 60;
		const ms = (seconds % 1) * 1000;
		
		return {Y: year, M: month, D: Math.trunc(dayOfMonth), H: Math.trunc(hours), m: Math.trunc(minutes), s: Math.trunc(seconds), ms: Math.trunc(ms)}
	}
	
	/**
	 *
	 *
	 * @param {number} Y
	 * @param {number} M Month number. element of {1, 2, ..., 12}
	 * @param {number} D Day number. element of {1, 2, ..., 31}
	 * @param {number} H Local time
	 * @param {number} m
	 * @param {number} s
	 * @param {number} ms
	 * @return {number} JD
	 */
	fromDate(Y, M, D, H = 0, m = 0, s = 0, ms = 0) {
		// Ensure everything is a number.
		[Y, M, D, H, m, s, ms].forEach(parseFloat); // TODO 2021-07-14: i don't know if this actually works :hmm:
		
		H += this.UT_hours;
		
		const fractionalPart = (H/24) + (m/(60*24)) + (s/(60*60*24)) + (ms/(1000*60*60*24));
		
		// see https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
		const A  = Math.trunc(Y / 100);
		const B  = Math.trunc(A / 4);
		const C  = 2 - A + B;
		const E  = Math.trunc(365.25 * (Y + 4716));
		const F  = Math.trunc(30.6001 * (M + 1));
		const JD = (C + D + E + F - 1524.5) + (fractionalPart);
		this.JD = JD;
		return JD;
	}
	
	get iso() {
		const {Y, M, D, H, m, s, ms} = this.parts;
		return `${this.format(Y)}-${this.format(M)}-${this.format(D)}T${this.format(H)}:${this.format(m)}:${this.format(s)}`;
	}
}

export { JulianDate }
