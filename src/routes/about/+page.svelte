<script>
    import About from "../../components/About.svelte"

    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

{#if shouldHydrate}
    <About
        dataFilename={'/data/about/about.txt'}
    />
{/if}