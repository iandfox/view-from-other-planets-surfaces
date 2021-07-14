import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import SunView from '../views/sandbox-views/SunView.vue'
import SiderealTimeView from '../views/sandbox-views/SiderealTimeView';
import AltAzView from '../views/sandbox-views/AltAzView';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/sun',
		name: 'SunView',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: SunView,
		// component: function() {
		// 	return import(/* webpackChunkName: "about" */ '../views/About.vue')
		// }
	},
	{
		path: '/sidereal-time',
		name: 'SiderealTimeView',
		component: SiderealTimeView,
	},
	{
		path: '/azimuthal',
		name: 'AltAzView',
		component: AltAzView,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router
