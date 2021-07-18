/**
 * JulianDate
 *     Helper class to format, add, etc julian dates
 *
 * @since 2021-07-14
 */

import moment from 'moment';

class JulianDate {
	constructor(JD = 2451545, UT_hours = -7) {
		this.UT_hours = UT_hours;
		this.JD = JD;
		
		this.JULIAN_YEAR = 31557600;
		
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
	
	/**
	 *
	 * @since 2021-07-17
	 *
	 * @param epoch
	 * @param UT_hours
	 * @return {JulianDate}
	 */
	static fromEpoch(epoch, UT_hours = -7) {
		return new JulianDate(JulianDate.epochToJD(epoch), UT_hours);
	}
	
	
	/**
	 * @since 2021-07-17
	 *
	 * @param epoch
	 * @return {number}
	 */
	static epochToJD(epoch) {
		const deltaSeconds = moment.unix(epoch).diff(moment('2000-01-01T12:00:00-00:00'), 'seconds');
		const deltaDays = deltaSeconds / 86400;
		const JD = 2451545 + deltaDays;
		return JD;
	}
	
	
	/**
	 * @since 2021-07-17
	 *
	 * @param datetime
	 * @return {number}
	 */
	static datetimeToJD(datetime) {
		const epoch = moment(datetime).unix();
		return JulianDate.epochToJD(epoch);
	}
	
	
	
	static jdToEpoch(jd) {
		const daysSinceJD2000 = jd - 2451545;
		const secondsSinceJD2000 = daysSinceJD2000 * 60 * 60 * 24;
		return moment('2000-01-01T12:00:00-00:00').add(Math.floor(secondsSinceJD2000), 'seconds').unix();
	}
	
	
	/**
	 * @since 2021-07-17
	 *
	 * @return {number}
	 */
	get epoch() {
		return JulianDate.jdToEpoch(this.JD);
	}
	
	/**
	 * @since 2021-07-18
	 *
	 * @return {{date: string, datetime: string, time: string}}
	 */
	get datetime() {
		console.error('JulianDate.datetime is broken');
		const m = moment.unix(this.epoch);
		return {
			date: m.format('YYYY-MM-DD'),
			time: m.format('hh:mm'),
			datetime: m.format('YYYY-MM-DDThh:mm'),
		}
	}
}

export { JulianDate }
