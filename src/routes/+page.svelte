<script>
    import { onMount } from "svelte";
    import { base } from '$app/paths'
    import { bgColor, textColor1, textColor2, textColor3, textColor4, white } from '../store.js'
    import Header from "../components/Header.svelte"
    import Progress from "../components/Progress.svelte"
    import Intro from "../components/Intro.svelte"
    import PlatonicProjects from "../components/PlatonicProjects.svelte"
    import Poems from "../components/Poems.svelte"
    import Writings from "../components/Writings.svelte"
    import Sketches from "../components/Sketches.svelte"
    import Contact from "../components/Contact.svelte"
    import HoneycombImages from "../components/HoneycombImages.svelte"
    import sketchesData from "../data/sketches.json";
    import poemsData from "../data/poems.json";
    import writingsData from "../data/writings.json";
    import projectsData from "../data/projects.json";
    import musicData from "../data/music.json";

    let scrollY = 0;
    let innerWidth;
    let shouldHydrate = true;

    // onMount(() => {
    //     innerWidth = window.innerWidth;
    //     window.addEventListener('resize', () => {
    //       let vh = window.outerHeight * 0.01;
    //       document.documentElement.style.setProperty('--vh', `${vh}px`);
    //     });
    //     bgColor.set(window.getComputedStyle(document.body).getPropertyValue('--bg-color'))
    //     textColor1.set(window.getComputedStyle(document.body).getPropertyValue('--color-1'))
    //     textColor2.set(window.getComputedStyle(document.body).getPropertyValue('--color-2'))
    //     textColor3.set(window.getComputedStyle(document.body).getPropertyValue('--color-3'))
    //     textColor4.set(window.getComputedStyle(document.body).getPropertyValue('--color-4'))
    //     white.set(window.getComputedStyle(document.body).getPropertyValue('--white'))
    //     shouldHydrate = true;
    // })  
</script>

<svelte:window bind:scrollY bind:innerWidth/>

<svelte:head>
    <title>ɑrbərtrɛri</title>
    <link rel='canonical' href='https://arbourtrary.com' />

    <meta name='description' content='Trying out a couple concepts. Writing about nature, tech, poetry, mathematics. Providing safe arbour in a darkening forest.' />
        
    <meta property='og:title' content='arbourtrary' />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content='https://arbourtrary.com' />
    <meta property='og:description' content='Trying out a couple concepts. Writing about nature, tech, poetry, mathematics. Providing safe arbour in a darkening forest.' />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content='https://arbourtrary.com/images/arbourtrary.webp' />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content='https://arbourtrary.com' />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content='arbourtrary' />
    <meta name='twitter:description' content='Trying out a few concepts. Writing about nature, tech, poetry, mathematics. Providing safe arbour in a darkening forest.' />
    <meta name='twitter:image:src' content='https://arbourtrary.com/images/arbourtrary.webp' />
</svelte:head>

{#if shouldHydrate}
    <!-- Sticky elements -->
    <Header
        position="fixed"
    />
    <Progress {scrollY}/>

    <!-- Sections -->
    <Intro/>
    <hr>
    <Sketches
        sketches={sketchesData}
    />
    <Poems
        poems={poemsData}
    />
    <Writings
        writings={writingsData}
    />
    <hr>
    <PlatonicProjects
        projects={projectsData}
        {scrollY}
    />
    <hr>
    <HoneycombImages
        music={musicData}
    />
    <hr>
    <Contact
        {scrollY}
    />   
{/if}

<style>
    :global(#about), :global(#projects), :global(#writings), :global(#sketches), :global(#poems), :global(#music) {
        width: min(95vw, 1100px) !important;
        margin: 0 auto !important;
    }
    :global(img) {
        color: transparent !important;
    }
    hr {
        display: block;
        height: 1px;
        border: 0;
        width: min(90vw, 1100px) !important;
        border-top: 1px solid var(--color-3);
        margin: 25px auto !important;
        padding: 0;
        border-radius: 50%;
        opacity: 0.9;
    }
</style>