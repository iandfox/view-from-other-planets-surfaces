/**
 * ClampAngle
 *     One function to clamp angles from 0 to 360. Another to clamp from -180 to 180
 */

const clampAngle = (angleInDegrees) => {
	return ((angleInDegrees % 360) + 360) % 360;
};

const clampAngle180 = (angleInDegrees) => {
	let a = clampAngle(angleInDegrees);
	if (a > 180) { a -= 360; }
	return a;
};

export {
	clampAngle,
	clampAngle180,
}
