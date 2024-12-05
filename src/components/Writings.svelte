<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { section } from "../store.js"
    import WritingRow from "./WritingRow.svelte";
    import writings from '../data/writings.json';

    export let sectionIndex = 2;
    export let scrollY = 0;

    onMount(() => {
        const newline = "&#10;"
        for(const writing of writings) {
            const date = new Date(writing.date)
            const dateFormatted = `${date.toLocaleString('default', { month: 'short' })}${newline}${date.getUTCFullYear()}`
            writing.date = dateFormatted
        }
    });

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>


<div id="writings" bind:this={outerContainer}>
    <div class="writings-container">
        {#each writings as writing}
            <WritingRow 
                {writing}
            />
        {/each}
    </div>
</div> 

<style>
    #writings {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
    }
    .writings-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        min-height: 100vh;
        justify-content: center;
    }
</style>