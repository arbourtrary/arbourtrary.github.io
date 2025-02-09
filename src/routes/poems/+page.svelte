<script>
    import Header from "../../components/Header.svelte"
    import Poems from "../../components/Poems.svelte"
    import Footer from '../../components/Footer.svelte';

    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

{#if shouldHydrate}
    <Header/>
    <Poems
        dataFilename={'/data/poems.json'}
        splitByYear={true}
        limit={null}
    />
    <Footer/>
{/if}

<style>
    header {
        border-bottom: 0.5px solid var(--color-2);
    }
</style>