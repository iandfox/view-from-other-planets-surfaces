import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import SunViewer from '../views/SunViewer';
import MoonViewer from '../views/MoonViewer';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/sun',
		name: 'SunViewer',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: SunViewer,
		// component: function() {
		// 	return import(/* webpackChunkName: "about" */ '../views/About.vue')
		// }
	},
	
	{
		path: '/moon',
		name: 'MoonViewer',
		component: MoonViewer,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router
