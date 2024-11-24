<script>
	export let lineWidth = 1;
	export let values = [];
	export let colors = [];
</script>

<div class="line-container">
	{#each values as value, index}
		<div class="line" style={colors.length ? `background: ${colors[index]}` : ""}></div>
	{/each}
</div>

<style>
	.line-container {
		display: flex;
		align-items: center;
		gap: 2px;
		cursor: pointer;
		height: 50px;
	}
	.line {
		height: 35px;
		width: 2px;
		opacity: 0.75;
	}
	.line:hover {
		width: 2px;
		height: 50px;
		opacity: 1;
	}
</style>