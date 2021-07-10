// import * as THREE from './three.js';
const threeAwait = import('./vendor/three.js');
const threeOrbitAwait = import('./vendor/three-orbit-controls.js');
await threeAwait; // top-level await. don't execute the rest of this until ixportaded.
await threeOrbitAwait;

/**
 * @since 2021-03-25
 */
export default class StarDraw3d {
	
	/*
	bodiesInfo = {}
	positions = {}
	meshes = {}
	trails = {}
	slugs = {x, y, z}
	scale = {x, y, z}
	renderer
	camera
	scene
	controls
	planet
	positionType // euclidean or spherical
	positionHistoryLength
	fadePositionHistory
	ecl
	
	
	/**
	 * @since 2021-03-25
	 */
	constructor(bodiesInfo, observationPoint, slugs = {x: 'x', y: 'y', z: 'z'}, positionScale = {x: 1, y: 1, z: 1}, positionType = 'euclidean', positionHistoryLength = 10, fadePositionHistory = true) {
		this.bodiesInfo = [];
		this.positions = {};
		this.meshes = {};
		this.trails = {};
		this.slugs = slugs;
		this.scale = positionScale;
		this.observationPoint = observationPoint;
		this.positionType = positionType;
		this.positionHistoryLength = positionHistoryLength; // unused as of 2021-03-25
		this.fadePositionHistory = fadePositionHistory; // unused as of 2021-03-25
		this.ecl = (d) => 23.4393 - 3.563e-7 * d;
		
		// Renderer
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(0.9 * window.innerWidth, 0.9 * window.innerHeight);
		this.renderer.toneMapping = THREE.NoToneMapping;
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		document.getElementById('canvases').appendChild(this.renderer.domElement);
		
		// Camera
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
		this.camera.position.set(0, 0, 100);
		this.camera.lookAt(0, 0, 0);
		
		// Scene
		this.scene = new THREE.Scene();
		
		// Controls
		this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
		this.controls.addEventListener('change', () => { this.draw() });
		this.controls.minDistance = 10;
		this.controls.maxDistance = 100;
		
		// Lights
		this.setupLights();
		
		// Bodies
		bodiesInfo.forEach((bodyInfo) => {
			this.addBody(bodyInfo);
		});
		
		// Central planet
		this.addPlanet();
		
		// Axes / circles
		this.addAxes();
		
		this.draw();
	}
	
	
	/**
	 * @since 2021-03-25
	 */
	setupLights() {
		const API = {
			lightProbeIntensity: 10.0,
			directionalLightIntensity: 10.2,
			envMapIntensity: 1
		};
		
		const directionalLight = new THREE.DirectionalLight(0xffffff, API.directionalLightIntensity);
		directionalLight.position.set(10, 10, 10);
		this.scene.add(directionalLight);
		
		// PointLight( color : Integer, intensity : Float, distance : Number, decay : Float
		this.sunLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
		this.sunLight.position.set(0, 0, 0);
		this.scene.add(this.sunLight);
	}
	
	
	/**
	 * @since 2021-03-25
	 */
	addPlanet() {
		const sphere = new THREE.SphereGeometry(1, 32, 32);
		const material = new THREE.MeshStandardMaterial({
			color: 0x0010ff,
			metalness: 0,
			roughness: 5,
		});
		
		this.planet = new THREE.Mesh(sphere, material);
		this.scene.add(this.planet);
	}
	
	
	/**
	 * @since 2021-03-25
	 */
	addAxes() {
		const axisLength = 30;
		const axisRadius = 50;
		// const lines = [
		// 	,
		// 	[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axisLength, 0)],
		// 	[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axisLength)],
		// 	// TODO: circle.
		// ];
		// lines.forEach((points) => {
		// const g = new THREE.BufferGeometry().setFromPoints(points);
		const lines = [
			new THREE.Line(
				new THREE.BufferGeometry().setFromPoints(
					[new THREE.Vector3(0, 0, 0), new THREE.Vector3(axisLength, 0, 0)]
				),
				new THREE.LineBasicMaterial({color: 0xff0000})
			),
			new THREE.Line(
				new THREE.BufferGeometry().setFromPoints(
					[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, axisLength, 0)]
				),
				new THREE.LineBasicMaterial({color: 0x00ff00})
			),
			new THREE.Line(
				new THREE.BufferGeometry().setFromPoints(
					[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, axisLength)]
				),
				new THREE.LineBasicMaterial({color: 0x0000ff})
			)
		];
		
		// TODO: ecliptic
		
		lines.forEach((l) => this.scene.add(l));
	}
	
	
	/**
	 * @since 2021-03-25
	 */
	addBody(bodyInfo) {
		const name = bodyInfo.name;
		this.bodiesInfo.push(bodyInfo);
		this.positions[name] = null;
		this.trails[name] = {
			geometry: new THREE.BufferGeometry(),
			line: null,
			positionsHistory: []
		};
		
		this.trails[name].line = new THREE.Line(this.trails[name].geometry, new THREE.LineBasicMaterial({color: bodyInfo.color}));
		this.scene.add(this.trails[name].line);
		
		/*
		SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
		radius — sphere radius. Default is 1.
		widthSegments — number of horizontal segments. min value is 3, and the default is 8.
		heightSegments — number of vertical segments. min value is 2, and the default is 6.
		phiStart — specify horizontal starting angle. Default is 0.
		phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
		thetaStart — specify vertical starting angle. Default is 0.
		thetaLength — specify vertical sweep angle size. Default is Math.PI.
		*/
		const sphere = new THREE.SphereGeometry(bodyInfo.size, 32, 32);
		const material = new THREE.MeshStandardMaterial({
			color: bodyInfo.color,//0xffffff,
			metalness: 0,
			roughness: 0,
		});
		this.meshes[name] = new THREE.Mesh(sphere, material);
		this.scene.add(this.meshes[name]);
	}
	
	
	/**
	 * @since 2021-03-25
	 */
	addPositions(day) {
		this.bodiesInfo.forEach((bodyInfo) => {
			const name = bodyInfo.name;
			if (this.positions[name]) {
				this.trails
			}
			this.positions[name] = getDataForDay(day, bodyInfo.name, bodyInfo.N, bodyInfo.i, bodyInfo.w, bodyInfo.a, bodyInfo.e, bodyInfo.M, this.ecl, this.observationPoint.lat, this.observationPoint.lng, this.observationPoint.UT, bodyInfo.isGeocentric);
		});
	}
	
	
	/**
	 * @since 2021-03-25
	 */
	draw() {
		this.bodiesInfo.forEach((bodyInfo) => {
			const name = bodyInfo.name;
			if (this.positions[name]) {
				const p = this.positions[name];
				const coords = new THREE.Vector3(0, 0, 0);
				if (this.positionType === 'spherical') {
					coords.setFromSpherical(new THREE.Spherical(p[this.slugs.x], p[this.slugs.y], p[this.slugs.z]));
				} else {
					coords.set(p[this.slugs.x], p[this.slugs.y], p[this.slugs.z]);
				}
				coords.multiplyScalar(this.scale.x); // TODO: only need one float for the scalar?
				
				// Add to history
				if (this.positions[name] !== null && this.trails[name] && this.positionHistoryLength > 0) {
					this.trails[name].positionsHistory.unshift(coords);
					if (this.trails[name].positionsHistory.length > this.positionHistoryLength) {
						this.trails[name].positionsHistory.pop();
					}
					this.trails[name].geometry.setFromPoints(this.trails[name].positionsHistory);
				}
				
				
				this.meshes[name].position.set(coords);
				if (name === 'sun') {
					this.sunLight.position.set(coords); // Not working :-/
				}
			}
		});
		
		this.renderer.render(this.scene, this.camera);
	}
	
	resetPositions() {}
	
	setupDrawings() {}
	
	resetDrawings() {}
}
