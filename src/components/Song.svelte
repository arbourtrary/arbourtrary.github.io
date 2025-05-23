<script>
	import { marked } from "marked";
	import { onMount } from "svelte";
	import { base } from '$app/paths'

	marked.use({
	  mangle: false,
	  headerIds: false
	});

	export let song = {};
	export let loading = 'eager';

	let final;
	let image = song?.image;
	let description;

	onMount(() => {
		description = song.description;
	})
	// let backgroundColor = 'transparent';
	// let clippedCanvas;
	// let imageLoaded = false;
	// let imageDrawn = false;

	// async function processImage(layout="pack", bgOpacity=0) {
	// 	const canvas = document.createElement("canvas");
		
	// 	const ctx = canvas.getContext('2d');
	// 	const finalCtx = final.getContext('2d');
		
	// 	const img = new window.Image();
		
	// 	img.onload = () => {
	// 		// Set canvas size to match image
	// 		canvas.width = img.width;
	// 		canvas.height = img.height;

	// 		// const parentWidth = canvas.parentElement.offsetWidth;
	// 		// const widthRatio = canvas.offsetWidth / parentWidth;

	// 		const sizeFactor = 50 / 2785 // 0.000773298067	from silhouette.webp
	// 		const dotSize = sizeFactor * img.width /// widthRatio;
			
	// 		const finalX1 = canvas.width * .50 - 2 * dotSize * Math.sqrt(3) - dotSize / 2 - 1;
	// 		const finalX2 = canvas.width * .50 + 2 * dotSize * Math.sqrt(3) + dotSize / 2 + 1;

	// 		const finalY1 = canvas.height * .50 - 6.5 * dotSize - 1;
	// 		const finalY2 = canvas.height * .50 + 6 * dotSize + 1;

	// 		const finalWidth = finalX2 - finalX1;
	// 		const finalHeight = finalY2 - finalY1;
	// 		final.width = finalWidth;
	// 		final.height = finalHeight;

	// 		// Create a temporary canvas for the original image
	// 		const tempCanvas = document.createElement('canvas');
	// 		tempCanvas.width = img.width;
	// 		tempCanvas.height = img.height;
	// 		const tempCtx = tempCanvas.getContext('2d');
			
	// 		// Draw the original image to temp canvas
	// 		tempCtx.drawImage(img, 0, 0);

	// 		// Clear main canvas with background color
	// 		ctx.clearRect(0, 0, canvas.width, canvas.height);
	// 		ctx.fillStyle = backgroundColor;
	// 		ctx.fillRect(0, 0, canvas.width, canvas.height);
	// 		ctx.globalAlpha = bgOpacity; //0.6
	// 		ctx.drawImage(img, 0, 0);
	// 		ctx.globalAlpha = 1;
			
	// 		// Calculate grid
	// 		// let dotSpacing = 110;
	// 		// const rows = Math.floor(canvas.height / dotSpacing);
	// 		// const cols = Math.floor(canvas.width / dotSpacing);
	// 		// const gridCenters = [];
	// 		// Complete grid
	// 		// For each dot position
	// 		// for (let y = 0; y < rows; y++) {
	// 		//	 for (let x = 0; x < cols; x++) {
	// 		//			 const centerX = x * dotSpacing + (dotSpacing / 2);
	// 		//			 const centerY = y * dotSpacing + (dotSpacing / 2);
	// 		//			 gridCenters.push({x: centerX, y: centerY});
	// 		//	 }
	// 		// }

	// 		const scatterCenters = [
	// 			// -4 column
	// 			// {x: canvas.width * .18, y: canvas.height * .10},
	// 			// {x: canvas.width * .18, y: canvas.height * .16},
	// 			{x: canvas.width * .18, y: canvas.height * .22},
	// 			{x: canvas.width * .18, y: canvas.height * .28},
	// 			{x: canvas.width * .18, y: canvas.height * .34},
	// 			{x: canvas.width * .18, y: canvas.height * .40},
	// 			{x: canvas.width * .18, y: canvas.height * .46},
	// 			{x: canvas.width * .18, y: canvas.height * .52},
	// 			{x: canvas.width * .18, y: canvas.height * .58},
	// 			{x: canvas.width * .18, y: canvas.height * .64},

	// 			// -3 column
	// 			// {x: canvas.width * .26, y: canvas.height * (.10 - 0.025)},
	// 			// {x: canvas.width * .26, y: canvas.height * (.16 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.22 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.28 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.34 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.40 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.46 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.52 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.58 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.64 - 0.025)},
	// 			{x: canvas.width * .26, y: canvas.height * (.70 - 0.025)},

	// 			// - 2 column
	// 			// {x: canvas.width * .34, y: canvas.height * .10},
	// 			{x: canvas.width * .34, y: canvas.height * .16},
	// 			{x: canvas.width * .34, y: canvas.height * .22},
	// 			{x: canvas.width * .34, y: canvas.height * .28},
	// 			{x: canvas.width * .34, y: canvas.height * .34},
	// 			{x: canvas.width * .34, y: canvas.height * .40},
	// 			{x: canvas.width * .34, y: canvas.height * .46},
	// 			{x: canvas.width * .34, y: canvas.height * .52},
	// 			{x: canvas.width * .34, y: canvas.height * .58},
	// 			{x: canvas.width * .34, y: canvas.height * .64},
	// 			{x: canvas.width * .34, y: canvas.height * .70},

	// 			// -1 column
	// 			// {x: canvas.width * .42, y: canvas.height * (.10 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.16 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.22 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.28 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.34 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.40 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.46 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.52 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.58 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.64 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.70 - 0.025)},
	// 			{x: canvas.width * .42, y: canvas.height * (.76 - 0.025)},

	// 			// middle column
	// 			{x: canvas.width * .50, y: canvas.height * .10},
	// 			{x: canvas.width * .50, y: canvas.height * .16},
	// 			{x: canvas.width * .50, y: canvas.height * .22},
	// 			{x: canvas.width * .50, y: canvas.height * .28},
	// 			{x: canvas.width * .50, y: canvas.height * .34},
	// 			{x: canvas.width * .50, y: canvas.height * .40},
	// 			{x: canvas.width * .50, y: canvas.height * .46},
	// 			{x: canvas.width * .50, y: canvas.height * .52},
	// 			{x: canvas.width * .50, y: canvas.height * .58},
	// 			{x: canvas.width * .50, y: canvas.height * .64},
	// 			{x: canvas.width * .50, y: canvas.height * .70},
	// 			{x: canvas.width * .50, y: canvas.height * .76},

	// 			// + 1 column
	// 			// {x: canvas.width * .58, y: canvas.height * (.10 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.16 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.22 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.28 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.34 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.40 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.46 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.52 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.58 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.64 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.70 - 0.025)},
	// 			{x: canvas.width * .58, y: canvas.height * (.76 - 0.025)},

	// 			// + 2 column
	// 			// {x: canvas.width * .66, y: canvas.height * .10},
	// 			{x: canvas.width * .66, y: canvas.height * .16},
	// 			{x: canvas.width * .66, y: canvas.height * .22},
	// 			{x: canvas.width * .66, y: canvas.height * .28},
	// 			{x: canvas.width * .66, y: canvas.height * .34},
	// 			{x: canvas.width * .66, y: canvas.height * .40},
	// 			{x: canvas.width * .66, y: canvas.height * .46},
	// 			{x: canvas.width * .66, y: canvas.height * .52},
	// 			{x: canvas.width * .66, y: canvas.height * .58},
	// 			{x: canvas.width * .66, y: canvas.height * .64},
	// 			{x: canvas.width * .66, y: canvas.height * .70},

	// 			// + 3 column
	// 			// {x: canvas.width * .74, y: canvas.height * (.10 - 0.025)},
	// 			// {x: canvas.width * .74, y: canvas.height * (.16 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.22 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.28 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.34 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.40 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.46 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.52 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.58 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.64 - 0.025)},
	// 			{x: canvas.width * .74, y: canvas.height * (.70 - 0.025)},

	// 			// + 4 column
	// 			// {x: canvas.width * .82, y: canvas.height * .10},
	// 			// {x: canvas.width * .82, y: canvas.height * .16},
	// 			{x: canvas.width * .82, y: canvas.height * .22},
	// 			{x: canvas.width * .82, y: canvas.height * .28},
	// 			{x: canvas.width * .82, y: canvas.height * .34},
	// 			{x: canvas.width * .82, y: canvas.height * .40},
	// 			{x: canvas.width * .82, y: canvas.height * .46},
	// 			{x: canvas.width * .82, y: canvas.height * .52},
	// 			{x: canvas.width * .82, y: canvas.height * .58},
	// 			{x: canvas.width * .82, y: canvas.height * .64},
	// 		]


	// 		const compressedCenters = [
	// 			// - 4 column
	// 			// {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
	// 			// {x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
	// 			{x: canvas.width * .50 - 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},

	// 			// - 3 column
	// 			// {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
	// 			// {x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
	// 			{x: canvas.width * .50 - 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},

	// 			// - 2 column
	// 			// {x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
	// 			{x: canvas.width * .50 - 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 10},

	// 			// - 1 column
	// 			// {x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},
	// 			{x: canvas.width * .50 - (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 11},

	// 			// middle column
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 10},
	// 			{x: canvas.width * .50, y: canvas.height * .50 - 5.5 * dotSize + dotSize * 11},

	// 			// + 1 column
	// 			// {x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},
	// 			{x: canvas.width * .50 + (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 11},

	// 			// + 2 column
	// 			// {x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
	// 			{x: canvas.width * .50 + 2 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 10},

	// 			// + 3 column
	// 			// {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2},
	// 			// {x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 1},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 2},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 3},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 4},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 5},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 6},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 7},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 8},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 9},
	// 			{x: canvas.width * .50 + 3 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize - dotSize/2 + dotSize * 10},

	// 			// + 4 column
	// 			// {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize},
	// 			// {x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 1},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 2},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 3},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 4},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 5},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 6},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 7},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 8},
	// 			{x: canvas.width * .50 + 4 * (dotSize/2) * Math.sqrt(3), y: canvas.height * .50 - 5.5 * dotSize + dotSize * 9},
	// 		]

	// 		for (let i = 0; i < scatterCenters.length; i++) {
	// 				// Create a temporary canvas for each dot
	// 			const scatterCenterX = scatterCenters[i].x
	// 			const scatterCenterY = scatterCenters[i].y

	// 			// Compressed center
	// 			const compressedCenterX = compressedCenters[i].x
	// 			const compressedCenterY = compressedCenters[i].y

	// 			const dotCanvas = document.createElement('canvas');
	// 			dotCanvas.width = dotSize;
	// 			dotCanvas.height = dotSize;
	// 			const dotCtx = dotCanvas.getContext('2d');
				
	// 			// Set up the circular clip on the dot canvas
	// 			dotCtx.beginPath();
	// 			dotCtx.arc(dotSize/2, dotSize/2, dotSize/2, 0, Math.PI * 2);
	// 			dotCtx.clip();

	// 			// Draw the section of the original image into the dot
	// 			dotCtx.drawImage(
	// 					tempCanvas, 
	// 					scatterCenterX - dotSize/2, 
	// 					scatterCenterY - dotSize/2, 
	// 					dotSize, 
	// 					dotSize,
	// 					0,
	// 					0,
	// 					dotSize,
	// 					dotSize
	// 			);
	// 			if (layout === "pack") {
	// 				// Draw the dot onto the main canvas
	// 				ctx.drawImage(
	// 						dotCanvas,
	// 						compressedCenterX - dotSize/2,
	// 						compressedCenterY - dotSize/2
	// 				);
	// 			} else if (layout === "scatter") {
	// 				// Draw the dot onto the main canvas
	// 				ctx.drawImage(
	// 						dotCanvas,
	// 						scatterCenterX - dotSize/2,
	// 						scatterCenterY - dotSize/2
	// 				);
	// 			} 
	// 		}
	// 		imageLoaded = true;

	// 		// Want to clip something from the ctx draw into a smaller clippedCanvas
	// 		const clippedCanvas = document.createElement('canvas');
	// 		const clippedWidth = finalWidth;
	// 		const clippedHeight = finalHeight;
	// 		clippedCanvas.width = clippedWidth;
	// 		clippedCanvas.height = clippedHeight;
	// 		const clippedCtx = clippedCanvas.getContext('2d');
			
	// 		// Set up the circular clip on the clipped canvas
	// 		ctx.beginPath();
	// 		ctx.rect(finalX1, finalY1, finalWidth, finalHeight);
	// 		ctx.clip();

	// 		// Draw the section of the original image into the clipped
	// 		clippedCtx.drawImage(
	// 			canvas, 
	// 			.5 * canvas.width - clippedWidth / 2, 
	// 			.5 * canvas.height - dotSize * 6, 
	// 			clippedWidth, 
	// 			clippedHeight,
	// 			0,
	// 			0,
	// 			clippedWidth,
	// 			clippedHeight
	// 		);

	// 		finalCtx.drawImage(
	// 			clippedCanvas,
	// 			0, 
	// 			0,
	// 		);
	// 		imageDrawn = true;
	// 	};
		
	// 	img.onerror = (err) => {
	// 		console.error('Error loading image:', err);
	// 	};

	// 	img.src = image;
	// }

	// // Convert canvas to image
	// $: if (final) {
	// 	final.addEventListener("click", function(e) {
	// 	    var dataURL = final.toDataURL("image/webp", 1.0);
	// 	    downloadImage(dataURL, image.replace(".webp", ".webp"));
	// 	});
	// }

	// // Save | Download image
	// function downloadImage(data, filename) {
	//     var a = document.createElement('a');
	//     a.href = data;
	//     a.download = filename;
	//     document.body.appendChild(a);
	//     a.click();
	// }

	// $: if (image && final && !imageLoaded) {
	// 	processImage("pack", 0);
	// }
