<template>
	<ViewFromGround></ViewFromGround>
	<h1 style="opacity: 0.1;">note to self: triple eclipse at around jd 2459440.119999204</h1>
</template>

<script>
	import ViewFromGround from '../components/ViewFromGround';
	import OrbitViz from '../components/OrbitViz';
	export default {
		name: 'Home',
		components: {OrbitViz, ViewFromGround},
		
		mounted() {
			console.log(
				'%c-----' + '%c Home View : Mounted ' + '%c-----',
				'color: darkblue; background: rgba(200, 100, 100);',
				'color: black; background: #ddd;',
				'color: darkblue; background: rgba(200, 100, 100);',
			);
		},
	}
</script>
