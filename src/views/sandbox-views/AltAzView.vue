<!--
 - Vue Component: AltAzView
 -
 -     Example usage:
 -         <AltAzView></AltAzView>
 -
 - @created 2021-07-11
-->

<template>
	<h1>We're altmost at the azend</h1>
	<AltAzSandbox></AltAzSandbox>
</template>

<script>
	import AltAzSandbox from '../../components/sandbox-views/AltAzSandbox';
	export default {
		name: 'AltAzView',
		components: {AltAzSandbox},
	}
</script>
