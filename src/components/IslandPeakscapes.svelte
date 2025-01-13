<script>
	import { onMount } from "svelte";

	const peaks = [
		{
			"h2": "M O <span class='apostrophe'>'</span> O R E A",
			"h3": "P O L Y N E S I E &nbsp; F R A N Ç A I S E",
			"color": "var(--green)",
			"filter": "hue-rotate(975deg)",
			"portrait": "/images/island-peakscapes/moorea-close.png",
			"landscape": "/images/island-peakscapes/moorea.png"
		},
		{
			"h2": "T A H I T I",
			"h3": "P O L Y N E S I E &nbsp; F R A N Ç A I S E",
			"color": "var(--green)",
			"filter": "hue-rotate(975deg)",
			"portrait": "/images/island-peakscapes/tahiti-close.png",
			"landscape": "/images/island-peakscapes/tahiti.png"
		}
	]

	let peak;
	let innerWidth;
	let data;

	onMount(() => {
		data = JSON.parse(JSON.stringify(peaks));
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
		peak = data[keys[randomIndex]];
		delete data[keys[randomIndex]];
		if (Object.keys(data).length === 0) {
			data = JSON.parse(JSON.stringify(peaks));
		}
	}
</script>


<svelte:window bind:innerWidth={innerWidth}/>

<div class="graphic-container" id="island-peakscapes">
	{#if peak}
		<div class="peakscape">
			<img 
				src={innerWidth < 600 ? peak.portrait : peak.landscape}
				style={`filter: ${peak.filter};`}
			/>
			<h2 style={`color: ${peak.color};`}>{@html peak.h2}</h2>
			<h3 style={`color: ${peak.color};`}>{@html peak.h3}</h3>
		</div>

		<div class="button-container" on:click={() => setRandomEntryWithoutReplacement()}>
			<button > 
				<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor"viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
					<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
				</svg>
			</button>
		</div>
	{/if}
</div>

<style>
	:global(.sketch:has(#island-peakscapes)) {
		justify-content: start !important;
	}
	.peakscape {
		display: flex;
  		flex-direction: column;
  		align-items: center;
  		justify-content: center;
  		flex: 1;
	}
	button {
		background: transparent;
		border: none;
		height: min(30px, 8vw);
		width: min(30px, 8vw);
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
		overflow: visible;
		padding: 0px;
	}
	button:hover {
		color: var(--color-1);
	}
	.button-container {
	  min-width: 200px;
	  padding-top: 25px;
	  padding-bottom: 25px;
	  margin-bottom: 60px;
	  display: flex;
	  justify-content: center;
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
	.peakscape img {
		max-width: min(90%, 1200px);
		margin: 0 auto;
	}
	.peakscape h2 {
		text-align: center;
		font-size: 30px;
		margin-top: 25px;
		margin-bottom: 10px;
	}
	.peakscape h3 {
		text-align: center;
		font-size: 14px;
		margin-top: 0px;
	}
</style>