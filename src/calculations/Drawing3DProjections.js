/**
 * Fuck the super complex 3d JS drawing stuff. I just want a super simple perspective view of 3d stuff!
 *
 * oreily_fuck-it-well-do-it-live.gif
 *
 * @since 2021-07-14
 */

// class Drawing3DProjections {
// 	/**
// 	 * @param canvas
// 	 * @param {number} angleAlpha_deg The perspective angle thing
// 	 */
// 	constructor(canvas, angleAlpha_deg = 0) {
// 		this.canvas = canvas;
// 		this.ctx = this.canvas.getContext('2d');
// 		this.alpha_deg = angleAlpha_deg;
// 		this.alpha = this.alpha_deg * Math.PI / 180;
// 	}
// }

const to2d = (x, y, z, perspectiveAngle_deg = 45) => {
	const perspectiveAngle = perspectiveAngle_deg * Math.PI / 180;
	// Cabinet projection
	return {
		x: x + 0.5 * z * Math.cos(perspectiveAngle),
		y: y + 0.5 * z * Math.sin(perspectiveAngle),
		z: 0 // we'll usually ignore this term but may as well return a Vector3, i guess
	}
};

export {
	to2d
}
