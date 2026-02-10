<script>
  import MASTER from '../data/sketches/nyt-crossword-sparse.json';
  let gridKey      = '21x21';
  let selectedChar = '#';
  let filterAZ     = true;

  $: gridData   = MASTER[gridKey];
  $: size       = gridData.grid_size;
  $: fileCount  = gridData.file_count;

  $: charList = Object.keys(gridData.characters)
    .filter(ch => {
      const charInfo = gridData.characters[ch];
      if (charInfo.m === 0) return false;
      if (!filterAZ) return true;
      if (ch === '#') return true;
      return /^[A-Z]$/.test(ch);
    })
    .sort((a, b) => {
      if (a === '#') return -1;
      if (b === '#') return  1;
      return a.localeCompare(b);
    });

  $: if (!gridData.characters[selectedChar]) selectedChar = '#';

  $: charData = gridData.characters[selectedChar];
  $: maxAbs   = charData.m;                                    

  $: rows = (function() {
    const sparse = charData.a;
    const total  = size * size;

    const flat = new Array(total).fill(0);
    for (const k in sparse) flat[+k] = sparse[k];

    const out = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        const val     = flat[r * size + c];
        const opacity = maxAbs > 0 ? (val / maxAbs) : 0;
        row.push({ r, c, val, opacity });
      }
      out.push(row);
    }
    return out;
  })();

  $: gridSizeVar = `--grid-size: ${size};`;

  $: charLabel = selectedChar === '#' ? 'Empty (□)' : `&ldquo;${selectedChar}"`;
</script>

<!-- ── markup ── -->
<div class="container">
  
<!-- controls -->
  <div class="controls">
    <div class="radio-group">
      <label>
        <input type="radio" bind:group={gridKey} value="15x15" />
        <span class="pill">15×15</span>
      </label>
      <label>
        <input type="radio" bind:group={gridKey} value="21x21" />
        <span class="pill">21×21</span>
      </label>
    </div>
