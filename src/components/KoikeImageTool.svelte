<script>
    import { tick, onDestroy } from 'svelte';

    let activeMode = 'apply';
    let uploadedImageUrl = null;
    let imageLoaded = false;
    let isDragging = false;
    let canvas;
    let dotLayout = 'pack';
    let bgOpacity = 0.5;
    let dotSizeMultiplier = 1.0;
    let customPattern = generateDefaultHexPattern();
    let activePreset = 'hex';
    let selectedDotIndex = null;
    let isDraggingDot = false;
    let designerSvg;
    let fileInput;

    // Crash prevention: debounce + stale render guard
    let renderGeneration = 0;
    let debounceTimer = null;
    const MAX_CANVAS_DIM = 2000;

    // Stored after each render so downloadImage can crop precisely
    let lastRender = null;

    function generateDefaultHexPattern() {
        const cols = [0.18, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82];
        const rowCounts = [10, 11, 11, 12, 12, 12, 11, 11, 10];
        const dots = [];
        cols.forEach((xFrac, i) => {
            const yOffset = i % 2 !== 0 ? -0.025 : 0;
            for (let r = 0; r < rowCounts[i]; r++) {
                dots.push({ x: xFrac, y: 0.10 + yOffset + r * 0.06 });
            }
        });
        return dots;
    }

    // Oval / diamond pattern — symmetric taper top & bottom (from Song.svelte geometry)
    function generateOvalPattern() {
        const cols = [0.18, 0.26, 0.34, 0.42, 0.50, 0.58, 0.66, 0.74, 0.82];
        const rowCounts = [8, 9, 10, 11, 12, 11, 10, 9, 8];
        const dots = [];
        cols.forEach((xFrac, i) => {
            const isOdd = i % 2 !== 0;
            // Each column is centered symmetrically around its midpoint.
            // Even cols center at 0.43, odd cols center at 0.435 (0.46 − 0.025 stagger).
            const centerY = isOdd ? 0.435 : 0.43;
            const yStart = centerY - (rowCounts[i] - 1) * 0.03;
            for (let r = 0; r < rowCounts[i]; r++) {
                dots.push({ x: xFrac, y: yStart + r * 0.06 });
            }
        });
        return dots;
    }

    async function loadImageFromFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
        uploadedImageUrl = URL.createObjectURL(file);
        imageLoaded = false;
        await tick();
        processImage();
    }

    onDestroy(() => {
        if (uploadedImageUrl) URL.revokeObjectURL(uploadedImageUrl);
        if (debounceTimer) clearTimeout(debounceTimer);
    });

    // Groups pixel-space dots into columns and returns sorted column list.
    // epsilon is the max x-distance to consider two dots in the same column.
    function groupIntoColumns(pxDots, epsilon) {
        const columns = [];
        for (let i = 0; i < pxDots.length; i++) {
            const dot = pxDots[i];
            let placed = false;
            for (const col of columns) {
                if (Math.abs(col.xRef - dot.x) < epsilon) {
                    col.indices.push(i);
                    placed = true;
                    break;
                }
            }
            if (!placed) columns.push({ xRef: dot.x, indices: [i] });
        }
        columns.sort((a, b) => a.xRef - b.xRef);
        return columns;
    }

    // Returns packed hex positions AND the effective dotSize scaled to fit the canvas.
    function buildCompressedCenters(scatterPx, dotSize, cvs) {
        const epsilon = Math.min(cvs.width, cvs.height) * 0.04;
        const columns = groupIntoColumns(scatterPx, epsilon);
        const numCols = columns.length;
        if (numCols === 0) return { positions: [], effectiveDotSize: dotSize };

        const maxRows = Math.max(...columns.map(c => c.indices.length));

        // Natural hex grid dimensions.
        // Width: (numCols-1) column spacings + one dot diameter
        const naturalW = (numCols - 1) * (dotSize / 2) * Math.sqrt(3) + dotSize;
        // Height: even cols span (maxRows-1)*d; odd cols start d/2 above and may add one
        // more row. Bounding box height = maxRows*d + d/2.
        const naturalH = maxRows * dotSize + dotSize / 2;

        // Scale down uniformly if the grid doesn't fit the canvas (never scale up).
        const pad = 0.92;
        const scale = Math.min(1, (cvs.width * pad) / naturalW, (cvs.height * pad) / naturalH);
        const d = dotSize * scale;
        const colSpacing = (d / 2) * Math.sqrt(3);
        const totalWidth = (numCols - 1) * colSpacing;

        // Detect whether any adjacent column pair has the same row count.
        // - Rectangular patterns (e.g. [10,11,11,12,12,12,11,11,10]) have equal-count
        //   adjacent pairs and require a shared y-reference grid with an explicit d/2
        //   stagger for odd columns so those pairs are tangent rather than overlapping.
        // - Tapering/oval patterns (e.g. [8,9,10,11,12,11,10,9,8]) have all adjacent
        //   pairs differing by exactly 1 row, so per-column centering works: the d/2
        //   stagger emerges naturally from the even/odd parity of row counts, and each
        //   column is vertically centered on the canvas producing a symmetric oval shape.
        const hasSameCountAdjacent = columns.some((col, i) =>
            i > 0 && col.indices.length === columns[i - 1].indices.length
        );

        // Shared y-reference grid (rectangular patterns).
        const yRefEven = cvs.height / 2 - (maxRows - 1) * d / 2;
        const yRefOdd  = yRefEven - d / 2;

        const positions = new Array(scatterPx.length);
        columns.forEach((col, colIdx) => {
            const colX = cvs.width / 2 - totalWidth / 2 + colIdx * colSpacing;
            let yRef;
            if (hasSameCountAdjacent) {
                // Shared grid: odd columns stagger d/2 above even columns.
                yRef = colIdx % 2 !== 0 ? yRefOdd : yRefEven;
            } else {
                // Per-column centering: each column centered at canvas mid.
                // Adjacent ±1-row columns naturally sit d/2 apart in y (tangent).
                yRef = cvs.height / 2 - (col.indices.length - 1) * d / 2;
            }
            col.indices.forEach((origIdx, rowIdx) => {
                positions[origIdx] = { x: colX, y: yRef + rowIdx * d };
            });
        });

        return { positions, effectiveDotSize: d };
    }

    function scheduleProcessImage() {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(processImage, 60);
    }

    function processImage() {
        if (!canvas || !uploadedImageUrl) return;

        // Increment generation so any in-flight render sees it's stale and bails
        const generation = ++renderGeneration;

        const ctx = canvas.getContext('2d');
        const img = new window.Image();

        img.onload = () => {
            if (generation !== renderGeneration) return; // stale, another render superseded us

            // Cap resolution to avoid OOM crashes on large photos
            const scale = Math.min(1, MAX_CANVAS_DIM / img.width, MAX_CANVAS_DIM / img.height);
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Work in a square layout space (min dimension, centered) so the hex
            // geometry is preserved regardless of image aspect ratio.
            const layoutSize = Math.min(canvas.width, canvas.height);
            const xOff = (canvas.width - layoutSize) / 2;
            const yOff = (canvas.height - layoutSize) / 2;

            // Base dot size relative to the layout square
            const sizeFactor = 50 / 2785;
            let dotSize = 2 * sizeFactor * layoutSize * dotSizeMultiplier;

            // Map normalized pattern into the square layout space (pixel coords)
            const scatterPx = customPattern.map(p => ({
                x: xOff + p.x * layoutSize,
                y: yOff + p.y * layoutSize
            }));

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color') || '#ffffff';
            ctx.fillStyle = bgColor.trim();
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (dotLayout === 'overlay') {
                ctx.globalAlpha = bgOpacity;
                ctx.drawImage(img, 0, 0);
                ctx.globalAlpha = 1.0;
            }

            let destPositions;
            let drawSize = dotSize; // the size used when drawing circles onto main canvas

            if (dotLayout === 'pack') {
                const { positions, effectiveDotSize } = buildCompressedCenters(scatterPx, dotSize, canvas);
                destPositions = positions;
                drawSize = effectiveDotSize; // may be scaled down to fit
            } else {
                destPositions = scatterPx;
            }

            for (let i = 0; i < scatterPx.length; i++) {
                // Sample from the source image at the scatter position using base dotSize
                const srcX = scatterPx[i].x;
                const srcY = scatterPx[i].y;
                const dstX = destPositions[i].x;
                const dstY = destPositions[i].y;

                const dotCanvas = document.createElement('canvas');
                dotCanvas.width = Math.max(1, Math.ceil(drawSize));
                dotCanvas.height = Math.max(1, Math.ceil(drawSize));
                const dotCtx = dotCanvas.getContext('2d');

                dotCtx.beginPath();
                dotCtx.arc(drawSize / 2, drawSize / 2, drawSize / 2, 0, Math.PI * 2);
                dotCtx.clip();

                // Draw from source (always at dotSize window, scaled into drawSize canvas)
                dotCtx.drawImage(
                    tempCanvas,
                    srcX - dotSize / 2,
                    srcY - dotSize / 2,
                    dotSize,
                    dotSize,
                    0, 0,
                    drawSize,
                    drawSize
                );

                ctx.drawImage(dotCanvas, dstX - drawSize / 2, dstY - drawSize / 2);
            }

            // Store for cropped download
            lastRender = { positions: destPositions, drawSize, scatterPx, dotSize, tempCanvas };
            imageLoaded = true;
        };

        img.onerror = (err) => console.error('Error loading image:', err);
        img.src = uploadedImageUrl;
    }

    $: if (uploadedImageUrl && canvas && (dotLayout || dotSizeMultiplier || customPattern)) {
        scheduleProcessImage();
    }

    function downloadImage() {
        if (!lastRender) return;
        const { positions, drawSize, scatterPx, dotSize, tempCanvas } = lastRender;

        // Compute tight bounding box around all dot edges
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const pos of positions) {
            minX = Math.min(minX, pos.x - drawSize / 2);
            minY = Math.min(minY, pos.y - drawSize / 2);
            maxX = Math.max(maxX, pos.x + drawSize / 2);
            maxY = Math.max(maxY, pos.y + drawSize / 2);
        }
        minX = Math.floor(minX);
        minY = Math.floor(minY);
        maxX = Math.ceil(maxX);
        maxY = Math.ceil(maxY);

        const outCanvas = document.createElement('canvas');
        outCanvas.width  = maxX - minX;
        outCanvas.height = maxY - minY;
        const outCtx = outCanvas.getContext('2d');
        // transparent background — no fill

        for (let i = 0; i < positions.length; i++) {
            const srcX = scatterPx[i].x;
            const srcY = scatterPx[i].y;
            const dstX = positions[i].x - minX;
            const dstY = positions[i].y - minY;

            const dotCanvas = document.createElement('canvas');
            dotCanvas.width  = Math.max(1, Math.ceil(drawSize));
            dotCanvas.height = Math.max(1, Math.ceil(drawSize));
            const dotCtx = dotCanvas.getContext('2d');

            dotCtx.beginPath();
            dotCtx.arc(drawSize / 2, drawSize / 2, drawSize / 2, 0, Math.PI * 2);
            dotCtx.clip();
            dotCtx.drawImage(tempCanvas, srcX - dotSize / 2, srcY - dotSize / 2, dotSize, dotSize, 0, 0, drawSize, drawSize);

            outCtx.drawImage(dotCanvas, dstX - drawSize / 2, dstY - drawSize / 2);
        }

        const link = document.createElement('a');
        link.download = 'dot-sampled.png';
        link.href = outCanvas.toDataURL('image/png');
        link.click();
    }

    function handleDrop(event) {
        event.preventDefault();
        isDragging = false;
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            loadImageFromFile(files[0]);
        }
    }

    function handleDragOver(event) {
        event.preventDefault();
        isDragging = true;
    }

    function handleDragLeave() {
        isDragging = false;
    }

    function handleFileInput(event) {
        const file = event.target.files[0];
        if (file) loadImageFromFile(file);
    }

    // Pattern designer logic
    function getSvgCoords(event) {
        const rect = designerSvg.getBoundingClientRect();
        return {
            x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
            y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
        };
    }

    function handleSvgPointerDown(event) {
        if (event.target === designerSvg) {
            // Click on blank space - add dot
            const coords = getSvgCoords(event);
            customPattern = [...customPattern, { x: coords.x, y: coords.y }];
            selectedDotIndex = customPattern.length - 1;
            activePreset = null;
        }
    }

    function handleDotPointerDown(event, index) {
        event.stopPropagation();
        selectedDotIndex = index;
        isDraggingDot = true;
        activePreset = null;
        event.target.setPointerCapture(event.pointerId);
    }

    function handleSvgPointerMove(event) {
        if (!isDraggingDot || selectedDotIndex === null) return;
        const coords = getSvgCoords(event);
        customPattern = customPattern.map((dot, i) =>
            i === selectedDotIndex ? { x: coords.x, y: coords.y } : dot
        );
    }

    function handleSvgPointerUp() {
        isDraggingDot = false;
    }

    function handleDotKeyDown(event, index) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            event.preventDefault();
            removeDot(index);
        }
    }

    function removeDot(index) {
        customPattern = customPattern.filter((_, i) => i !== index);
        if (selectedDotIndex >= customPattern.length) {
            selectedDotIndex = customPattern.length > 0 ? customPattern.length - 1 : null;
        }
        activePreset = null;
    }
