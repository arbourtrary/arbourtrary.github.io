<script>
	import { lerpColorHCL } from "../utils/color.js"

	let canvas;
	let ctx;
	let canvasSize = 4000;
	let numSides;
	let polygonName;
	// https://en.wikipedia.org/wiki/List_of_polygons
	const sidesToName = {3: "triangle", 4: "square", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "enneagon", 10: "decagon", 11: "hendecagon", 12: "dodecagon", 13: "tridecagon", 14: "tetradecagon", 15: "pentadecagon", 16: "hexadecagon", 17: "heptadecagon", 18: "octadecagon", 19: "enneadecagon", 20: "icosagon", 21: "icosikaihenagon", 22: "icosikaidigon", 23: "icosikaitrigon", 24: "icosikaitetragon", 25: "icosikaipentagon", 26: "icosikaihexagon", 27: "icosikaiheptagon", 28: "icosikaioctagon", 29: "icosikaienneagon", 30: "triacontagon", 31: "triacontakaihenagon", 32: "triacontakaidigon", 33: "triacontakaitrigon", 34: "triacontakaitetragon", 35: "triacontakaipentagon", 36: "triacontakaihexagon", 37: "triacontakaiheptagon", 38: "triacontakaioctagon", 39: "triacontakaienneagon", 40: "tetracontagon", 41: "tetracontakaihenagon", 42: "tetracontakaidigon", 43: "tetracontakaitrigon", 44: "tetracontakaitetragon", 45: "tetracontakaipentagon", 46: "tetracontakaihexagon", 47: "tetracontakaiheptagon", 48: "tetracontakaioctagon", 49: "tetracontakaienneagon", 50: "pentacontagon", 51: "pentacontakaihenagon", 52: "pentacontakaidigon", 53: "pentacontakaitrigon", 54: "pentacontakaitetragon", 55: "pentacontakaipentagon", 56: "pentacontakaihexagon", 57: "pentacontakaiheptagon", 58: "pentacontakaioctagon", 59: "pentacontakaienneagon", 60: "hexacontagon", 61: "hexacontakaihenagon", 62: "hexacontakaidigon", 63: "hexacontakaitrigon", 64: "hexacontakaitetragon", 65: "hexacontakaipentagon", 66: "hexacontakaihexagon", 67: "hexacontakaiheptagon", 68: "hexacontakaioctagon", 69: "hexacontakaienneagon", 70: "heptacontagon", 71: "heptacontakaihenagon", 72: "heptacontakaidigon", 73: "heptacontakaitrigon", 74: "heptacontakaitetragon", 75: "heptacontakaipentagon", 76: "heptacontakaihexagon", 77: "heptacontakaiheptagon", 78: "heptacontakaioctagon", 79: "heptacontakaienneagon", 80: "octacontagon", 81: "octacontakaihenagon", 82: "octacontakaidigon", 83: "octacontakaitrigon", 84: "octacontakaitetragon", 85: "octacontakaipentagon", 86: "octacontakaihexagon", 87: "octacontakaiheptagon", 88: "octacontakaioctagon", 89: "octacontakaienneagon", 90: "enneacontagon", 91: "enneacontakaihenagon", 92: "enneacontakaidigon", 93: "enneacontakaitrigon", 94: "enneacontakaitetragon", 95: "enneacontakaipentagon", 96: "enneacontakaihexagon", 97: "enneacontakaiheptagon", 98: "enneacontakaioctagon", 99: "enneacontakaienneagon", 100: "hectogon"}

	// Example usage:
	const colorStops = [
	    { position: 0, color: '#B07676' },    // Red
	    { position: 0.333, color: '#D8A06B' },  // Orange
	    { position: 0.667, color: '#B0A675' },    // Yellow
	    { position: 1, color: '#6D8A64' }     // Green
	];

	const colors = []
	for (let i = 0; i < 100; i++) {
		colors.push(lerpColorHCL(colorStops, (i + 1) / 100));
	}

	function drawPolygon(ctx, centerX, centerY, numSides, radius, rotation, width, blur, fill) {
      ctx.reset()
      ctx.beginPath();

      for (let i = 0; i < numSides; i++) {
        // Calculate the angle between each point
        const angle = (i * 2 * Math.PI / numSides) + rotation;

        // Plot the point on our circle
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = width;
      ctx.strokeStyle = "#373531";
      ctx.fillStyle = fill;

      ctx.closePath();

            // Shadow
	ctx.shadowColor = "#A8A195";
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;	
	ctx.shadowBlur = 15;

	  ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();
    }

    function newPolygon(canvas, ctx) {
    	numSides = 3 + Math.round(Math.random() * 97);
		polygonName = sidesToName[numSides]

		// Parameters for the polygon
		const width = 15;
		const blur = 15;
		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = canvasSize / 2 - width / 2 - blur;
		const rotation = - Math.PI / 2;
		const fill = colors[numSides - 1]

		drawPolygon(ctx, centerX, centerY, numSides, radius, rotation, width, blur, fill);
    }

    $: if (canvas) {
		ctx = canvas.getContext("2d");
		newPolygon(canvas, ctx)
    }

    
</script>


<div class="graphic-container">
	

	<canvas width={canvasSize} height={canvasSize} bind:this={canvas}></canvas>
	{#if polygonName}
	<button on:click={() => newPolygon(canvas, ctx)}>
		<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor"viewBox="0 0 16 16">
			<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
			<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
		</svg>
	</button>
		<h2 class="polygon-name">{polygonName}</h2>
		<h3><span class="num-sides">{numSides}-<span class="suffix">GON</span></span></h3>
	{/if}
</div>


<style>
	button {
		background: transparent;
		border: none;
		height: 30px;
		width: 30px;
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
	}
	button:hover {
		color: var(--color-1);
	}
	.graphic-container {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.polygon-name {
		text-transform: uppercase;
		letter-spacing: 3px;
		font-size: min(4vw, 18px);
	}

	.num-sides {
		color: var(--color-3);
	}

	.suffix {
		font-size: 12px;
	}

	h2 {
		margin-top: 10px;
		margin-bottom: 5px;
	}

	h3 {
		margin-top: 0px;
	}

	canvas {
		width: min(600px, calc(100vw - 40px), calc(100vh - 40px));
	    height: min(600px, calc(100vw - 40px), calc(100vh - 40px));
	    aspect-ratio: 1;
        position: relative;
	    padding: 20px;
	    box-sizing: border-box;
	}
</style>