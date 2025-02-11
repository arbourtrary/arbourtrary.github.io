<script>
    import Header from "../../components/Header.svelte"
    import Sketches from "../../components/Sketches.svelte"
    import Footer from '../../components/Footer.svelte';

    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

{#if shouldHydrate}
    <Header/>
    <Sketches
        dataFilename={'/data/sketches.json'}
        splitByYear={true}
        limit={null}
    />
    <Footer/>
{/if}