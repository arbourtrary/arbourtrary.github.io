<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { section } from "../store.js"
    import SketchRow from "./SketchRow.svelte";
    import sketches from '../data/sketches.json';

    export let sectionIndex = 2;
    export let scrollY = 0;

    onMount(() => {
        const newline = "&#10;"
        for(const sketch of sketches) {
            const date = new Date(sketch.date)
            const dateFormatted = `${date.toLocaleString('default', { month: 'short' })}${newline}${date.getUTCFullYear()}`
            sketch.date = dateFormatted
        }
    });

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>


<div id="sketches" bind:this={outerContainer}>
    <div class="sketches-container">
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
    }
    .sketches-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        min-height: 100vh;
        justify-content: center;
    }
</style>