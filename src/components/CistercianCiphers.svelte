<script>
	import { lerpColorHCL } from "../utils/color.js"
	import { clamp } from "../utils/math.js";

	let canvas;
	let ctx;
	let canvasSize = 4000;

	// Example usage:
	const colorStops = [
	    { position: 0, color: '#B07676' },    // Red
	    { position: 0.166, color: '#D8A06B' },  // Orange
	    { position: 0.333, color: '#B0A675' },    // Yellow
	    { position: 0.5, color: '#6D8A64' },     // Green
	    { position: 0.667, color: '#7594B0' },     // Blue
	    { position: 0.833, color: '#757AB0' },     // Indigo
	    { position: 1, color: '#9F79BC' }     // Purple
	];

	const colors = []
	for (let i = 0; i < 10000; i++) {
		colors.push(lerpColorHCL(colorStops, (i + 1) / 10000));
	}

	let minNumber = 0;
	let maxNumber = 9999;
	let numeral = Math.round(Math.random() * maxNumber);
	let placeValues = getPlaceValues(numeral);
	let color = colors[numeral];

	function getPlaceValues(num) {
    // Convert to positive integer
    num = Math.abs(Math.floor(num));
    
    // Get individual place values
    const ones = num % 10;
    const tens = Math.floor((num % 100) / 10);
    const hundreds = Math.floor((num % 1000) / 100);
    const thousands = Math.floor((num % 10000) / 1000);
    
    return {
        ones,
        tens,
        hundreds,
        thousands
    };
	}

	function drawCistercianCipher(num, canvas, ctx){
		console.log(num)
		if (isNaN(num)) {
			return;
		}
		numeral = num;
		placeValues = getPlaceValues(numeral);
		color = colors[num];
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    // ctx.globalAlpha = 1;
    ctx.beginPath();

    // the Cistercian system only capable of 1-9999, but I added 0 and negative numbers to -9999 because why not?
    // want it here to clear the canvas on error too.
    // if(num > 9999 || num < -9999 || num == '' || num == undefined || num == null ) return false;
    
    let lineWidth = .015 * canvasWidth;
    ctx.lineWidth = lineWidth

    // the middle line is always present, might as well draw the line here
    ctx.moveTo(canvasWidth * 0.5, canvasHeight * 0.1);
    ctx.lineTo(canvasWidth * 0.5, canvasHeight * 0.9);
    

    /* 
    * all the steps for all the lines
    * the first level array represents the local value [0] being ones and [3] being thousands
    * the second level array represents the value of that local value, for example [1][2] is 300
    * the third level array represents coordinates on the canvas. [0] is always a moveTo value the 1-3 are lineTo values
    * so the number[1][2][1] says "we are drawing the local value 300 now, after we moved to canvasWidth * 0.5, canvasHeight * 0.1 we draw a line to canvasWidth * 0.3, canvasHeight * 0.3"
    */
    let numbers  = 
    [
        [ /* ones */
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.1]],
                    [[canvasWidth * 0.5, canvasHeight * 0.3],[canvasWidth * 0.7, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.3],[canvasWidth * 0.7, canvasHeight * 0.1]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.1],[canvasWidth * 0.5, canvasHeight * 0.3]],
                    [[canvasWidth * 0.7, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.3],[canvasWidth * 0.7, canvasHeight * 0.3],[canvasWidth * 0.7, canvasHeight * 0.1]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.1],[canvasWidth * 0.7, canvasHeight * 0.3],[canvasWidth * 0.5, canvasHeight * 0.3]]
                    
        ],[ /* tens */
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.1]],
                    [[canvasWidth * 0.5, canvasHeight * 0.3],[canvasWidth * 0.3, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.3],[canvasWidth * 0.3, canvasHeight * 0.1]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.1],[canvasWidth * 0.5, canvasHeight * 0.3]],
                    [[canvasWidth * 0.3, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.3]],
                    [[canvasWidth * 0.5, canvasHeight * 0.3],[canvasWidth * 0.3, canvasHeight * 0.3],[canvasWidth * 0.3, canvasHeight * 0.1]],
                    [[canvasWidth * 0.5, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.1],[canvasWidth * 0.3, canvasHeight * 0.3],[canvasWidth * 0.5, canvasHeight * 0.3]]
                    
        ],[ /* hundreds  */
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.9]],
                    [[canvasWidth * 0.5, canvasHeight * 0.7],[canvasWidth * 0.7, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.7],[canvasWidth * 0.7, canvasHeight * 0.9]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.9],[canvasWidth * 0.5, canvasHeight * 0.7]],
                    [[canvasWidth * 0.7, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.7],[canvasWidth * 0.7, canvasHeight * 0.7],[canvasWidth * 0.7, canvasHeight * 0.9]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.9],[canvasWidth * 0.7, canvasHeight * 0.7],[canvasWidth * 0.5, canvasHeight * 0.7]]

        ],[ /* thousands */
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.9]],
                    [[canvasWidth * 0.5, canvasHeight * 0.7],[canvasWidth * 0.3, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.7],[canvasWidth * 0.3, canvasHeight * 0.9]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.9],[canvasWidth * 0.5, canvasHeight * 0.7]],
                    [[canvasWidth * 0.3, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.7]],
                    [[canvasWidth * 0.5, canvasHeight * 0.7],[canvasWidth * 0.3, canvasHeight * 0.7],[canvasWidth * 0.3, canvasHeight * 0.9]],
                    [[canvasWidth * 0.5, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.9],[canvasWidth * 0.3, canvasHeight * 0.7],[canvasWidth * 0.5, canvasHeight * 0.7]]
        ]   
    ];

    let stringNum = num.toString();
    let digit = 0;

    if(num<0)
    { // if the number is negative we get rid of the "-"
        stringNum = stringNum.substring(1);
        
        // also draw the marking of being negative
        ctx.moveTo(canvasWidth * 0.3, canvasHeight * .5);
        ctx.lineTo(canvasWidth * 0.7, canvasHeight * .5);
    } 

    stringNum = stringNum.padStart(4,"0");

    // this is where the magic happens
    // just looping the input char by char and spreading the coordinates in moveTo and lineTo
    for(let i = 3; i >= 0; i--)
    {
        digit = parseInt(stringNum.charAt(3-i));

        if(digit === 0) continue; // they didn't mark zero
        
        ctx.moveTo(...numbers[i][digit-1][0]);

        for(let j=1; j < numbers[i][digit-1].length; j++)
        {
            ctx.lineTo(...numbers[i][digit-1][j]);
        }
        
    }
    
 		// Shadow
		ctx.shadowColor = "#F5F2EB";
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;	
		ctx.shadowBlur = 5;
    ctx.globalAlpha = 0.5;

    ctx.stroke();

    return true;
	}


	function incrementNumeral() {
		numeral = parseInt(numeral);
		numeral = clamp(numeral + 1, minNumber, maxNumber);
	}

	function decrementNumeral() {
		numeral = parseInt(numeral);
		numeral = clamp(numeral - 1, minNumber, maxNumber);
	}

    $: if (canvas) {
			ctx = canvas.getContext("2d");
			drawCistercianCipher(numeral, canvas, ctx)
    }

    
