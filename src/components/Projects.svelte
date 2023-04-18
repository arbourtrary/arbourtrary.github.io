<script>
    import { section } from "../store.js"
    import PlatonicSolidGallery from "./PlatonicSolidGallery.svelte"
    import { onMount } from "svelte";
    import { inview } from 'svelte-inview';

    export let sectionIndex = 1;
    let projects;
    let isInView = false;
    const options = {
        rootMargin: '-50px',
        unobserveOnEnter: false,
    };

    const handleChange = ((e) => isInView = e.detail.inView);
    $: isInView && section.set(sectionIndex)
</script>

<div id="projects" bind:this={projects} use:inview={options} on:inview_change={handleChange} >
    <PlatonicSolidGallery
        filename="/data/dodechaedron.json"
        platonicSolid="dodecahedron"
    />  
</div>

<style>
    #projects {
        padding-bottom: 20px;
    }
</style>