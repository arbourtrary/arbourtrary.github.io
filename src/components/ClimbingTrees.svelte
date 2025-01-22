<script>
	import { onMount } from "svelte";

const trees = [
  {
    "h2": "R E D W O O D",
    "h3": "Sequoia sempervirens",
    "color": "#a45a52",
    "filter": "brightness(0) invert(44%) sepia(17%) saturate(1325%) hue-rotate(317deg) brightness(88%) contrast(92%);",
    "portrait": "/images/climbing-trees/redwood.png",
    "landscape": "/images/climbing-trees/redwood.png",
    "height": "116"
  },
  {
    "h2": "C O T T O N W O O D",
    "h3": "Populus deltoides",
    "color": "#C5B6A6",
    "filter": "brightness(0) invert(80%) sepia(8%) saturate(538%) hue-rotate(350deg) brightness(95%) contrast(82%);",
    "portrait": "/images/climbing-trees/cottonwood.png",
    "landscape": "/images/climbing-trees/cottonwood.png",
    "height": "90"
  },
  {
    "h2": "L O Q U A T",
    "h3": "Eriobotrya japonica",
    "color": "#D4A668",
    "filter": "brightness(0) invert(70%) sepia(33%) saturate(459%) hue-rotate(346deg) brightness(91%) contrast(89%)",
    "portrait": "/images/climbing-trees/loquat.png",
    "landscape": "/images/climbing-trees/loquat.png",
    "height": "25"
  },
  {
    "h2": "P A L M",
    "h3": "Cocos nucifera",
    "color": "var(--green)",
    "filter": "brightness(0) invert(49%) sepia(12%) saturate(831%) hue-rotate(61deg) brightness(100%) contrast(90%)",
    "portrait": "/images/climbing-trees/palm.png",
    "landscape": "/images/climbing-trees/palm.png",
    "height": "65"
  },
  {
    "h2": "E U C A L Y P T U S",
    "h3": "Eucalyptus globulus",
    "color": "#5F8575",
    "filter": "brightness(0) invert(47%) sepia(28%) saturate(336%) hue-rotate(103deg) brightness(97%) contrast(86%);",
    "portrait": "/images/climbing-trees/eucalyptus.png",
    "landscape": "/images/climbing-trees/eucalyptus.png",
    "height": "80"
  },
  {
    "h2": "O R A N G E",
    "h3": "Citrus sinensis",
    "color": "#D8A06B",
    "filter": "brightness(0) invert(71%) sepia(27%) saturate(459%) hue-rotate(339deg) brightness(92%) contrast(84%)",
    "portrait": "/images/climbing-trees/orange.png",
    "landscape": "/images/climbing-trees/orange.png",
    "height": "30"
  },
  {
    "h2": "L E M O N",
    "h3": "Citrus limon",
    "color": "#B0A675",
    "filter": "brightness(0) invert(71%) sepia(5%) saturate(1878%) hue-rotate(13deg) brightness(92%) contrast(94%);",
    "portrait": "/images/climbing-trees/lemon.png",
    "landscape": "/images/climbing-trees/lemon.png",
    "height": "20"
  },
  {
    "h2": "O A K",
    "h3": "Quercus virginiana",
    "color": "#8D7267",
    "filter": "brightness(0) invert(46%) sepia(11%) saturate(568%) hue-rotate(326deg) brightness(94%) contrast(88%)",
    "portrait": "/images/climbing-trees/oak.png",
    "landscape": "/images/climbing-trees/oak.png",
    "height": "70"
  },
  {
    "h2": "F L A M B O Y A N",
    "h3": "Royal poinciana",
    "color": "#CC5F4B",
    "filter": "brightness(0) invert(49%) sepia(41%) saturate(829%) hue-rotate(327deg) brightness(94%) contrast(89%)",
    "portrait": "/images/climbing-trees/flamboyan.png",
    "landscape": "/images/climbing-trees/flamboyan.png",
    "height": "45"
  },
  {
    "h2": "W I L L O W",
    "h3": "Salix babylonica",
    "color": "#89A088",
    "filter": "brightness(0) invert(65%) sepia(9%) saturate(654%) hue-rotate(71deg) brightness(94%) contrast(88%)",
    "portrait": "/images/climbing-trees/willow.png",
    "landscape": "/images/climbing-trees/willow.png",
    "height": "65"
  }
]

	let tree;
	let innerWidth;
	let data;

	onMount(() => {
		data = JSON.parse(JSON.stringify(trees));
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
		tree = data[keys[randomIndex]];
		delete data[keys[randomIndex]];
		if (Object.keys(data).length === 0) {
			data = JSON.parse(JSON.stringify(trees));
		}
	}
</script>


<svelte:window bind:innerWidth={innerWidth}/>

<div class="graphic-container" id="climbing-trees">
	{#if tree}
		<div class="tree-silhouette">
			<img 
				src={innerWidth < 600 ? tree.portrait : tree.landscape}
				style={`filter: ${tree.filter};`}
			/>
			<h2 style={`color: ${tree.color};`}>{@html tree.h2}</h2>
			<h3 style={`color: ${tree.color};`}>{@html tree.h3}</h3>
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
	:global(.sketch:has(#climbing-trees)) {
		justify-content: start !important;
	}
	.tree-silhouette {
		display: flex;
  		flex-direction: column;
  		align-items: center;
  		justify-content: center;
  		flex: 1;
  		height: calc(100vh - 140px);
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
	.tree-silhouette img {
		max-width: min(90%, 500px);
  		max-height: min(80vh, 600px);
		margin: 0 auto;
		height: 100%;
	}
	.tree-silhouette h2 {
		text-align: center;
		font-size: min(28px, 5vw);
		margin-top: 25px;
		margin-bottom: 10px;
	}
	.tree-silhouette h3 {
		text-align: center;
		font-size: min(20px, 4vw);
		margin-top: 0px;
		font-style: italic;
		font-weight: normal;
	}
	@media only screen and (max-width: 600px) {
		.tree-silhouette h2 {
			margin-top: 15px;
			margin-bottom: 5px;
		}
	}
</style>