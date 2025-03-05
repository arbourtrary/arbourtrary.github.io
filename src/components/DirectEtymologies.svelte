<script>
	import { onMount } from 'svelte';
	import { languageToColor } from "../utils/linguistics.js"
	import etymologiesData from "../data/sketches/direct-etymologies.json";

	let fixedData;
	let data;
	let words;
	let opacity = 0;

	onMount(() => {
		fixedData = etymologiesData;
		data = JSON.parse(JSON.stringify(fixedData));
		setRandomEntryWithoutReplacement();
	});

	function getRandomEntry(dict) {
		const keys = Object.keys(dict);
		const randomIndex = Math.round(Math.random() * (keys.length - 1));
		return dict[keys[randomIndex]];
	}

	function setRandomEntryWithoutReplacement() {
		const keys = Object.keys(data);
		const randomIndex = Math.round(Math.random() * (keys.length - 1));
		words = data[keys[randomIndex]];
		delete data[keys[randomIndex]];
		if (Object.keys(data).length === 0) {
			data = JSON.parse(JSON.stringify(fixedData));
		}
	}
</script>


<div id="direct-etymologies" class="graphic-container">
	{#if data}
		<div class="etymology">
		{#each words as word, index}
			<h2 class="polygon-name">{word.split(" (")[0]}</h2><span style={`color: ${languageToColor(word.split(" (")[1].replace(")",""))}`} class="language">{word.split(" (")[1].replace(")","")}</span>
			{#if index !== (words.length - 1)}
				<div class="connector"></div>
			{/if}
		{/each}
		</div>
		<div class="button-container">
			<button on:click={() => { setRandomEntryWithoutReplacement(); }}>
				<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor"viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
					<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
				</svg>
			</button>
		</div>
	{/if}
</div>


<style>
	:global(.sketch:has(#direct-etymologies)) {
		justify-content: start !important;
	}
	.graphic-container {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		min-height: calc(100vh - var(--header-height));
		padding-top: 25px;
	}
	button {
		background: transparent;
		border: none;
		height: min(30px, 8vw);
		width: min(30px, 8vw);
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
		margin-top: 10px;
		overflow: visible;
		padding: 0px;
	}
	.button-container {
		min-width: 200px;
		padding-top: 25px;
		padding-bottom: 25px;
		margin-bottom: 60px;
		display: flex;
		justify-content: center;
	}
	button:hover {
		color: var(--color-1);
	}
	.etymology {
		display: flex;
  		flex-direction: column;
  		align-items: center;
  		justify-content: center;
  		flex: 1;
  		transition: all 100ms linear;
	}
	h2 {
		margin-top: 0px;
		margin-bottom: 0px;
		font-size: min(6vw, 26px);
		text-align: center;
		font-weight: 600;
	}
	.language {
		color: var(--color-3);
		font-size: min(3vw, 13px);
		margin-bottom: 5px;
		text-align: center;
		color: var(--red );
	}
	.connector {
		height: 40px;
		width: 1px;
		background: var(--color-3);
	}
	@media only screen and (max-width: 600px) {
		.connector {
			height: 25px;
		}
	}
</style>