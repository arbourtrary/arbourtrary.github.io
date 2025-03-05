<script>
    import PlatonicSolidGallery from "./PlatonicSolidGallery.svelte"

    export let scrollY = 0;
    export let projects = [];
</script>

<div id="projects">
    <PlatonicSolidGallery
        platonicSolid="dodecahedron"
        {projects}
        {scrollY}
    />  
</div>

<style>
    #projects {
        padding-bottom: 20px;
        position: relative;
    }
</style>