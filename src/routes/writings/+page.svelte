<script>
    import Header from "../../components/Header.svelte"
    import Writings from "../../components/Writings.svelte"
    import Footer from '../../components/Footer.svelte';
    import writingsData from "../../data/writings.json";

    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

<svelte:head>
    <title>Writings</title>
    <link rel='canonical' href="https://arbourtrary.com/writings" />
    <meta name='description' content="" />        
    <meta property='og:title' content="Writings" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/writings" />
    <meta property='og:description' content="Somewhere to collect my thoughts / ideas / ramblings. Mostly write about nature, philosophies of time, geometry, maybe some software topics." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/arbourtrary.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/writings" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Writings" />
    <meta name='twitter:description' content="Somewhere to collect my thoughts / ideas / ramblings. Mostly write about nature, philosophies of time, geometry, maybe some software topics." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/arbourtrary.webp" />
</svelte:head>

{#if shouldHydrate}
    <Header/>
    <Writings
        writings={writingsData}
        splitByYear={true}
        limit={null}
    />
    <Footer/>
{/if}