</script>


<div class="song" id={`${song.slug}`}>
	<a href={song.link} target="_blank">
		<!-- <img class="placeholder" alt="song placeholder" src="/images/songs/placeholder.webp"/> -->
		<!-- <canvas bind:this={final}/> -->
		<figure>
			<img loading={loading} class="cover" alt="song cover" src={base + image}/>
		</figure>
	</a>
	<div class="song-info">
		<a href={song.link} target="_blank">
			<h3>{@html song.title}</h3>
		</a>
		<h4>{@html song.artist}</h4>
		{#if description}
			<p>{@html description}</p>
		{/if}
	</div>
</div>


<style>
	:root {
		--song-opacity: 0.6;
	}
	:root.dark-theme {
		--song-opacity: 0.8;
	}
	.song {
		margin: auto 10px;
		text-decoration: none;
		display: flex;
		flex-direction: row;
		gap: 15px;
		padding-top: 45px;
		border-top: 0.5px solid var(--color-2);
	}
	.song a {
		position: relative;
		text-decoration: none;
		color: var(--color-1);
		cursor: pointer;
	}
	.song a:hover h3 {
		text-decoration: underline;
	}
    :global(.song-info > p a) {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-2);
        text-decoration-thickness: 0.5px;
        text-underline-offset: 3px;
    }
    :global(.song-info > p a:hover) {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-1);
        text-decoration-thickness: 1px;
    }
	.song figure {
		min-height: 130px;
		width: 90px;
		position: relative;
		margin: 0;
		padding: 0;
	}
