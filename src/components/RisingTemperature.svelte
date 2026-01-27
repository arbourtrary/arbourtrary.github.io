<script>
	import { clamp } from "../utils/math.js";

	const data = [
    [0.0, "nonexistent"],
    [0.05, "real"],
    [0.10, "real"],
    [0.15, "real"],
    [0.20, "real"],
    [0.25, "real"],
    [0.30, "real"],
    [0.35, "reality"],
    [0.40, "reality"],
    [0.45, "Real"],
    [0.50, "real"],
    [0.55, "relevant"],
    [0.60, "Real"],
    [0.65, "real"],
    [0.70, "Real"],
    [0.75, "Worsening"],
    [0.80, "real"],
    [0.85, "devastating"],
    [0.90, "real"],
    [0.95, "real"],
    [1.00, "devastating"],
    [1.05, "Debilitating"],
    [1.10, "Real!"],
    [1.15, "REAL"],
    [1.20, "devastating"],
    [1.25, "Worsening"],
    [1.30, "Wrecking"],
    [1.35, "Debacle"],
    [1.40, "catastrophic"],
    [1.45, "Devastating"],
    [1.50, "insidious"],
    [1.55, "ravaging"],
    [1.60, "destroying"],
    [1.65, "Escalating"],
    [1.70, "chaotic"],
    [1.75, "wreaking"],
    [1.80, "Real!"],
    [1.85, "grimmanent"],
    [1.90, "Ignoring"],
    [1.95, 'Deporable'],
    [2.00, "Critcal"],
    [2.05, "real"],
    [2.10, "real"],
    [2.15, "Dire"],
    [2.20, "gravely"],
    [2.25, "shocking"],
    [2.30, "absence"],
    [2.35, "Destroying"],
    [2.40, "IMPORTANT"],
    [2.45, "unacceptable"],
    [2.50, "REALITY"]
  ];

    const counts = data.reduce((acc, [_, val]) => {
    const normalized = val.toLowerCase().replace(/[^a-z]/g, '');
    acc[normalized] = (acc[normalized] || 0) + 1;
    return acc;
  }, {});
  
  const sortedCounts = Object.entries(counts).sort((a, b) => {
    if (b[1] !== a[1]) {
      return b[1] - a[1];
    }
    return a[0].localeCompare(b[0]);
  });

  const responses = new Map(data);
  const temperatures = data.map(d => d[0]);
  
  let selectedTemp = 1.55;
  let hoveredTemp = null;
  let barsEl;

  let minNumber = 0;
  let maxNumber = 2.5;
  let increment = .05;

	function incrementNumeral() {
		selectedTemp = Math.round(clamp(selectedTemp + increment, minNumber, maxNumber) * 100) / 100;
	}

	function decrementNumeral() {
		selectedTemp = Math.round(clamp(selectedTemp - increment, minNumber, maxNumber) * 100) / 100;
	}
  
  function getBarColor(temp) {
    const t = 1; //temp / 2.5;
    const lightness = 70 - t * 40;
    const saturation = 50 + t * 30;
    return `hsl(0, ${saturation}%, ${lightness}%)`;
  }
  
  function getTempFromX(clientX) {
    if (!barsEl) return null;
    const rect = barsEl.getBoundingClientRect();
    const x = clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const index = Math.round(ratio * (temperatures.length - 1));
    return temperatures[index];
  }
  
  function handlePointerMove(e) {
    hoveredTemp = getTempFromX(e.clientX);
  }
  
  function handlePointerLeave() {
    hoveredTemp = null;
  }
  
  function handleClick(e) {
    const temp = getTempFromX(e.clientX);
    if (temp !== null) {
      selectedTemp = temp;
    }
  }
  
  let isDragging = false;
  
  function handlePointerDown(e) {
    isDragging = true;
    handleClick(e);
  }
  
  function handlePointerUp() {
    isDragging = false;
  }
  
  function handleDragMove(e) {
    if (isDragging) {
      const temp = getTempFromX(e.clientX);
      if (temp !== null) {
        selectedTemp = temp;
      }
    }
    handlePointerMove(e);
  }
  
  function isMajorMark(temp) {
    return Math.abs(temp % 0.5) < 0.001;
  }
  
  $: displayTemp = hoveredTemp !== null ? hoveredTemp : selectedTemp;
  $: displayResponse = displayTemp !== null ? responses.get(displayTemp) : null;
