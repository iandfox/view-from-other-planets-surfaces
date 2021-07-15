<template>
	<ViewFromGround></ViewFromGround>
</template>

<script>
	import ViewFromGround from '../components/ViewFromGround';
	export default {
		name: 'Home',
		components: {ViewFromGround},
		
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
