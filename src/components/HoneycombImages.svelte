<script>
	import { base } from '$app/paths'
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";

	export let music;

	let mounted = false;
	let innerWidth;
	let outerHeight;
	let honeycomb;
	let honeycombCenters = [];
	let cellX;
	let cellY;
	let cellZ;
	let data;
	let shuffled;
	let initialData;
	let n = 19;
	let gap = 5;
	let numRows = 5;
	let honeycombAspectRatio = 0.7562923524;
	let cellAspectRatio = 0.6329113924;
	let maxCellWidth = 85; // pixels

    onMount(async () => {
		const data = JSON.parse(JSON.stringify(music));
		shuffled = data.sort(() => 0.5 - Math.random());
		initialData = shuffled.slice(0, n);
		mounted = true;
    });


    $: if (mounted && (innerWidth || outerHeight)) {
    	if (honeycomb) {
    		// Honeycomb aspect-ratio is 0.7562923524 (inv. is 1.32224)
    		// So giving some leeway to use height as limiting factor (0.9 multiplier)
	    	if (honeycomb.offsetHeight < (.9 / honeycombAspectRatio * honeycomb.offsetWidth)) {
	    		cellY = honeycomb.offsetHeight / numRows;
	    		cellX = cellY * cellAspectRatio
	    	} else {
	    		cellX = Math.min(maxCellWidth, (honeycomb.offsetWidth - (numRows - 1) * gap) / numRows);
	    		cellY = cellX / cellAspectRatio;
	    	}
	    	// 7 / 12 is a value that results from my implementation of the Kensuke Koike sampling
	    	// it's the height of the inner rectangle of the hexagon (7 circles out of the 12)
	    	cellZ = 7 / 12 * cellY;
	    	// honeycomb.style.height = `${3 * cellY + 2 * Math.sqrt(3) * gap + 2 * cellZ}px`;
	    	honeycombCenters = getHoneycombCenters(cellX, cellY, cellZ, gap);
	    }
    }

	// x - cell width in pixels
	// y - cell height in pixels
	// z - height of inner rectangle of cell - a constant determined by how I made the images
	// g - gap size in pixels
    function getHoneycombCenters(x, y, z, g) {
	    const deltaX = x / 2 + g / 2;
	    const deltaY = z / 2 + Math.sqrt(3) / 2 * g + y / 2;

	    // Precalculated centers for the honeycomb
	    const honeycombCenters = [
	    	// +2 row
	    	{x: `calc(50% - ${2 * deltaX}px)`, y: `calc(50% - ${2 * deltaY}px)`},
	    	{x: `50%`, y: `calc(50% - ${2 * deltaY}px)`},
	    	{x: `calc(50% + ${2 * deltaX}px)`, y: `calc(50% - ${2 * deltaY}px)`},

	    	// +1 row
	    	{x: `calc(50% - ${3 * deltaX}px)`, y: `calc(50% - ${deltaY}px)`},
	    	{x: `calc(50% - ${deltaX}px)`, y: `calc(50% - ${deltaY}px)`},
	    	{x: `calc(50% + ${deltaX}px)`, y: `calc(50% - ${deltaY}px)`},
	    	{x: `calc(50% + ${3 * deltaX}px)`, y: `calc(50% - ${deltaY}px)`},

	    	// Middle row
	    	{x: `calc(50% - ${4 * deltaX}px)`, y: "50%"},
	    	{x: `calc(50% - ${2 * deltaX}px)`, y: "50%"},
	    	{x: "50%", y: "50%"},
	    	{x: `calc(50% + ${2 * deltaX}px)`, y: "50%"},
	    	{x: `calc(50% + ${4 * deltaX}px)`, y: "50%"},

	    	// -1 row
	    	{x: `calc(50% - ${3 * deltaX}px)`, y: `calc(50% + ${deltaY}px)`},
	    	{x: `calc(50% - ${deltaX}px)`, y: `calc(50% + ${deltaY}px)`},
	    	{x: `calc(50% + ${deltaX}px)`, y: `calc(50% + ${deltaY}px)`},
	    	{x: `calc(50% + ${3 * deltaX}px)`, y: `calc(50% + ${deltaY}px)`},

	    	// -2 row
	    	{x: `calc(50% - ${2 * deltaX}px)`, y: `calc(50% + ${2 * deltaY}px)`},
	    	{x: `50%`, y: `calc(50% + ${2 * deltaY}px)`},
	    	{x: `calc(50% + ${2 * deltaX}px)`, y: `calc(50% + ${2 *deltaY}px)`}
	    ]
	    return honeycombCenters;
	}
