<script>
    import Header from "../../components/Header.svelte"
    import Sketches from "../../components/Sketches.svelte"
    import Footer from '../../components/Footer.svelte';
    import sketchesData from "../../data/sketches.json";
    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

<svelte:head>
    <title>Sketches</title>
    <link rel='canonical' href="https://arbourtrary.com/sketches" />
    <meta name='description' content="Little creative code ideas that could sprout into something down the line." />        
    <meta property='og:title' content="Sketches" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/sketches" />
    <meta property='og:description' content="Little creative code ideas that could sprout into something down the line." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/arbourtrary.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/sketches" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Sketches" />
    <meta name='twitter:description' content="Little creative code ideas that could sprout into something down the line." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/arbourtrary.webp" />
</svelte:head>

{#if shouldHydrate}
    <Header/>
    <Sketches
        sketches={sketchesData}
        splitByYear={true}
        limit={null}
    />
    <Footer/>
{/if}