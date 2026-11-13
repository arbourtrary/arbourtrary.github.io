<script>
    import { onMount } from 'svelte';
    import companies from '../data/sketches/company-anagrams-sketch.json';

    const HOLD_NAME = 1400;
    const MORPH = 900;
    const STAGGER = 14;
    const HOLD_WORD = 2800;     // between anagrams of the same company
    const HOLD_LAST = 3600;     // before moving to the next company
    const DELETE = 28;          // ms between letters deleting, right to left
    const WRITE = 40;           // ms between letters typing a new company in
    const BLINK = 110;          // how long each letter takes to appear or vanish
    const EASE = 'cubic-bezier(0.45, 0, 0.25, 1)';
    const SLIDE = 'transform 600ms cubic-bezier(0.22, 1, 0.36, 1)';
    const ARC_POINTS = 24;
    const TYPE = 45;            // ms between letters typing into the trail
    const TRAIL_SIZE = 16;
    const ARROW = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"><path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/></svg>';

    let stage, word, measure, line;
    let index = 0;
    let spoken = '';            // what the trail says, for screen readers
    let shuffle = () => {};

    // company → plain lowercase letters and spaces
    const display = s => s.toLowerCase().replace(/[^a-z ]/g, '').replace(/\s+/g, ' ').trim();

    onMount(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let state = 'idle';     // hold | morphing | leaving
        let step = 0;           // 0 is the name, k is the k-th anagram
        let texts = [], letters = [], scale = 1, base = 0;
        let timer, done, typing, visible = true, skip = false;
        let items = [];         // trail entries: the name, then each anagram
        let held = [];          // finished animations still holding the letters in place
        let lineFade = null;

        // x offset of every character in a string, at the base font size
        function offsets(text) {
            measure.textContent = '';
            const spans = [...text].map(ch => {
                const span = document.createElement('span');
                span.textContent = ch;
                measure.appendChild(span);
                return span;
            });
            return { xs: spans.map(s => s.offsetLeft), width: measure.offsetWidth };
        }

        // one size for the whole chain, so the letters never jump between words
        function fit() {
            base = parseFloat(getComputedStyle(measure).fontSize);
            const widest = Math.max(...texts.map(t => offsets(t).width));
            scale = Math.min(1, (stage.clientWidth - 32) / widest);
            word.style.fontSize = `${base * scale}px`;
        }

        // send each letter to the nearest free matching letter in the target
        function assign(text) {
            const { xs: raw, width } = offsets(text);
            const left = (stage.clientWidth - width * scale) / 2;
            const xs = raw.map(x => left + x * scale);
            const used = new Set();
            return letters.map(l => {
                let best = -1;
                [...text].forEach((ch, j) => {
                    if (ch !== l.ch || used.has(j)) return;
                    if (best === -1 || Math.abs(xs[j] - l.x) < Math.abs(xs[best] - l.x)) best = j;
                });
                used.add(best);
                return xs[best];
            });
        }

        function wait(fn, ms) {
            clearTimeout(timer);
            timer = setTimeout(function tick() {
                // hold still while off screen or in a background tab
                if (document.hidden || !visible) { timer = setTimeout(tick, 400); return; }
                fn();
            }, ms);
        }

        function show(i) {
            index = (i + companies.length) % companies.length;
            const company = companies[index];
            texts = [display(company.name), ...company.words];
            step = 0;
            fit();
            held = [];
            word.textContent = '';
            letters = [...texts[0]].filter(ch => ch !== ' ').map(ch => {
                const el = document.createElement('span');
                el.className = 'letter';
                el.textContent = ch;
                word.appendChild(el);
                return { ch, el, x: 0 };
            });
            place(assign(texts[0]));
            buildTrail(company);
            state = 'hold';
            // type the name in, big letters and trail together
            const typed = reduced ? 0 : (letters.length - 1) * WRITE + BLINK;
            letters.forEach((l, i) => l.el.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: reduced ? 0 : BLINK, delay: reduced ? 0 : i * WRITE, fill: 'backwards',
            }));
            items[0].chars.forEach((c, i) => {
                if (reduced) c.classList.add('on');
                else setTimeout(() => c.classList.add('on'), i * WRITE);
            });
            wait(forward, typed + HOLD_NAME);
        }

        // The whole chain is laid out up front, invisible, so adding a word never
        // changes the line's width; it only slides over and types the word in
        function buildTrail(company) {
            lineFade?.cancel();
            line.textContent = '';
            items = texts.map((text, k) => {
                const el = document.createElement('span');
                // the name starts as the current word, in black like each anagram after it
                el.className = k === 0 ? 'item current' : 'item next';
                let arrow = null;
                if (k > 0) {
                    arrow = document.createElement('span');
                    arrow.className = 'arrow';
                    arrow.innerHTML = ARROW;
                    el.appendChild(arrow);
                }
                const chars = [...(k === 0 ? company.name : text)].map(ch => {
                    const c = document.createElement('span');
                    c.className = 'ch';
                    c.textContent = ch;
                    el.appendChild(c);
                    return c;
                });
                line.appendChild(el);
                return { el, arrow, chars };
            });
            fitTrail(0, false);
            spoken = company.name;
        }

        // one size for the whole chain, then center whatever is showing so far
        function fitTrail(k, slide) {
            line.style.transition = 'none';
            line.style.fontSize = `${TRAIL_SIZE}px`;
            const full = line.scrollWidth;
            line.style.fontSize = `${TRAIL_SIZE * Math.min(1, (stage.clientWidth - 32) / full)}px`;
            const shown = items[k].el.offsetLeft + items[k].el.offsetWidth;
            if (slide && !reduced) {
                line.offsetWidth;   // commit the jump-free state before transitioning
                line.style.transition = SLIDE;
            }
            line.style.transform = `translateX(${(stage.clientWidth - shown) / 2}px)`;
        }

        // slide the line over and type the new word in
        function reveal(k) {
            fitTrail(k, true);
            items[k - 1].el.classList.remove('current');
            const { el, arrow, chars } = items[k];
            el.classList.add('current');
            const steps = [arrow, ...chars];
            let i = 0;
            clearInterval(typing);
            if (reduced) steps.forEach(c => c.classList.add('on'));
            else typing = setInterval(() => {
                steps[i++].classList.add('on');
                if (i === steps.length) clearInterval(typing);
            }, TYPE);
            spoken = `${companies[index].name}, ${texts.slice(1, k + 1).join(', ')}`;
        }

        function place(xs) {
            letters.forEach((l, i) => {
                l.x = xs[i];
                l.el.style.transform = `translateX(${l.x}px)`;
            });
        }

        // swap finished animations for the same values as plain styles
        function release() {
            letters.forEach(l => { l.el.style.transform = `translateX(${l.x}px)`; });
            held.forEach(a => a.cancel());
            held = [];
        }

        function morph() {
            release();
            state = 'morphing';
            step++;
            const targets = assign(texts[step]);
            const lift = base * scale * 0.55;
            // stagger left to right, wherever the letters currently are
            const order = letters.map((l, i) => i).sort((a, b) => letters[a].x - letters[b].x);
            const anims = letters.map((l, i) => {
                const x0 = l.x, dx = targets[i] - x0;
                l.x = targets[i];
                // rightward letters go over the top, leftward ones underneath
                const h = Math.sign(dx) * -Math.min(lift, Math.abs(dx) * 0.4);
                const frames = Array.from({ length: ARC_POINTS + 1 }, (_, k) => {
                    const t = k / ARC_POINTS;
                    return { transform: `translate(${x0 + dx * t}px, ${h * Math.sin(Math.PI * t)}px)` };
                });
                return l.el.animate(frames, {
                    duration: reduced ? 0 : MORPH,
                    delay: reduced ? 0 : order.indexOf(i) * STAGGER,
                    easing: EASE,
                    fill: 'forwards',
                });
            });
            // settle on a timer rather than animation promises, which can stall
            const total = reduced ? 0 : MORPH + (letters.length - 1) * STAGGER;
            // start typing as the letters settle, so the two read as one motion
            const k = step;
            setTimeout(() => { if (state === 'morphing' && step === k) reveal(k); }, total * 0.6);
            clearTimeout(done);
            done = setTimeout(() => {
                if (state !== 'morphing') return;
                // leave the finished animations holding the letters; release() hands
                // over to plain styles right before the next move, so nothing jumps
                held = anims;
                state = 'hold';
                if (skip) { skip = false; forward(); return; }
                wait(forward, step === texts.length - 1 ? HOLD_LAST : HOLD_WORD);
            }, total);
        }

        // next anagram, or the next company once they're all shown
        function forward() {
            if (step < texts.length - 1) morph();
            else leave(index + 1);
        }

        function leave(next) {
            state = 'leaving';
            skip = false;
            clearTimeout(timer);
            clearTimeout(done);
            clearInterval(typing);
            // delete the word right to left, like holding backspace, as the trail fades
            const order = letters.map((l, i) => i).sort((a, b) => letters[b].x - letters[a].x);
            const gone = reduced ? 0 : (letters.length - 1) * DELETE + BLINK;
            order.forEach((i, n) => letters[i].el.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: reduced ? 0 : BLINK, delay: reduced ? 0 : n * DELETE, fill: 'forwards',
            }));
            lineFade = line.animate([{ opacity: 1 }, { opacity: 0 }], { duration: gone, easing: 'ease-in', fill: 'forwards' });
            done = setTimeout(() => show(next), gone + 60);
        }

        stage.addEventListener('click', () => {
            if (state === 'hold') { clearTimeout(timer); forward(); }
            else if (state === 'morphing') skip = true;
        });

        shuffle = () => {
            if (state === 'leaving') return;
            let next = index;
            while (next === index) next = Math.floor(Math.random() * companies.length);
            leave(next);
        };

        // company names in the appendix scroll back up and play that company
        const pick = e => {
            const link = e.target.closest('[data-company]');
            if (!link) return;
            e.preventDefault();
            const i = companies.findIndex(c => c.name === link.dataset.company);
            if (i === -1) return;
            window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
            leave(i);
        };
        document.addEventListener('click', pick);

        const resize = new ResizeObserver(() => {
            if (state !== 'hold') return;
            release();
            fit();
            place(assign(texts[step]));
            fitTrail(step, false);
        });
        const seen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });

        document.fonts.ready.then(() => {
            resize.observe(stage);
            seen.observe(stage);
            show(0);
        });

        return () => {
            clearTimeout(timer);
            clearTimeout(done);
            clearInterval(typing);
            document.removeEventListener('click', pick);
            resize.disconnect();
            seen.disconnect();
        };
    });