</script>


<div class="graphic-container">
	<div class="canvas-container">
		<div class="annotation ones">{placeValues.ones}</div>
		<div class="annotation tens">{placeValues.tens * 10}</div>
		<div class="annotation hundreds">{placeValues.hundreds * 100}</div>
		<div class="annotation thousands">{placeValues.thousands * 1000}</div>
		<canvas width={canvasSize} height={canvasSize} bind:this={canvas}></canvas>
	</div>
	<div class="button-container">
		<button on:click={() => { decrementNumeral(); drawCistercianCipher(numeral, canvas, ctx) } }>
			<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
			</svg>
		</button>
		<input class="numeral" type="text" pattern="\d*" maxlength="4" bind:value={numeral} style={`color: ${color}`}>
		<button on:click={() => { incrementNumeral(); drawCistercianCipher(numeral, canvas, ctx) } }>
			<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor" viewBox="0 0 16 16">
	  		<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
			</svg>
		</button>
	</div>
	<button class="shuffle" on:click={() => drawCistercianCipher(Math.round(Math.random() * maxNumber), canvas, ctx)}>
			<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor"viewBox="0 0 16 16">
				<path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
				<path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
			</svg>
		</button>
</div>


<style>
	button {
		background: transparent;
		border: none;
		width: min(30px, 4vw);
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
		overflow: visible;
		padding: 0px;
		align-items: center;
		justify-content: center;
  	display: flex;
	}
	button:hover {
		color: var(--color-1);
	}
	.button-container {
    min-width: 200px;
    padding-top: 0px;
    padding-bottom: 15px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 5px;
  }
  .shuffle {
  	padding-bottom: 25px;
    margin-bottom: 60px;
  }
	.graphic-container {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.canvas-container {
		position: relative;
		margin: 20px;
		margin-bottom: 0px;
	}
	.numeral {
		text-transform: uppercase;
		font-size: min(6vw, 30px);
		font-weight: normal;
		font-family: "Vollkorn";
		opacity: 0.7;
		margin: 0px;
		z-index: 100;
		width: min(18vw, 90px);
	}
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
	  -webkit-appearance: none;
	  margin: 0;
	}

	input[type="text"]:focus {
		border-color: none;
	  outline: 0;
	  -webkit-box-shadow: none;
	  box-shadow: none;
	}

	/* Firefox */
	input[type=text] {
	  -moz-appearance: textfield;
	  background: transparent;
	  text-align: center;
	  border: none;
	  border-bottom: 1px solid var(--color-3);
	}
	.annotation {
		color: var(--color-3);
		position: absolute;
		z-index: 10;
		font-size: min(3vw, 15px);
		font-family: "Vollkorn";
		width: 40px;
	}
	.ones {
		top: 20%;
		right: 15%;
		text-align: left;
		transform: translate(50%, -50%);
	}
	.tens {
		top: 20%;
		left: 15%;
		text-align: right;
		transform: translate(-50%, -50%);
	}
	.hundreds {
		top: 80%;
		right: 15%;
		text-align: left;
		transform: translate(50%, -50%);
	}
	.thousands {
		top: 80%;
		left: 15%;
		text-align: right;
		transform: translate(-50%, -50%);
	}

	canvas {
		width: min(600px, calc(100vw - 40px), calc(100vh - 40px));
    height: min(600px, calc(100vw - 40px), calc(100vh - 40px));
    aspect-ratio: 1;
    position: relative;
    box-sizing: border-box;
	  z-index: 5;
	}
</style>