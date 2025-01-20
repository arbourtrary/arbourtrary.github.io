<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { section } from "../store.js"
    import SketchRow from "./SketchRow.svelte";

    export let sectionIndex = 2;
    export let scrollY = 0;
    export let dataFilename = "";

    let sketches = [];

    onMount(async () => {
        sketches = await loadJSON(dataFilename);
        sketches.reverse();
        const newline = "&#10;"
        for(const sketch of sketches) {
            const date = new Date(sketch.date)
            const month = date.getMonth() + 1;
            const formattedMonth = month < 10 ? `<span style="visibility: hidden;">1</span>${month}` : month;
            const formattedYear = date.getFullYear().toString().slice(2);
            const dateFormatted = `${formattedMonth}/${formattedYear}`;
            sketch.date = dateFormatted
        }
    });

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>


<div id="sketches" bind:this={outerContainer}>
    <div class="sketches-container">
        <h2>S K E T C H E S</h2>
        {#each sketches as sketch, i}
            <SketchRow 
                {scrollY}
                {sketch}
                index={i}
            />
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
        padding: 60px 0 !important;
        margin: 60px auto !important;
    }
    .sketches-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    h2 {
        padding-bottom: 3px;
        width: fit-content;
        margin-left: 10px;
        color: var(--color-2);
        font-family: "Vollkorn";
        font-size: 16px;
    }
    @media only screen and (max-width: 600px) {
        #sketches {
            padding: 45px 0 !important;
            margin: 15px auto !important;
        }
    }
</style>