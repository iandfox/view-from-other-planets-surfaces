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
	<SiderealTimeSandbox></SiderealTimeSandbox>
</template>

<script>
	import SiderealTimeSandbox from '../../components/sandbox-views/SiderealTimeSandbox';
	export default {
		name: 'SiderealViewer',
		components: {SiderealTimeSandbox},
	}
</script>
