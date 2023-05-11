<script>
    import { section } from "../store.js"
    import WritingRow from "./WritingRow.svelte";

    export let sectionIndex = 2;
    export let scrollY = 0;

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)


    const writings = [
        {
            date: "5/1/23",
            title: "Forest for the trees", 
            slug: "forest-for-the-trees",
            filter: "invert(94%) sepia(10%) saturate(700%) hue-rotate(52deg) brightness(83%) contrast(83%);"
        },
        {
            date: "6/1/23",
            title: "ChatGOT & other puns",
            slug: "chat-got-puns",
            filter: "invert(81%) sepia(6%) saturate(2525%) hue-rotate(178deg) brightness(86%) contrast(92%);"
        },
        {
            date: "7/1/23",
            title: "Orbital tensors, false inventions",
            slug: "orbital-tensors-false-inventions",
            filter: "invert(91%) sepia(12%) saturate(3946%) hue-rotate(186deg) brightness(92%) contrast(90%);"
        },
        {
            date: "8/1/23",
            title: "Scrollytelling with MapLibre",
            slug: "scrollytelling-maplibre",
            filter: "invert(81%) sepia(6%) saturate(2525%) hue-rotate(178deg) brightness(86%) contrast(92%);"
        }
    ]


    const newline = "&#10;"
    for(const writing of writings) {
        const date = new Date(writing.date)
        const dateFormatted = `${date.toLocaleString('default', { month: 'short' })}${newline}${date.getUTCFullYear()}`
        writing.date = dateFormatted
    }

</script>


<div id="writings" bind:this={outerContainer}>
    <div class="writings-container">
        {#each writings as writing, i}
            <WritingRow 
                {scrollY}
                {writing}
                index={i}
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