</script>

<svelte:window bind:innerWidth={innerWidth} bind:outerHeight={outerHeight}/>

<div id="music">
    <div class="music-container">
    	<div class="music-summary">
			<a class="music-header" href={base + "/music"}>
			    <h2 class="section-header">Music
		            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
		                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
		            </svg>
			    </h2>
			</a>
			<div class="title"><span class="title-text">Chronology</span></div>
			<p class="description">An ongoing list through all the songs I've loved over the years. I wrote a little blurb for each song evoking some memory or feeling. Should be a life-long process of expansion and discovery.</p>
		</div>
		<div class="honeycomb" bind:this={honeycomb}>
			{#if honeycombCenters && initialData}
				{#each initialData as row,i}
				<a href={base + `/music/#${row.slug}`}>
					<div 
						class="cell"
						style={`
							width: ${cellX}px;
							height: ${cellY}px;
							left: ${honeycombCenters[i].x};
							top: ${honeycombCenters[i].y};
						`}>
						<img loading="lazy" src={base + row.image} alt={`Kensuke-Koike-sampled album cover for ${row.title} by ${row.artist}`}/>
					</div>
				</a>
				{/each}
			{/if}
		</div>
	</div>
</div>


<style>
	:root {
		--cell-opacity: 0.65;
	}
	:root.dark-theme {
		--cell-opacity: 0.9;
	}
	#music {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        height: 100vh;
    }
    .music-container {
        width: min(95vw, 1100px);
        display: flex;
        flex-direction: row;
        margin: auto;
        justify-content: center;
        max-height: 100%;
    }
    .music-summary {
    	width: 375px;
    	display: flex;
		align-items: start;
		justify-content: center;
		flex-direction: column;
    }
    .music-summary p {
    	font-family: var(--serif);
    	font-size: 18px;
    	color: var(--color-1);
    	margin-left: 10px;
    }
    .music-header {
        cursor: pointer;
        text-decoration: none !important;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .music-header:hover h2 {
        color: var(--color-1);
    }
	.honeycomb {
        width: min(90vh, 90vw, 500px);
        aspect-ratio: 0.7562923524;
        max-height: 100%;
        margin: 0 auto;
        margin-right: 90px;
        position: relative;
        margin-left: 75px;
	}
	.cell {
		cursor: pointer;
		position: absolute;
		transform-origin: center;
		transform: translate(-50%, -50%) scale(0.98);
		opacity: var(--cell-opacity);
		transition: all 800ms ease;

	}
	.cell:hover {
		transform: translate(-50%, -50%) scale(1);
		opacity: 1;
	}
	.cell:hover img {
		filter: drop-shadow(0px 0px 0.5px var(--color-3));
	}
	img {
		width: 100%;
		height: 100%;
		transition: all 800ms ease;
		filter: drop-shadow(0px 0px 1px var(--color-3));
	}
    h2 svg {
        position: relative;
        margin-left: 7px;
        margin-bottom: 4px;
        height: 16px;
        width: 16px;
    }

    .title {
    	margin: 10px;
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 28px;
        font-family: var(--serif);
        position: relative;
        padding-bottom: 5px;
        margin-bottom: 5px;
    }
    .title-text {
        border-bottom: 1px solid var(--color-2);
    }
    .description {
        font-size: 18px;
        margin: 5px 0px 0 10px;
    }
    @media only screen and (max-width: 1000px) {
    	.honeycomb {
        	width: min(70vh, 70vw, 500px);
    	}
    	.music-container {
			width: min(95vw, 500px);
    	}
    	.music-summary {
    		width: 100%;
    		margin-right: 0px;
    		margin-bottom: 30px;
    	}
    	.music-summary p {
    		margin: 0 10px;
    	}
        .music-container {
        	flex-direction: column;
        }
        .honeycomb {
        	margin: 0 auto;
        }
    }
    @media only screen and (max-width: 700px) {
        h2 svg {
            position: relative;
            margin-left: 7px;
            margin-bottom: 2px;
            height: 14px;
            width: 14px;
        }
        .title {
            text-align: left;
            margin: 5px 10px;
        }
    }
    @media only screen and (max-width: 500px) {
    	.title {
            font-size: 24px;
        }
        .music-summary p {
            font-size: 16px;
        }
    }
</style>