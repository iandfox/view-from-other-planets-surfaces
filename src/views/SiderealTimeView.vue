<!--
 - Vue Component: SiderealViewer
 -
 -     Example usage:
 -         <SiderealViewer></SiderealViewer>
 -
 - @created 2021-07-11
-->

<template>
	<h1>Time keeps on slippin' slippin' slippin'</h1>
	<SiderealTimeViewer></SiderealTimeViewer>
</template>

<script>
	import SiderealTimeViewer from '../components/SiderealTimeViewer';
	export default {
		name: 'SiderealViewer',
		components: {SiderealTimeViewer},
	}
</script>
