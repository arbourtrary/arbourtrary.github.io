<script>
    import Header from "../../components/Header.svelte"
    import Projects from "../../components/Projects.svelte"
    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

{#if shouldHydrate}
    <Header/>
    <Projects
        dataFilename={'/data/projects-homepage.json'}
        splitByFormat={true}
        limit={null}
    />
{/if}

<style>
    header {
        border-bottom: 0.5px solid var(--color-2);
    }
</style>