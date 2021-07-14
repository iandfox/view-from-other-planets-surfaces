/**
 * AzimuthalCoordinates
 *
 * @since 2021-07-13
 */
import {clampAngle180} from './ClampAngle';

/**
 * Gets the Hour Angle given LST and RA. Clamps to within -180 and 180 degrees
 *
 * @param LST_deg
 * @param RA_deg
 * @constructor
 */
const HA_deg = (LST_deg, RA_deg) => {
	return clampAngle180(LST_deg - RA_deg);
};

const HA = (LST_deg, RA_deg) => {
	return HA_deg(LST_deg, RA_deg) * 180 / Math.PI;
};

export {
	HA_deg,
	HA
}
