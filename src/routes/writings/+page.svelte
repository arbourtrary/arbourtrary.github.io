<script>
    import Header from "../../components/Header.svelte"
    import Writings from "../../components/Writings.svelte"
    import Footer from '../../components/Footer.svelte';

    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

{#if shouldHydrate}
    <Header/>
    <Writings
        dataFilename={'/data/writings.json'}
        splitByYear={true}
        limit={null}
    />
    <Footer/>
{/if}