<!-- 
    <label class="checkbox-label">
      <input type="checkbox" bind:checked={filterAZ} />
      <span class="checkbox-text">A-Z Only</span>
    </label> -->
  </div>
  <!-- heatmap grid -->
  <div class="grid-container" style={gridSizeVar}>
    <div class="grid">
      {#each rows as row}
        {#each row as cell}
          <div
            class="cell"
            class:empty-cell={selectedChar === '#'}
            style="background:rgb({Math.round(255 * (1 - cell.opacity))},{Math.round(255 * (1 - cell.opacity))},{Math.round(255 * (1 - cell.opacity))});"
          >
            {#if selectedChar !== '#'}
              <span class="cell-letter" style="opacity:{cell.opacity};">{selectedChar}</span>
            {/if}
            <div class="tip">[{cell.r + 1},{cell.c + 1}] {cell.val.toFixed(2)}%</div>
          </div>
        {/each}
      {/each}
    </div>
  </div>

  <!-- character palette -->
  <div class="palette-wrap">
    <!-- <div class="palette-label">Character</div> -->
    <div class="palette">
      {#each charList as ch}
        <button
          class="char-btn"
          class:active={selectedChar === ch}
          on:click={() => { selectedChar = ch; }}
        >
          {ch === '#' ? '□' : ch}
        </button>
      {/each}
    </div>
  </div>

  <!-- info bar -->
  <div class="info-bar">
    <span><strong>{@html charLabel}</strong></span>
    <span>max <strong>{maxAbs.toFixed(2)} %</strong></span>
    <span>puzzles <strong>{fileCount.toLocaleString()}</strong></span>
  </div>

</div>

<!-- ── styles (scoped) ── -->
<style>
  .container {
    font-family: var(--serif);
    min-height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: clamp(16px, 3vw, 24px);
  }

  /* ── controls ── */
  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(12px, 3vw, 24px);
    align-items: center;
    justify-content: center;
  }

  .radio-group {
    display: flex;
    gap: 0;
  }

  .radio-group label {
    position: relative;
    cursor: pointer;
  }

  .radio-group input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .radio-group .pill {
    display: inline-block;
    padding: clamp(4px, 0.8vw, 5px) clamp(8px, 1.5vw, 14px);
    border: 1px solid var(--color-3);
    font-family: inherit;
    font-size: clamp(13px, 1.5vw, 15px);
    color: var(--color-3);
    background: var(--bg-color);
    opacity: 0.8;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    user-select: none;
  }
  
  .radio-group label:first-child .pill { border-radius: clamp(2px, 0.5vw, 4px) 0 0 clamp(2px, 0.5vw, 4px); }
  .radio-group label:last-child  .pill { border-radius: 0 clamp(2px, 0.5vw, 4px) clamp(2px, 0.5vw, 4px) 0; border-left: none;
  }

  .radio-group input:checked + .pill {
    background: var(--color-1, #333);
    color: var(--bg-color);
    border-color: var(--color-1, #333);
    opacity: 1;
    font-weight: bold;
  }

  /* ── palette ── */
  .palette-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(4px, 1vw, 8px);
  }

  .palette {
    --btn-size: clamp(24px, 4vw, 30px);
    --btn-gap: clamp(2px, 0.5vw, 4px);
    display: flex;
    flex-wrap: wrap;
    gap: var(--btn-gap);
    justify-content: center;
    /* 14 buttons + 13 gaps = balanced 14/13 split */
    width: calc(14 * var(--btn-size) + 13 * var(--btn-gap));
    max-width: 95vw;
  }

  .char-btn {
    width: var(--btn-size);
    height: var(--btn-size);
    border: 1px solid var(--color-3);
    background: var(--bg-color);
    color: var(--color-3);
    font-family: inherit;
    font-size: clamp(10px, 1.5vw, 13px);
    opacity: 0.8;
    font-weight: 700;
    cursor: pointer;
    border-radius: clamp(2px, 0.5vw, 4px);
    transition: background 0.12s, color 0.12s, border-color 0.12s, box-shadow 0.12s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .char-btn:hover {
    opacity: 0.8;
  }

  .char-btn.active {
    background: var(--color-1);
    color: var(--bg-color);
    border-color: var(--color-1);
    opacity: 1;
  }

  /* ── info bar ── */
  .info-bar {
    display: flex;
    flex-wrap: wrap;
    gap: clamp(12px, 3vw, 28px);
    font-size: clamp(15px, 1.5vw, 17px);
    justify-content: center;
    color: var(--color-1);
  }

  .info-bar strong {
    font-weight: 600;
  }

  /* ── grid ── */
  .grid-container {
    --grid-size: 15;
    --grid-max-width: 600px;
    --grid-padding: 20px;
    --gap-size: clamp(1px, 0.3vw, 2px);
    /* Calculate max cell size based on available viewport width */
    --available-width: calc(100vw - 2 * var(--grid-padding));
    --cell-from-viewport: calc((var(--available-width) - (var(--grid-size) - 1) * var(--gap-size)) / var(--grid-size));
    --cell-from-max: calc((var(--grid-max-width) - (var(--grid-size) - 1) * var(--gap-size)) / var(--grid-size));
    --cell-size: min(var(--cell-from-viewport), var(--cell-from-max), 34px);
    --grid-width: calc(var(--grid-size) * var(--cell-size) + (var(--grid-size) - 1) * var(--gap-size));

    display: flex;
    justify-content: center;
    width: 100%;
    max-width: calc(var(--grid-max-width) + 2 * var(--grid-padding));
    padding: 0 var(--grid-padding);
    box-sizing: border-box;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-size), var(--cell-size));
    gap: var(--gap-size);
    border: clamp(2px, 0.5vw, 4px) solid black;
    background: dimgray;
    width: var(--grid-width);
  }

  .cell {
    position: relative;
    width: var(--cell-size);
    height: var(--cell-size);
    transition: background 0.18s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cell:hover {
    outline: clamp(1px, 0.25vw, 2px) solid #fff;
    outline-offset: clamp(-1px, -0.25vw, -2px);
    z-index: 2;
  }

  .cell-letter {
    font-size: clamp(10px, min(2vw, 2vh), 16px);
    font-weight: 900;
    color: #fff;
    transition: opacity 0.18s ease;
    pointer-events: none;
  }

  .tip {
    display: none;
    position: absolute;
    bottom: calc(100% + clamp(3px, 0.8vw, 6px));
    left: 50%;
    transform: translateX(-50%);
    background: #222;
    color: #eee;
    font-size: clamp(14px, 1.3vw, 16px);
    padding: clamp(2px, 0.4vw, 3px) clamp(4px, 0.8vw, 7px);
    border-radius: clamp(2px, 0.5vw, 4px);
    white-space: nowrap;
    z-index: 10;
    border: 1px solid var(--gray);
    pointer-events: none;
  }

  .cell:hover .tip { display: block; }
</style>