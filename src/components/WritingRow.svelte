<script>
    import { clamp } from '../utils/math.js'
    export let writing = {};
    export let index = 0;
    export let scrollY = 0;

    let row;
    let opacity = 0;
    let percent = 0;

    $: if (row && scrollY) {
        percent = 1 - row.getBoundingClientRect().top / (window.innerHeight)
        opacity = clamp(percent < 0.5 ? 1.5 * percent : 1, 0, 1);
        // fadein til midpage then fadeout
        // opacity = percent > 0.6 ? 0.8 - (percent - 0.4) : percent < 0.4 ? 2 * percent : 0.8
    }
</script>

<a href={`/writings/${writing.slug}`}>
    <div bind:this={row} class="row" style={`opacity: ${opacity}`}>
        <!-- <div class="date">{@html writing.date}</div> -->
        <div class="droplet">
            <span style={`filter: ${writing?.filter};`}>
                <img loading="lazy" src={writing?.image} alt="watercolor droplet">
            </span>
        </div>
        <div class="title">{writing.title}</div>
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
    }
    .title {
        font-family: var(--serif);
        font-size: 24px;
        margin: auto 0;
        margin-left: 10px;
        border-bottom: 1px solid #00000000;
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