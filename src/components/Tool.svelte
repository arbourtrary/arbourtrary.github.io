<script>
	import { marked } from "marked";
	import { onMount } from "svelte";
	import { base } from '$app/paths'

	marked.use({
	  mangle: false,
	  headerIds: false
	});

	export let tool = {};
	export let loading = 'eager';

	const releases = ["open-source"];
	const licenses = ["MIT"];
	const tech = ["web-component"];
	const languages = ["JS"];

	const getColor = (tag) => {
		if (releases.includes(tag)) return "var(--red)";
		if (licenses.includes(tag)) return "var(--yellow)";
		if (tech.includes(tag)) return "var(--blue)";
		if (languages.includes(tag)) return "var(--green)";
	}
</script>



<div class="tool">

	<div class="tool-info">
		<a href={tool.link} target="_blank">
			<h3>{@html tool.name}</h3>
		</a>
		<p>{@html tool.description}</p>
		<div class="tool-tags">
			{#each tool?.tags as tag}
			{@const color = getColor(tag)}
				<div style={`border: 1.5px solid ${color};`} class="tool-tag">
					<div class="tool-tag-bg" style={`background: ${color}; opacity: 0.05;`}></div>
					<p style={`color: ${color};`}>{tag}</p>
				</div>
			{/each}
		</div>
	</div>
</div>


<style>
	:root {
		--tool-opacity: 0.6;
	}
	:root.dark-theme {
		--tool-opacity: 0.8;
	}
	.tool {
		margin: auto 10px;
		text-decoration: none;
		display: flex;
		flex-direction: row;
		gap: 15px;
		padding-top: 45px;
		border-top: 0.5px solid var(--color-2);
	}
	.tool a {
		position: relative;
		text-decoration: none;
		color: var(--color-1);
		cursor: pointer;
	}
	.tool a:hover h3 {
		text-decoration: underline;
	}
    :global(.tool-info > p a) {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-2);
        text-decoration-thickness: 0.5px;
        text-underline-offset: 3px;
    }
    :global(.tool-info > p a:hover) {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-1);
        text-decoration-thickness: 1px;
    }
	.tool h3 {
		font-family: var(--serif);
		color: var(--color-1);
	}
	.tool h3 {
		margin-bottom: 0px;
		font-weight: bold;
		margin-top: 0px;
		font-size: 24px;
		line-height: 1;
	}
	.tool-tags {
		display: flex;
		flex-direction: row;
		gap: 8px;
		flex-flow: wrap;
		margin: 10px 0;
		font-family: "Vollkorn";
		font-size: 14px;
	}
	.tool-tag {
		padding: 5px 7px;
		border-radius: 7px;
		display: flex;
		overflow: hidden;
		position: relative;
	}
	.tool-tag p {
		margin: 0px;
		line-height: 1;
		font-family: var(--serif);
		color: var(--color-1);
		font-weight: bold;
		z-index: 2;
	}
	.tool-tag-bg {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1;
	}
	.tool-info > p {
		line-height: 1.3;
	    font-family: var(--serif);
	    color: var(--color-1);
	    font-size: 18px;
	    margin-top: 10px;
	    margin-bottom: 0px;
	}
	@media only screen and (max-width: 600px) {
		.tool {
			padding-top: 30px;
		}
		.tool h3 {
			font-size: 22px;
		}
		.tool > p {
			font-size: 16px;
		}

	}
</style>