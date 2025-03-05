<script>
    import Header from "../../components/Header.svelte"
    import Music from "../../components/Music.svelte"
    import Footer from '../../components/Footer.svelte';
    import musicData from "../../data/music.json";
    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

<svelte:head>
    <title>Music</title>
    <link rel='canonical' href="https://arbourtrary.com/music" />
    <meta name='description' content="" />        
    <meta property='og:title' content="Music" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/music" />
    <meta property='og:description' content="Tracing a quasi-chronological path through the evolution of my musical taste. So many incredible songs and genres." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/social_music.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/music" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Music" />
    <meta name='twitter:description' content="Tracing a quasi-chronological path through the evolution of my musical taste. So many incredible songs and genres." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/social_music.webp" />
</svelte:head>

{#if shouldHydrate}
    <Header/>
    <Music
        music={musicData}
        limit={null}
    />
    <Footer/>
{/if}