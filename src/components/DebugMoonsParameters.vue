<template>
	<div>
		<button v-for="(m, index) in moonsParameters" :class="{light: true, success: debug_activeTabIndex === index}" @click="debug_activeTabIndex = index">{{m.name}}</button>
	</div>
	<div>
		<div v-for="(moon, index) in moonsParameters" v-show="debug_activeTabIndex === index">
			<h6 class="mb0">{{moon.name}}</h6>
			<table class="mt0" style="display: inline-table">
				<tbody>
					<tr v-for="key in ['N', 'i', 'w', 'a', 'e', 'M']">
						<td>{{key}}</td>
						<td align="right">{{format(moon[key][0])}}</td>
						<td align="right">{{format(moon[key][1])}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script>
	import useNumberFormat from '../composables/useNumberFormat';
	
	export default {
		name: 'DebugMoonsParameters',
		props: {
			moonsParameters: {}
		},
		setup() {
			const { format } = useNumberFormat();
			return {
				format
			}
		},
		data() {
			return {
				debug_activeTabIndex: 0,
			}
		}
	}
</script>
<style scoped>
	
	canvas {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

</style>
<style>
	body {
		max-height: 100vh;
		max-width: 100vw;
		overflow: hidden;
	}
	
	/* TODO 2021-07-15: delete */
	#debug dl {
		display: grid;
		grid-template-columns: 100px 1fr;
		grid-gap: 0;
	}
	
	#debug dl > dt {
		grid-column: 1;
		text-align: right;
	}
	
	#debug dl > dd {
		grid-column: 2;
		margin: 0;
	}
	
	#debug dl > dt:nth-child(4n+1), #debug dl > dd:nth-child(4n+2) {
		background: #eee
	}

</style>
