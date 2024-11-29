<script>
    import { clamp } from '../utils/math.js'
    export let sketch = {};
    export let index = 0;
    export let scrollY = 0;

    let row;

    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
        return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
    }

    function splitmix32(a) {
     return function() {
       a |= 0;
       a = a + 0x9e3779b9 | 0;
       let t = a ^ a >>> 16;
       t = Math.imul(t, 0x21f0aaad);
       t = t ^ t >>> 15;
       t = Math.imul(t, 0x735a2d97);
       return ((t = t ^ t >>> 15) >>> 0) / 4294967296;
      }
    }

    function randomNumber(string) {
        var seed = cyrb128(string);
        var rand = splitmix32(seed[0]);
        return rand();
    }
    
    const numCircles = 8;
    const circleSizes = [];
    for (let i = 0; i < numCircles; i++) {
        circleSizes.push(10 + randomNumber(`${i} ${sketch.title}`) * 10)
    }

    const colors = [
        "var(--red)",
        "var(--orange)",
        "var(--yellow)",
        "var(--green)",
        "var(--blue)",
        "var(--indigo)",
        "var(--purple)"
    ]
    const color = colors[Math.round(randomNumber(`color ${sketch.title}`) * 100) % colors.length];
</script>

<a href={`/sketches/${sketch.slug}`}>
    <div bind:this={row} class="row">
        <!-- <div class="date">{@html sketch.date}</div> -->
        <div class="droplet">
            {#each circleSizes as circleSize, i}
                <div class="circle" style={`
                    height: ${circleSize}px;
                    width: ${circleSize}px;
                    opacity: ${0.25 + randomNumber(`${i} opacity ${sketch.title}`) * 0.55};
                    background: ${color};
                    border-radius: 50%;
                    position: absolute;
                    top: ${(0.15 + 0.6 * randomNumber(`${i} top ${sketch.title}`)) * 100}%;
                    left: ${(0.15 + 0.6 * randomNumber(`${i} left ${sketch.title}`)) * 100}%;
                    transform: translate(-50%, -50%);
                `}></div>
            {/each}
        </div>
        <div class="title">{sketch.title}</div>
    </div>
</a>

<style>
    a {
        color: unset;
        text-decoration: none;
    }
    img {
        width:100%;
        height: 100%
    }
    .row {
        margin: 10px;
        transition: opacity 50ms linear;
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: var(--color-1);
    }
    .row:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
    .row:hover .title {
        border-bottom: 1px solid var(--black) !important;
    }
    .droplet {
        filter: brightness(1.05);
        transition: all 200ms linear;
    }
    .row:hover .droplet {
        filter: brightness(0.95);
    }
    .row:hover .title {
        color: var(--black);
    }
    /*.row:hover .date {
        color: var(--black);
    }
    .date {
        text-align: center;
        font-family: var(--serif);
        font-size: 14px;
        white-space: pre-line;
        margin: auto 0;
        margin-right: 10px;
    }*/
    .droplet {
        width: 50px;
        height: 50px;
        filter: brightness(1.05);
        position: relative;
    }
    .title {
        font-family: var(--serif);
        font-size: 24px;
        margin: auto 0;
        margin-left: 10px;
        border-bottom: 1px solid #00000000;
        background: var(--bg-color);
        position: relative;
    }
    @media screen and (max-width: 700px) {
        /*.date {
            display: none;
        }*/
        .droplet {
            width: 40px;
            height: 40px;
        }
        .title {
            font-size: 22px;
        }
    }
    @media screen and (max-width: 400px) {
        .title {
            font-size: 20px;
        }
    }
</style>