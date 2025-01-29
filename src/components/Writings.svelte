<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { section } from "../store.js"
    import WritingRow from "./WritingRow.svelte";

    export let sectionIndex = 2;
    export let scrollY = 0;
    export let dataFilename = "";

    let writings = [];

    onMount(async () => {
        writings = await loadJSON(dataFilename);
        writings.reverse();
        const newline = "&#10;"
        for(const writing of writings) {
            const date = new Date(writing.date)
            const month = date.getMonth() + 1;
            const formattedMonth = month < 10 ? `<span style="visibility: hidden;">1</span>${month}` : month;
            const formattedYear = date.getFullYear().toString().slice(2);
            const dateFormatted = `${formattedMonth}/${formattedYear}`;
            writing.date = dateFormatted
        }
    });

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>


<div id="writings" bind:this={outerContainer}>
    <div class="writings-container">
        <h2>W R I T I N G S</h2>
        {#each writings as writing, i}
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
        padding-top: 60px!important;
        margin-top: 60px !important;
    }
    .writings-container {
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
    @media only screen and (max-width: 700px) {
        h2 {
            font-size: 13px;
        }
    }
    @media only screen and (max-width: 600px) {
        #writings {
            padding-top: 45px!important;
            margin-top: 15px !important;
        }
    }
</style>