/*	.song .placeholder {
		position: absolute;
		top: 0;
		z-index: 0;
	}*/
	.song .cover {
		position: absolute;
		top: 0;
		z-index: 1;
	}
	.song img {
		width: 90px;
		opacity: var(--song-opacity);
		transition: all 500ms ease-out;
		filter: drop-shadow(0px 0px 0px var(--color-1));
	}
	.song img:hover {
		opacity: 1;
	}
	.song h3, .song h4 {
		font-family: var(--serif);
		color: var(--color-1);
	}
	.song h3 {
		margin-bottom: 0px;
		font-weight: bold;
		margin-top: 0px;
		font-size: 24px;
		line-height: 1;
	}
	.song h4 {
		margin-top: 5px;
		font-size: 20px;
		margin-bottom: 5px;
	}
	.song p {
		line-height: 1.3;
	    font-family: var(--serif);
	    color: var(--color-1);
	    font-size: 18px;
	    margin-top: 10px;
	    margin-bottom: 0px;
	}
	@media only screen and (max-width: 600px) {
		.song {
			padding-top: 30px;
		}
		.song figure, .song img {
			max-width: 80px;
		}
		.song h3 {
			font-size: 22px;
		}
		.song h4 {
			font-size: 18px;
		}
		.song p {
			font-size: 16px;
		}

	}
</style>