$: if (sortedCounts) {
    const div = document.querySelector("#dynamic-graphic");
    if (div) {
        const maxCount = Math.max(...sortedCounts.map(item => item[1]));
        
        const html = sortedCounts.map(([word, count]) => {
            const bars = Array(count).fill(0).map(() => '<div class="tally-bar"></div>').join('');
            return `
                <div class="tally-bar-row">
                    <div class="tally-bars-container">
                        ${bars}
                    </div>
                    <div class="tally-word">${word} <span style="color: var(--color-2)">(${count})</span></div>
                </div>
            `;
        }).join('');
        
        div.innerHTML = `<p style="margin-top: 20px; margin-bottom: 5px;"><b>Data</b></p>${html}`;
    }
}
</script>

<svelte:window on:pointerup={handlePointerUp} />

<div class="graphic-container">
	  <div class="button-container">
		<button on:click={() => { decrementNumeral() } }>
			<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor" viewBox="0 0 16 16">
			  <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8"/>
			</svg>
		</button>
		<button on:click={() => { incrementNumeral() } }>
			<svg xmlns="http://www.w3.org/2000/svg" height="22px" fill="currentColor" viewBox="0 0 16 16">
	  		<path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
			</svg>
		</button>
	</div>
  <div 
    class="bars-area"
    on:pointermove={handleDragMove}
    on:pointerleave={handlePointerLeave}
    on:pointerdown={handlePointerDown}
  >


    <div class="bars" bind:this={barsEl}>
      {#each temperatures as temp}
        <div
          class="bar"
          class:major={isMajorMark(temp)}
          class:selected={selectedTemp === temp}
          class:hovered={hoveredTemp === temp}
          style="--bar-color: {getBarColor(temp)};"
        ></div>
      {/each}
    </div>
  </div>
  
  <div class="labels">
    {#each temperatures as temp}
      <span class="label-slot">
        {#if isMajorMark(temp)}
          <span class="label">{temp}</span>
        {/if}
      </span>
    {/each}
  </div>
  
  <div class="response">
    <span class="prefix">Climate change is&nbsp;</span>
    <span class="word">{@html displayResponse || ''}</span>
    <span class="prefix">&nbsp;at&nbsp;</span>
    <span class="word">
    	<span style="font-size:.9rem">&#65122;</span>{displayTemp}<span style="font-size:.9rem">&deg;C</span>
    </span>
  </div>
</div>

<style>
  .graphic-container {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 60px;
	}

	button {
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--color-3);
		transition: all 200ms linear;
		overflow: visible;
		padding: 0px;
		align-items: center;
		justify-content: center;
  	display: flex;
	}
	.monospace {
		font-family: var(--monospace);
		font-size: 1.3rem;
	}
	button:hover {
		color: var(--color-1);
	}
	.button-container {
		width: 348px;
    padding-top: 0px;
    padding-bottom: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 5px;
  }

  .bars-area {
    padding: 30px 0;
    padding-top: 0px;
    cursor: pointer;
    touch-action: none;
    user-select: none;
  }
  
  .bars {
    display: flex;
    align-items: center;
    gap: 3.5px;
  }
  
.bar {
  width: 2px;
  height: 40px;
  margin-left: 0.5px;
  margin-right: 0.5px;
  position: relative;
}
.bar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--color-3);
  opacity: 0.3;
}
.bar::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--red);
  opacity: 0;
}
  
  .bar.major {
    height: 55px;
  }
  
  .bar.hovered::after,
  .bar.selected::after {
    opacity: 1;
    width: 3px;
    margin-left: 0px;
    margin-right: 0px;
    background: var(--red);
  }
  
  .labels {
    display: flex;
    gap: 4.5px;
    position: relative;
    top: -25px;
  }
  
  .label-slot {
    width: 2px;
    display: flex;
    justify-content: center;
  }
  
  .label {
    font-size: 1.2rem;
    color: var(--color-2);
    white-space: nowrap;
  }
  
  .response {
    margin-top: 2rem;
    font-size: 1.4rem;
    line-height: 1.5;
    display: flex;
  }
  
  .prefix {
    color: var(--color-2);
  }
  
  .word {
    color: var(--red);
    overflow-x: visible;
    text-align: left;
    font-weight: bold;
    text-decoration: underline;
    text-decoration-color: var(--red);
    text-decoration-thickness: 0.5px;
    text-underline-offset: 3px;
  }


:global(.tally-bar-row) {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
	font-family: var(--serif);
	color: var(--color-1);
	gap: 12px;
}

:global(.tally-bars-container) {
    display: flex;
    gap: 4px;
    min-height: 20px;
    align-items: center;
    min-width: 110px;
	justify-content: end;    
}

:global(.tally-bar) {
    width: 2px;
    height: 20px;
    background: var(--red);
}

:global(.tally-word) {
    font-weight: 500;
    min-width: 140px;
}

:global(.tally-count) {
    font-size: 12px;
    font-weight: 600;
    min-width: 24px;
    text-align: right;
}
  @media (max-width: 450px) {
  	.response {
  		font-size: 1.2rem;
  	}
  }
</style>