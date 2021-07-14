import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import SunView from '../views/sandbox-views/SunView.vue'
import SiderealTimeView from '../views/sandbox-views/SiderealTimeView';
import AltAzView from '../views/sandbox-views/AltAzView';
import MoonView from '../views/sandbox-views/MoonView';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/sun',
		name: 'SunView',
		component: SunView,
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
	{
		path: '/moon',
		name: 'MoonView',
		component: MoonView,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

export default router
