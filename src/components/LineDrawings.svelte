<script>
	import { onMount } from 'svelte';
	import { calculatePathAngles } from '../utils/svg.js';

	const ANIMATION_DURATION = 10 // seconds;
	const fixedUrls = [
		"/images/line-drawings/sequence-03.svg?url&raw",
		"/images/line-drawings/sequence-05.svg?url&raw",
		"/images/line-drawings/sequence-06.svg?url&raw",
		"/images/line-drawings/sequence-08.svg?url&raw",
		"/images/line-drawings/sequence-12.svg?url&raw",
		"/images/line-drawings/sequence-17.svg?url&raw",
		"/images/line-drawings/sequence-19.svg?url&raw",
		"/images/line-drawings/sequence-22.svg?url&raw",
		"/images/line-drawings/sequence-25.svg?url&raw",
		"/images/line-drawings/sequence-26.svg?url&raw",
		"/images/line-drawings/sequence-27.svg?url&raw",
		"/images/line-drawings/sequence-34.svg?url&raw",
		"/images/line-drawings/sequence-35.svg?url&raw",
		"/images/line-drawings/sequence-36.svg?url&raw",
		"/images/line-drawings/sequence-41.svg?url&raw",
		"/images/line-drawings/sequence-42.svg?url&raw",
		"/images/line-drawings/sequence-46.svg?url&raw",
		"/images/line-drawings/sequence-47.svg?url&raw",
		"/images/line-drawings/sequence-48.svg?url&raw",
		"/images/line-drawings/sequence-49.svg?url&raw"
	]

	let data;
	let drawing;
	let drawingDiv;
	let drawingLength;
	let initialized = false;
	let activeButtons = [false, false, false, true]

	async function fetchSVG(url) {
		const response = await fetch(url);
		const svg = await response.text();
		return svg;
	}

	onMount(() => {
		data = JSON.parse(JSON.stringify(fixedUrls));
		setAnimationDuration(ANIMATION_DURATION * 100)
	});
   
	async function setRandomDrawingWithoutReplacement() {
		const randomIndex = Math.round(Math.random() * (data.length - 1));
		drawing = await fetchSVG(data[randomIndex]);
		drawingDiv.innerHTML = drawing;

		const path = drawingDiv.children[0].querySelector('path')
		length = path.getTotalLength();
		const angle = calculatePathAngles(path.getAttribute("d")).averageAngle.toFixed(2);
		const shadowColor = angleToColor(angle);

		document.documentElement.style.setProperty("--svg-length", `${length}px`);
		document.documentElement.style.setProperty("--svg-shadow-color", `${shadowColor}`);

		data.splice(randomIndex, 1);
		if (data.length === 0) {
			data = JSON.parse(JSON.stringify(drawings));
		}
	}

	function angleToColor(angle) {
		const colorArray = [
			"var(--red)",
			"var(--orange)",
			"var(--yellow)",
			"var(--green)",
			"var(--blue)",
			"var(--indigo)",
			"var(--purple)"
		]
			const lowpoint = 117
    	const highpoint = 122.5;

    	let pct = (angle - lowpoint) / (highpoint - lowpoint);
    	// clamp
    	if (pct > 1) {
    		pct = 1
    	}
    	if (pct < 0) {
    		pct = 0;
    	}
    	const index = Math.round(pct * (colorArray.length - 1));
    	return colorArray[index];
	}

	function updateActiveButton(index) {
		for (var i = 0; i < activeButtons.length; i++) {
			if (i === index) {
				activeButtons[i] = true;
			} else {
				activeButtons[i] = false;
			}
		}
	}

	function setAnimationDuration(duration) {
		document.documentElement.style.setProperty("--svg-duration", `${duration}s`);
		restartAnimation();
	}

	function restartAnimation() {
		drawingDiv.innerHTML = "";
		drawingDiv.innerHTML = drawing;
		if (drawingDiv.children[0]) {
			length = drawingDiv.children[0].querySelector('path').getTotalLength();
		}
	}

	$: if (drawingDiv && data && !initialized) {
		setRandomDrawingWithoutReplacement();
		initialized = true;
	}

</script>


<div class="graphic-container" id="line-drawings">
	<div class="line-drawing" bind:this={drawingDiv}></div>
	<div class="button-container">
		<button class="icon" on:click={() => setRandomDrawingWithoutReplacement()}>
			<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor"viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
				<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
			</svg>
		</button>
		<div class="duration-control">
			<button on:click={(e) => { setAnimationDuration(ANIMATION_DURATION * 0.1); updateActiveButton(0); } } class:active={activeButtons[0]}><span class="duration">1</span><span class="times">s</span></button>
			<button on:click={(e) => { setAnimationDuration(ANIMATION_DURATION); updateActiveButton(1); } } class:active={activeButtons[1]}><span class="duration">10</span><span class="times">s</span></button>
			<button on:click={(e) => { setAnimationDuration(ANIMATION_DURATION * 10); updateActiveButton(2); } } class:active={activeButtons[2]}><span class="duration">100</span><span class="times">s</span></button>
			<button on:click={(e) => { setAnimationDuration(ANIMATION_DURATION * 100); updateActiveButton(3); } } class:active={activeButtons[3]}><span class="duration">1000</span><span class="times">s</span></button>
		</div>

		<button class="icon" on:click={() => restartAnimation()}>
			<svg xmlns="http://www.w3.org/2000/svg"  height="22px"  fill="currentColor" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"/>
			  <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466"/>
			</svg>
		</button>
	</div>
</div>


<style>
	:global(.sketch:has(#line-drawings)) {
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
		width: min(550px, 95%);
	}
	.button-container {
		min-width: 200px;
		padding-top: 25px;
		padding-bottom: 25px;
		margin-bottom: 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
	}
	button {
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
		overflow: visible;
		padding: 0px;
	}
	button.icon {
		height: min(5vw, 22px);
		width: min(5vw, 22px);
	}
	button:hover, button.active {
		color: var(--color-1);
	}
	:global(.line-drawing) {
		position: relative;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		color: transparent;
	}
	.duration-control {
		display: flex;
		gap: 50px;
	}
	.duration {
		font-size: 20px;
		font-family: "Vollkorn";
	}
	.times {
		font-size: 14px;
		font-family: "Vollkorn";
	}

@-webkit-keyframes animate-svg-stroke-1 {
  0% {
    stroke-dashoffset: 2047.9283447265625px;
    stroke-dasharray: 2047.9283447265625px;
  }

  100% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--svg-length);
  }
}

@keyframes animate-svg-stroke-1 {
  0% {
    stroke-dashoffset: var(--svg-length);
    stroke-dasharray: var(--svg-length);
  }

  100% {
    stroke-dashoffset: 0;
    stroke-dasharray: var(--svg-length);
  }
}

:global(.line-drawing svg) {
	width: min(90vw, 450px);
	height: auto;
	margin-bottom: 45px;
	filter: drop-shadow(0 0 3px var(--svg-shadow-color));
	-webkit-animation: animate-svg-stroke-1 var(--svg-duration) linear 0s both;
	      animation: animate-svg-stroke-1 var(--svg-duration) linear 0s both;
}

:global(.line-drawing path) {
	stroke: var(--color-2);
}

</style>