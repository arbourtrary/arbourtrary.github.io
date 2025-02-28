<script>
    import PlatonicSolidGallery from "./PlatonicSolidGallery.svelte"

    export let scrollY = 0;
    export let dataFilename = "";
</script>

<div id="projects">
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