</script>

<div class="wrapper">
    <div class="tab-bar">
        <button
            class="tab"
            class:active={activeMode === 'apply'}
            on:click={() => activeMode = 'apply'}
        >Apply to Image</button>
        <button
            class="tab"
            class:active={activeMode === 'design'}
            on:click={() => activeMode = 'design'}
        >Design Pattern</button>
    </div>

    {#if activeMode === 'apply'}
        {#if !uploadedImageUrl}
            <div
                class="drop-zone"
                class:dragging={isDragging}
                on:dragover={handleDragOver}
                on:dragleave={handleDragLeave}
                on:drop={handleDrop}
                on:click={() => fileInput.click()}
                role="button"
                tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
            >
                <p class="drop-label">Drop an image here, or click to upload</p>
                <p class="drop-sub">Inspired by the cut-and-rearranged photography of <a href="https://www.kensukekoike.com/" target="_blank">Kensuke Koike</a></p>
            </div>
            <input
                bind:this={fileInput}
                type="file"
                accept="image/*"
                style="display:none"
                on:change={handleFileInput}
            />
        {:else}
            <div class="controls-row">
                <label class="control-label">
                    Dot size
                    <input
                        type="range"
                        min="0.3"
                        max="2.5"
                        step="0.05"
                        bind:value={dotSizeMultiplier}
                    />
                    <span class="slider-val">{dotSizeMultiplier.toFixed(2)}x</span>
                </label>
                <div class="layout-buttons">
                    <button
                        class:active={dotLayout === 'pack'}
                        on:click={() => dotLayout = 'pack'}
                    >Packed</button>
                    <button
                        class:active={dotLayout === 'scatter'}
                        on:click={() => dotLayout = 'scatter'}
                    >Scattered</button>
                    <button
                        class:active={dotLayout === 'overlay'}
                        on:click={() => dotLayout = 'overlay'}
                    >Overlay</button>
                    <button class="icon-btn" style="margin-left:auto" title="Download PNG" on:click={downloadImage}>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                    <button class="icon-btn" title="Upload new image" on:click={() => { uploadedImageUrl = null; imageLoaded = false; fileInput.click(); }}>
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                    </button>
                </div>
                {#if dotLayout === 'overlay'}
                    <label class="control-label">
                        Opacity
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            bind:value={bgOpacity}
                        />
                        <span class="slider-val">{Math.round(bgOpacity * 100)}%</span>
                    </label>
                {/if}
            </div>

            <div class="canvas-container">
                <canvas bind:this={canvas}></canvas>
            </div>

            <input
                bind:this={fileInput}
                type="file"
                accept="image/*"
                style="display:none"
                on:change={handleFileInput}
            />
        {/if}
    {:else}
        <p class="designer-hint">Click the canvas to add dots. Drag dots to reposition. Select then press Delete to remove.</p>

        <div class="svg-wrapper">
            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <svg
                bind:this={designerSvg}
                viewBox="0 0 1 1"
                class="designer-svg"
                on:pointerdown={handleSvgPointerDown}
                on:pointermove={handleSvgPointerMove}
                on:pointerup={handleSvgPointerUp}
                role="img"
                aria-label="Dot pattern designer"
            >
                <!-- faint grid -->
                {#each Array(11) as _, i}
                    <line x1={i * 0.1} y1="0" x2={i * 0.1} y2="1" class="grid-line"/>
                    <line x1="0" y1={i * 0.1} x2="1" y2={i * 0.1} class="grid-line"/>
                {/each}

                {#each customPattern as dot, i}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <circle
                        cx={dot.x}
                        cy={dot.y}
                        r="0.018"
                        class="designer-dot"
                        class:selected={selectedDotIndex === i}
                        on:pointerdown={(e) => handleDotPointerDown(e, i)}
                        on:keydown={(e) => handleDotKeyDown(e, i)}
                        tabindex="0"
                        role="button"
                        aria-label="Dot {i + 1}"
                    />
                {/each}
            </svg>
        </div>

        <div class="action-row">
            <button
                class="preset-btn"
                class:active={activePreset === 'hex'}
                on:click={() => { customPattern = generateDefaultHexPattern(); selectedDotIndex = null; activePreset = 'hex'; }}
                title="Rectangular hex grid"
            >
                <!-- 9 cols [10,11,11,12,12,12,11,11,10], d=6, shared yRef — actual hex pattern -->
                <svg viewBox="-3 -3 51 78" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3"     cy="3"  r="2.4"/><circle cx="3"     cy="9"  r="2.4"/><circle cx="3"     cy="15" r="2.4"/><circle cx="3"     cy="21" r="2.4"/><circle cx="3"     cy="27" r="2.4"/><circle cx="3"     cy="33" r="2.4"/><circle cx="3"     cy="39" r="2.4"/><circle cx="3"     cy="45" r="2.4"/><circle cx="3"     cy="51" r="2.4"/><circle cx="3"     cy="57" r="2.4"/>
                    <circle cx="8.2"   cy="0"  r="2.4"/><circle cx="8.2"   cy="6"  r="2.4"/><circle cx="8.2"   cy="12" r="2.4"/><circle cx="8.2"   cy="18" r="2.4"/><circle cx="8.2"   cy="24" r="2.4"/><circle cx="8.2"   cy="30" r="2.4"/><circle cx="8.2"   cy="36" r="2.4"/><circle cx="8.2"   cy="42" r="2.4"/><circle cx="8.2"   cy="48" r="2.4"/><circle cx="8.2"   cy="54" r="2.4"/><circle cx="8.2"   cy="60" r="2.4"/>
                    <circle cx="13.39" cy="3"  r="2.4"/><circle cx="13.39" cy="9"  r="2.4"/><circle cx="13.39" cy="15" r="2.4"/><circle cx="13.39" cy="21" r="2.4"/><circle cx="13.39" cy="27" r="2.4"/><circle cx="13.39" cy="33" r="2.4"/><circle cx="13.39" cy="39" r="2.4"/><circle cx="13.39" cy="45" r="2.4"/><circle cx="13.39" cy="51" r="2.4"/><circle cx="13.39" cy="57" r="2.4"/><circle cx="13.39" cy="63" r="2.4"/>
                    <circle cx="18.59" cy="0"  r="2.4"/><circle cx="18.59" cy="6"  r="2.4"/><circle cx="18.59" cy="12" r="2.4"/><circle cx="18.59" cy="18" r="2.4"/><circle cx="18.59" cy="24" r="2.4"/><circle cx="18.59" cy="30" r="2.4"/><circle cx="18.59" cy="36" r="2.4"/><circle cx="18.59" cy="42" r="2.4"/><circle cx="18.59" cy="48" r="2.4"/><circle cx="18.59" cy="54" r="2.4"/><circle cx="18.59" cy="60" r="2.4"/><circle cx="18.59" cy="66" r="2.4"/>
                    <circle cx="23.78" cy="3"  r="2.4"/><circle cx="23.78" cy="9"  r="2.4"/><circle cx="23.78" cy="15" r="2.4"/><circle cx="23.78" cy="21" r="2.4"/><circle cx="23.78" cy="27" r="2.4"/><circle cx="23.78" cy="33" r="2.4"/><circle cx="23.78" cy="39" r="2.4"/><circle cx="23.78" cy="45" r="2.4"/><circle cx="23.78" cy="51" r="2.4"/><circle cx="23.78" cy="57" r="2.4"/><circle cx="23.78" cy="63" r="2.4"/><circle cx="23.78" cy="69" r="2.4"/>
                    <circle cx="28.98" cy="0"  r="2.4"/><circle cx="28.98" cy="6"  r="2.4"/><circle cx="28.98" cy="12" r="2.4"/><circle cx="28.98" cy="18" r="2.4"/><circle cx="28.98" cy="24" r="2.4"/><circle cx="28.98" cy="30" r="2.4"/><circle cx="28.98" cy="36" r="2.4"/><circle cx="28.98" cy="42" r="2.4"/><circle cx="28.98" cy="48" r="2.4"/><circle cx="28.98" cy="54" r="2.4"/><circle cx="28.98" cy="60" r="2.4"/><circle cx="28.98" cy="66" r="2.4"/>
                    <circle cx="34.18" cy="3"  r="2.4"/><circle cx="34.18" cy="9"  r="2.4"/><circle cx="34.18" cy="15" r="2.4"/><circle cx="34.18" cy="21" r="2.4"/><circle cx="34.18" cy="27" r="2.4"/><circle cx="34.18" cy="33" r="2.4"/><circle cx="34.18" cy="39" r="2.4"/><circle cx="34.18" cy="45" r="2.4"/><circle cx="34.18" cy="51" r="2.4"/><circle cx="34.18" cy="57" r="2.4"/><circle cx="34.18" cy="63" r="2.4"/>
                    <circle cx="39.37" cy="0"  r="2.4"/><circle cx="39.37" cy="6"  r="2.4"/><circle cx="39.37" cy="12" r="2.4"/><circle cx="39.37" cy="18" r="2.4"/><circle cx="39.37" cy="24" r="2.4"/><circle cx="39.37" cy="30" r="2.4"/><circle cx="39.37" cy="36" r="2.4"/><circle cx="39.37" cy="42" r="2.4"/><circle cx="39.37" cy="48" r="2.4"/><circle cx="39.37" cy="54" r="2.4"/><circle cx="39.37" cy="60" r="2.4"/>
                    <circle cx="44.57" cy="3"  r="2.4"/><circle cx="44.57" cy="9"  r="2.4"/><circle cx="44.57" cy="15" r="2.4"/><circle cx="44.57" cy="21" r="2.4"/><circle cx="44.57" cy="27" r="2.4"/><circle cx="44.57" cy="33" r="2.4"/><circle cx="44.57" cy="39" r="2.4"/><circle cx="44.57" cy="45" r="2.4"/><circle cx="44.57" cy="51" r="2.4"/><circle cx="44.57" cy="57" r="2.4"/>
                </svg>
            </button>
            <button
                class="preset-btn"
                class:active={activePreset === 'oval'}
                on:click={() => { customPattern = generateOvalPattern(); selectedDotIndex = null; activePreset = 'oval'; }}
                title="Oval pattern"
            >
                <!-- 9 cols [8,9,10,11,12,11,10,9,8], d=6, per-col centered — actual oval pattern -->
                <svg viewBox="-3 -3 51 78" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3"     cy="15" r="2.4"/><circle cx="3"     cy="21" r="2.4"/><circle cx="3"     cy="27" r="2.4"/><circle cx="3"     cy="33" r="2.4"/><circle cx="3"     cy="39" r="2.4"/><circle cx="3"     cy="45" r="2.4"/><circle cx="3"     cy="51" r="2.4"/><circle cx="3"     cy="57" r="2.4"/>
                    <circle cx="8.2"   cy="12" r="2.4"/><circle cx="8.2"   cy="18" r="2.4"/><circle cx="8.2"   cy="24" r="2.4"/><circle cx="8.2"   cy="30" r="2.4"/><circle cx="8.2"   cy="36" r="2.4"/><circle cx="8.2"   cy="42" r="2.4"/><circle cx="8.2"   cy="48" r="2.4"/><circle cx="8.2"   cy="54" r="2.4"/><circle cx="8.2"   cy="60" r="2.4"/>
                    <circle cx="13.39" cy="9"  r="2.4"/><circle cx="13.39" cy="15" r="2.4"/><circle cx="13.39" cy="21" r="2.4"/><circle cx="13.39" cy="27" r="2.4"/><circle cx="13.39" cy="33" r="2.4"/><circle cx="13.39" cy="39" r="2.4"/><circle cx="13.39" cy="45" r="2.4"/><circle cx="13.39" cy="51" r="2.4"/><circle cx="13.39" cy="57" r="2.4"/><circle cx="13.39" cy="63" r="2.4"/>
                    <circle cx="18.59" cy="6"  r="2.4"/><circle cx="18.59" cy="12" r="2.4"/><circle cx="18.59" cy="18" r="2.4"/><circle cx="18.59" cy="24" r="2.4"/><circle cx="18.59" cy="30" r="2.4"/><circle cx="18.59" cy="36" r="2.4"/><circle cx="18.59" cy="42" r="2.4"/><circle cx="18.59" cy="48" r="2.4"/><circle cx="18.59" cy="54" r="2.4"/><circle cx="18.59" cy="60" r="2.4"/><circle cx="18.59" cy="66" r="2.4"/>
                    <circle cx="23.78" cy="3"  r="2.4"/><circle cx="23.78" cy="9"  r="2.4"/><circle cx="23.78" cy="15" r="2.4"/><circle cx="23.78" cy="21" r="2.4"/><circle cx="23.78" cy="27" r="2.4"/><circle cx="23.78" cy="33" r="2.4"/><circle cx="23.78" cy="39" r="2.4"/><circle cx="23.78" cy="45" r="2.4"/><circle cx="23.78" cy="51" r="2.4"/><circle cx="23.78" cy="57" r="2.4"/><circle cx="23.78" cy="63" r="2.4"/><circle cx="23.78" cy="69" r="2.4"/>
                    <circle cx="28.98" cy="6"  r="2.4"/><circle cx="28.98" cy="12" r="2.4"/><circle cx="28.98" cy="18" r="2.4"/><circle cx="28.98" cy="24" r="2.4"/><circle cx="28.98" cy="30" r="2.4"/><circle cx="28.98" cy="36" r="2.4"/><circle cx="28.98" cy="42" r="2.4"/><circle cx="28.98" cy="48" r="2.4"/><circle cx="28.98" cy="54" r="2.4"/><circle cx="28.98" cy="60" r="2.4"/><circle cx="28.98" cy="66" r="2.4"/>
                    <circle cx="34.18" cy="9"  r="2.4"/><circle cx="34.18" cy="15" r="2.4"/><circle cx="34.18" cy="21" r="2.4"/><circle cx="34.18" cy="27" r="2.4"/><circle cx="34.18" cy="33" r="2.4"/><circle cx="34.18" cy="39" r="2.4"/><circle cx="34.18" cy="45" r="2.4"/><circle cx="34.18" cy="51" r="2.4"/><circle cx="34.18" cy="57" r="2.4"/><circle cx="34.18" cy="63" r="2.4"/>
                    <circle cx="39.37" cy="12" r="2.4"/><circle cx="39.37" cy="18" r="2.4"/><circle cx="39.37" cy="24" r="2.4"/><circle cx="39.37" cy="30" r="2.4"/><circle cx="39.37" cy="36" r="2.4"/><circle cx="39.37" cy="42" r="2.4"/><circle cx="39.37" cy="48" r="2.4"/><circle cx="39.37" cy="54" r="2.4"/><circle cx="39.37" cy="60" r="2.4"/>
                    <circle cx="44.57" cy="15" r="2.4"/><circle cx="44.57" cy="21" r="2.4"/><circle cx="44.57" cy="27" r="2.4"/><circle cx="44.57" cy="33" r="2.4"/><circle cx="44.57" cy="39" r="2.4"/><circle cx="44.57" cy="45" r="2.4"/><circle cx="44.57" cy="51" r="2.4"/><circle cx="44.57" cy="57" r="2.4"/>
                </svg>
            </button>
            <button
                class="trash-btn"
                on:click={() => { customPattern = []; selectedDotIndex = null; activePreset = null; }}
                title="Clear all dots"
            >
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="3,6 5,6 21,6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M19,6l-1,14a2,2,0,0,1-2,2H8a2,2,0,0,1-2-2L5,6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10,11v6" stroke-linecap="round"/>
                    <path d="M14,11v6" stroke-linecap="round"/>
                    <path d="M9,6V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    {/if}
</div>


<style>
    .wrapper {
        max-width: min(550px, 95%);
        margin: 0 auto;
        padding-top: 25px;
        padding-bottom: 60px;
        font-family: var(--serif);
        min-height: calc(100vh - var(--header-height));
    }

    .tab-bar {
        display: flex;
        justify-content: center;
        gap: 0;
        margin-bottom: 24px;
    }

    .tab {
        background: transparent;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        color: var(--color-1);
        font-family: var(--serif);
        font-size: 16px;
        padding: 8px 16px 6px;
        margin-bottom: -1px;
        opacity: 0.6;
        transition: all 120ms linear;
    }

    .tab.active {
        border-bottom: 2px solid var(--color-1);
        opacity: 1;
    }

    .tab:hover {
        opacity: 1;
    }

    .drop-zone {
        border: 1.5px dashed var(--color-3);
        border-radius: 15px;
        padding: 50px 30px;
        text-align: center;
        cursor: pointer;
        transition: border-color 120ms linear;
        margin-bottom: 20px;
    }

    .drop-zone.dragging {
        border-color: var(--color-1);
    }

    .drop-zone:hover {
        border-color: var(--color-1);
    }

    .drop-label {
        font-size: 18px;
        color: var(--color-1);
        margin: 0 0 12px;
    }

    .drop-sub {
        font-size: 15px;
        color: var(--color-1);
        opacity: 0.7;
        margin: 0;
        line-height: 1.5;
    }

    .drop-sub a {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-2);
        text-underline-offset: 3px;
    }

    .drop-sub a:hover {
        text-decoration-color: var(--color-1);
    }

    .controls-row {
        display: flex;
        flex-direction: column;
        gap: 14px;
        margin-bottom: 18px;
    }

    .control-label {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 15px;
        color: var(--color-1);
        font-family: var(--serif);
    }

    .control-label input[type="range"] {
        flex: 1;
        -webkit-appearance: none;
        appearance: none;
        height: 1px;
        background: var(--color-2);
        outline: none;
        border: none;
        border-radius: 0;
        cursor: pointer;
    }
    .control-label input[type="range"]::-webkit-slider-runnable-track {
        height: 1px;
        background: var(--color-2);
    }
    .control-label input[type="range"]::-moz-range-track {
        height: 1px;
        background: var(--color-2);
        border: none;
    }
    .control-label input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--color-1);
        margin-top: -5px;
        cursor: pointer;
    }
    .control-label input[type="range"]::-moz-range-thumb {
        width: 11px;
        height: 11px;
        border-radius: 50%;
        background: var(--color-1);
        border: none;
        cursor: pointer;
    }

    .slider-val {
        min-width: 42px;
        font-size: 14px;
        color: var(--color-1);
        opacity: 0.7;
    }

    .layout-buttons {
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
    }

    .layout-buttons button:not(.icon-btn) {
        background: transparent;
        border: 1px solid var(--color-2);
        border-radius: 8px;
        color: var(--color-1);
        font-family: var(--serif);
        font-size: 14px;
        padding: 5px 12px;
        cursor: pointer;
        opacity: 0.65;
        transition: all 120ms linear;
    }

    .layout-buttons button:not(.icon-btn):hover,
    .layout-buttons button:not(.icon-btn).active {
        border-color: var(--color-1);
        opacity: 1;
    }

    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 3px;
        width: 26px;
        height: 26px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
        transition: opacity 120ms linear;
        flex-shrink: 0;
    }

    .icon-btn:hover {
        opacity: 1;
    }

    .icon-btn svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: var(--color-1);
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .canvas-container {
        width: 100%;
        margin-bottom: 16px;
    }

    canvas {
        display: block;
        margin: 0 auto;
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 70vh;
    }

    .action-row {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 16px;
        width: 100%;
    }

    .action-btn {
        background: transparent;
        border: 1px solid var(--color-2);
        border-radius: 8px;
        color: var(--color-1);
        font-family: var(--serif);
        font-size: 15px;
        padding: 7px 16px;
        cursor: pointer;
        opacity: 0.8;
        transition: all 120ms linear;
    }

    .action-btn:hover {
        border-color: var(--color-1);
        opacity: 1;
    }

    .designer-hint {
        font-size: 15px;
        color: var(--color-1);
        opacity: 0.7;
        margin: 0 0 16px;
        line-height: 1.5;
    }

    .preset-btn {
        width: 24px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        display: block;
        opacity: 0.3;
        transition: opacity 120ms linear;
        flex-shrink: 0;
    }

    .preset-btn:hover {
        opacity: 0.7;
    }

    .preset-btn.active {
        opacity: 1;
    }

    .preset-btn svg {
        width: 100%;
        height: auto;
        display: block;
        fill: var(--color-1);
    }

    .svg-wrapper {
        width: 100%;
        margin-bottom: 0;
    }

    .trash-btn {
        margin-left: auto;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        opacity: 0.3;
        transition: opacity 120ms linear;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        flex-shrink: 0;
    }

    .trash-btn:hover {
        opacity: 0.8;
    }

    .trash-btn svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke: var(--color-1);
        stroke-width: 1.8;
        stroke-linecap: round;
        stroke-linejoin: round;
    }

    .designer-svg {
        width: 100%;
        aspect-ratio: 1 / 1;
        background: var(--color-4);
        display: block;
        cursor: crosshair;
    }

    .grid-line {
        stroke: currentColor;
        stroke-width: 0.002;
        opacity: 0.15;
        pointer-events: none;
    }

    .designer-dot {
        fill: var(--color-3);
        cursor: grab;
        transition: fill 80ms linear;
        outline: none;
    }

    .designer-dot:hover {
        fill: var(--color-1);
    }

    .designer-dot.selected {
        fill: var(--color-1);
    }

    .designer-dot:active {
        cursor: grabbing;
    }

    .dot-count {
        font-size: 14px;
        color: var(--color-1);
        opacity: 0.6;
        font-family: var(--serif);
    }
</style>
