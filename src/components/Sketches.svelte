<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { section } from "../store.js"
    import SketchRow from "./SketchRow.svelte";

    export let sectionIndex = 2;
    export let scrollY = 0;
    export let dataFilename = "";
    export let splitByYear = false;
    export let limit = 10;

    let currentYear;
    let sketches = [];

    function isUniqueYear(year) {
        if (year !== currentYear) {
            currentYear = year;
            return true;
        } else {
            return false;
        }
    }

    onMount(async () => {
        sketches = await loadJSON(dataFilename);
        sketches.reverse();

        const newline = "&#10;"
        for(const sketch of sketches) {
            const date = new Date(sketch.date)
            const month = date.getMonth() + 1;
            const fullYear = date.getFullYear();
            const formattedMonth = month < 10 ? `<span style="visibility: hidden;">1</span>${month}` : month;
            const formattedYear = fullYear.toString().slice(2);
            const dateFormatted = `${formattedMonth}/${formattedYear}`;
            sketch.date = dateFormatted
            sketch.year = fullYear;
        }
    });

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>


<div id="sketches" bind:this={outerContainer}>
    <div class="sketches-container">
        <a class="sketches-header" href="/sketches" style={limit ? "" : "pointer-events: none"}>
            <h2 class="section-header">Sketches
                {#if limit}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                {/if}
            </h2>
        </a>
        {#if !limit}
            <p class="blurb">Little creative code ideas that could sprout into something down the line. Goal is to get something done quickly, let it be rough around the edges, but do just enough to create a compelling idea.</p>
        {/if}
        {#each sketches as sketch, i}
            {#if (limit && i < limit) || (!limit)}
                {#if splitByYear && isUniqueYear(sketch.year)}
                    <h3 class="year section-subhead">{sketch.year}</h3>
                {/if}
                <SketchRow 
                    {sketch}
                />
            {/if}
        {/each}
    </div>
</div> 

<style>
    #sketches {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin: 30px auto !important;
        margin-bottom: 60px !important;
    }
    .sketches-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .sketches-header {
        cursor: pointer;
        text-decoration: none !important;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .sketches-header:hover h2 {
        color: var(--color-1);
    }
    .blurb {
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        margin: 0 10px;
        margin-bottom: 15px;
    }
    h2 svg {
        position: relative;
        margin-left: 7px;
        margin-bottom: 4px;
        height: 16px;
        width: 16px;
    }
    .year {
        letter-spacing: 2px;
        margin-top: 30px;
        margin-bottom: 2px;
    }
    @media only screen and (max-width: 700px) {
        h2 svg {
            position: relative;
            margin-left: 7px;
            margin-bottom: 2px;
            height: 14px;
            width: 14px;
        }
    }
</style>