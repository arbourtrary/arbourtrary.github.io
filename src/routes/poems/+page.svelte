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

<svelte:head>
    <title>Poems</title>
    <link rel='canonical' href="https://arbourtrary.com/poems" />
    <meta name='description' content="An ongoing collection of my poems, sometimes written out of reluctance. Sometimes in rapture." />        
    <meta property='og:title' content="Poems" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/poems" />
    <meta property='og:description' content="An ongoing collection of my poems, sometimes written out of reluctance. Sometimes in rapture." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/social_poems.jpg" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/poems" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Poems" />
    <meta name='twitter:description' content="An ongoing collection of my poems, sometimes written out of reluctance. Sometimes in rapture." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/social_poems.jpg" />
</svelte:head>
{#if shouldHydrate}
    <Header/>
    <Poems
        dataFilename={'/data/poems.json'}
        splitByYear={true}
        limit={null}
    />
    <Footer/>
{/if}