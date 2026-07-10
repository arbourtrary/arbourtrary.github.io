<script>
    import About from "../../components/About.svelte"

    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

<svelte:head>
    <title>About</title>
    <link rel='canonical' href="https://arbourtrary.com/about" />
    <meta name='description' content="A website to express myself through code / writing / drawing" />        
    <meta property='og:title' content="About" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/about" />
    <meta property='og:description' content="A website to express myself through code / writing / drawing" />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/arbourtrary.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/about" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="About" />
    <meta name='twitter:description' content="A website to express myself through code / writing / drawing" />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/arbourtrary.webp" />
</svelte:head>

{#if shouldHydrate}
    <About
        dataFilename={'/data/about/about.txt'}
    />
{/if}