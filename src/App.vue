<template>
	<div id="nav">
		<router-link to="/">Home</router-link>
		|
		<router-link to="/sun">Sun</router-link>
		|
		<router-link to="/sidereal-time">Sidereal Time</router-link>
		|
		<router-link to="/azimuthal">Azimuthal</router-link>
	</div>
	<router-view/>
	
	<div id="floating-controls"></div>
</template>

<style lang="less">
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
	
	#nav {
		padding: 30px;
		
		a {
			font-weight: bold;
			color: #2c3e50;
			
			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
	
	#floating-controls {
		z-index: 999;
		transform: translate3d(0, 0, 0);
		position: fixed;
		top: var(--length-medium);
		right: var(--length-medium);
		padding: var(--length-small);
		box-shadow: 0 0 5px 0 var(--color-accent);
		
		background: rgba(255, 255, 255, 0.75);
	}
</style>
