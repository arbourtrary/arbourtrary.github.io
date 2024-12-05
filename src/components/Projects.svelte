<script>
    import { section } from "../store.js"
    import PlatonicSolidGallery from "./PlatonicSolidGallery.svelte"

    export let sectionIndex = 1;
    export let scrollY = 0;
    export let dataFilename = "";

    let outerContainer;
    $: offset = window.innerHeight / 2
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>

<div id="projects" bind:this={outerContainer}>
    <PlatonicSolidGallery
        platonicSolid="dodecahedron"
        {dataFilename}
        {scrollY}
    />  
</div>

<style>
    #projects {
        padding-bottom: 20px;
        position: relative;
    }
</style>