</script>

<div class="stage" bind:this={stage}>
    <div class="pair">
        <div class="word" bind:this={word} aria-hidden="true"></div>
        <div class="trail" aria-hidden="true"><span class="line" bind:this={line}></span></div>
        <p class="visually-hidden" aria-live="polite">{spoken}</p>
    </div>
    <button class="shuffle" aria-label="Shuffle" on:click|stopPropagation={shuffle}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
        </svg>
    </button>
    <span class="measure" bind:this={measure} aria-hidden="true"></span>
</div>

<style>
    .stage {
        position: relative;
        min-height: calc(100vh - var(--header-height));
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: transparent;
    }
    .pair {
        width: 100%;
    }
    .word, .measure {
        font-family: var(--serif);
        font-size: clamp(40px, 8vw, 88px);
        line-height: 1;
        color: var(--color-1);
    }
    .word {
        position: relative;
        height: 1.4em;
    }
    .word :global(.letter) {
        position: absolute;
        left: 0;
        top: 0.2em;
        will-change: transform;
    }
    .measure {
        position: absolute;
        visibility: hidden;
        white-space: pre;
        pointer-events: none;
    }
    .trail {
        position: relative;
        height: 24px;
        margin-top: 1.5em;
    }
    .line {
        position: absolute;
        left: 0;
        top: 0;
        white-space: pre;
        font-family: var(--serif);
        font-size: 16px;
        line-height: 1.5;
        color: var(--color-2);
        will-change: transform;
    }
    .line :global(.item) {
        transition: color 400ms ease-out;
    }
    .line :global(.item.next) {
        margin-left: 0.6em;
    }
    .line :global(.item.current) {
        color: var(--color-1);
    }
    .line :global(.arrow) {
        display: inline-block;
        width: 0.75em;
        height: 0.75em;
        margin-right: 0.6em;
        /* sit on the x-height, where lowercase words carry their weight */
        vertical-align: -0.12em;
        color: var(--color-3);
    }
    .line :global(.arrow svg) {
        display: block;
        width: 100%;
        height: 100%;
    }
    /* every glyph in the trail types in, the name included */
    .line :global(.ch),
    .line :global(.arrow) {
        opacity: 0;
        transition: opacity 180ms ease-out;
    }
    .line :global(.on) {
        opacity: 1;
    }
    .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
    }
    .shuffle {
        margin-top: 12px;
        padding: 8px;
        background: transparent;
        border: none;
        color: var(--color-3);
        cursor: pointer;
        transition: color 200ms linear;
    }
    .shuffle svg {
        display: block;
        height: 17px;
        width: auto;
    }
    @media (hover: hover) {
        .shuffle:hover {
            color: var(--color-1);
        }
    }
</style>
