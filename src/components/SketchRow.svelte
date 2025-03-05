<script>
    import { randomNumber } from '../utils/identifier.js'
    import { clamp } from '../utils/math.js'
    import { getTwoDigitMonthYearDate } from '../utils/date.js';
    export let sketch = {};

    let row;

    const numCircles = 13 + Math.round(randomNumber(`circles ${sketch.title}`)) * 3;
    const circleSizes = [];
    for (let i = 0; i < numCircles; i++) {
        circleSizes.push(2 + randomNumber(`${i} ${sketch.title}`) * 10)
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
        <div class="title">{sketch.title}</div>
        <div class="connector"></div>
        <div class="droplet">
            {#each circleSizes as circleSize, i}
                <div class="circle" style={`
                    height: ${circleSize}px;
                    width: ${circleSize}px;
                    opacity: ${0.2 + randomNumber(`${i} opacity ${sketch.title}`) * 0.45};
                    background: ${color};
                    border-radius: 50%;
                    position: absolute;
                    top: ${(0.15 + 0.55 * randomNumber(`${i} top ${sketch.title}`)) * 100}%;
                    left: ${(0.15 + 0.55 * randomNumber(`${i} left ${sketch.title}`)) * 100}%;
                    transform: translate(-50%, -50%);
                `}></div>
            {/each}
        </div>
        <div class="date">{@html getTwoDigitMonthYearDate(sketch.date)}</div>
    </div>
</a>

<style>
    a {
        color: unset;
        text-decoration: none;
    }
    .row {
        margin: 5px 10px;
        transition: opacity 50ms linear;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: var(--color-1);
    }
    .row:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
    .droplet {
        filter: brightness(1.05);
        transition: all 200ms linear;
    }
    .connector {
        width: 100%;
        flex: 1;
        height: 1px;
        opacity: 0.4;
        background: var(--color-3);
        margin: 0 10px;
    }
    .row:hover .connector {
        opacity: 1;
    }
    .row:hover .droplet {
        filter: brightness(0.95);
    }
    .row:hover .title {
        color: var(--black);
    }
    .row:hover .date {
        color: var(--black);
    }
    .date {
        text-align: center;
        font-family: var(--serif);
        color: var(--color-2);
        font-size: 14px;
        white-space: pre-line;
        margin: auto 0;
        margin-left: 10px;
    }
    .droplet {
        width: 30px;
        height: 30px;
        filter: brightness(1.05);
        position: relative;
    }
    .title {
        font-family: var(--serif);
        font-size: 24px;
        margin: auto 0;
        background: var(--bg-color);
        position: relative;
    }
    @media screen and (max-width: 700px) {
        /*.date {
            display: none;
        }*/
        .droplet {
            width: 30px;
            height: 30px;
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