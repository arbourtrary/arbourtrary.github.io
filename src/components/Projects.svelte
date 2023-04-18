<script>
    import { section } from "../store.js"
    import PlatonicSolidGallery from "./PlatonicSolidGallery.svelte"

    export let sectionIndex = 1;
    export let scrollY = 0;
    let outerContainer;
    $: offset = window.innerHeight / 2
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)
</script>

<div id="projects" bind:this={outerContainer}>
    <PlatonicSolidGallery
        filename="/data/dodechaedron.json"
        platonicSolid="dodecahedron"
        {scrollY}
    />  
</div>

<style>
    #projects {
        padding-bottom: 20px;
        position: relative;
    }
</style>