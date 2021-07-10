<!--
 - Vue Component: SunViewer
 - @created 2021-07-10
-->

<template>
	<section>
		<h1>Here Comes the Sun</h1>
		<SC></SC>
	</section>
</template>

<script>
	import SC from '../components/SC';
	export default {
		name: 'SunViewer',
		components: {SC},
	}
</script>
