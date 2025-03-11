<script>
	import { onMount } from 'svelte';
	import { languageToColor, abbreviateLanguage } from "../utils/linguistics.js"
	import dictionaryData from "../data/sketches/childhood-dictionary.json";

	let data;
	let fixedData;
	let word;
	let entry;

	onMount(() => {
		fixedData = dictionaryData;
		data = JSON.parse(JSON.stringify(fixedData));
		setRandomWordWithoutReplacement();
	});

	function setRandomWord(dict) {
		const keys = Object.keys(dict);
		const randomIndex = Math.round(Math.random() * (keys.length - 1));
		word = keys[randomIndex];
		entry = dict[word];
	}
	
	function setRandomWordWithoutReplacement() {
		const keys = Object.keys(data);
		const randomIndex = Math.round(Math.random() * (keys.length - 1));
		word = keys[randomIndex];
		entry = data[word];
		delete data[word];
		if (Object.keys(data).length === 0) {
			data = JSON.parse(JSON.stringify(fixedData));
		}
	}

</script>


<div class="graphic-container" id="childhood-dictionary">
	{#if data}
		<div class="entry">
			<h2 class="word">{@html word}</h2>
			<h4 class="grammar">[ 
				<span class="pronunciation">
					{#each entry.pronunciation as syllable, index}
						{#if index > 0 && !syllable.startsWith("&") && !entry.pronunciation[index - 1].startsWith("&")}
							&nbsp;<span class='bullet'>&#8226;</span>
						{/if}
						{@html syllable}
					{/each}
				</span> ] &nbsp;&nbsp;&nbsp;<span class="divider">|</span>&nbsp;&nbsp; <span class="part-of-speech">{@html entry.partOfSpeech}</span></h4>
			<hr>
			<p class="description">
				{#each entry.definitions as definition, index}
					<span class="definition">
						{#if entry.definitions.length > 1}
							<span class="index">{index + 1}.&nbsp;</span>
						{/if}
						{@html definition}
					</span>
				{/each}
			</p>
			{#if entry.alternateSpellings.length}
				<p class="alternate-spellings">
					<b><i>Alt.</i></b>:&nbsp;
					{#each entry.alternateSpellings as spelling, index}
						{#if index > 0}
							,&nbsp;
						{/if}
						{@html spelling}
					{/each}
				</p>
			{/if}
			{#if entry.etymology.length}
				<p class="etymology">
					<b><i>Ety.</i></b>:&nbsp;
					{#each entry.etymology as item, index}	
						{#if index > 0}
							<span class="divider" style="color: var(--color-3);">&nbsp;&nbsp;|&nbsp;</span>
						{/if}
						<span>{@html item.word}</span> <span class="language" style={`color: ${languageToColor(item.language)}`}>({@html abbreviateLanguage(item.language)})</span>
					{/each}
				</p>
			{/if}
		</div>
		<div class="button-container">
			<button on:click={() => setRandomWordWithoutReplacement(data)}>
				<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor"viewBox="0 0 16 16">
					<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
					<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
				</svg>
			</button>
		</div>
	{/if}
</div>

<style>
	:global(.sketch:has(#childhood-dictionary)) {
		justify-content: start !important;
	}
	:global(.apostrophe) {
		font-family: "Vollkorn" !important;
	}
	.graphic-container {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: start;
		min-height: calc(100vh - var(--header-height));
		padding-top: 25px;
		width: min(550px, 95%);
	}
	.button-container {
		min-width: 200px;
		padding-top: 25px;
		padding-bottom: 25px;
		margin-bottom: 60px;
		display: flex;
		justify-content: center;
	}
	button {
		background: transparent;
		border: none;
		height: min(5vw, 22px);
		width: min(5vw, 22px);
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
		overflow: visible;
		padding: 0px;
	}
	button:hover {
		color: var(--color-1);
	}
	.entry {
		color: var(--color-1);
		padding: 20px;
		position: relative;
		margin: 0 auto;
		display: flex;
  		flex-direction: column;
  		justify-content: center;
  		flex: 1;
	}
	.entry .word {
		font-size: min(10vw, 44px);
		margin-top: 0px;
		margin-bottom: 5px;
	}
	.entry .grammar {
		color: var(--color-3);
		font-size: min(4.5vw, 18px);
		margin-top: 0px;
		margin-bottom: 10px;
		font-weight: normal;
	}
	.entry .pronunciation {
		font-size: min(4.25vw, 17px);
/*		font-family: "Vollkorn";*/
	}
	.entry .divider {
		color: var(--color-3);
		font-weight: normal;
		opacity: 0.75;
	}
	hr {
		width: 100%;
	}
	.entry .description {
		position: relative;
		font-size: min(5vw, 20px);
		margin-bottom: 0px;
		margin-top: 10px;
	}
	.entry .description .index {
		font-weight: bold;
	}
	.entry .description .definition {
		margin-right: 7px;
	}
	.entry .etymology, .entry .alternate-spellings {
		margin-top: 10px;
		font-size: min(5vw, 20px);
	}
	.entry .alternate-spellings {
		margin-bottom: 0px;
	}
    :global(.entry a) {
        text-decoration: underline;
        padding: 0px 1px;
        color: var(--color-2);
    }
    :global(.entry a:hover) {
        background: var(--color-3);
        text-decoration: none;
        border-radius: 5px;
        color: white;
    }
	:global(.entry .bullet) {
		opacity: 0.5;
		margin: 0 1px;
	}
	.entry .language {
		font-weight: normal;
		font-size: min(4vw, 16px);
	}
</style>