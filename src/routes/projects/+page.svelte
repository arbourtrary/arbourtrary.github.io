<script>
    import Header from "../../components/Header.svelte"
    import Projects from "../../components/Projects.svelte"
    import Footer from '../../components/Footer.svelte';
    import projectsData from "../../data/projects-homepage.json";
    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

<svelte:head>
    <title>Projects</title>
    <link rel='canonical' href="https://arbourtrary.com/projects" />
    <meta name='description' content="Selected projects from poetry collections to published articles" />        
    <meta property='og:title' content="Projects" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/projects" />
    <meta property='og:description' content="Selected projects from poetry collections to published articles" />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/arbourtrary.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/projects" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Projects" />
    <meta name='twitter:description' content="Selected projects from poetry collections to published articles" />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/arbourtrary.webp" />
</svelte:head>
{#if shouldHydrate}
    <Header/>
    <Projects
        projects={projectsData}
        splitByFormat={true}
        limit={null}
    />
    <Footer/>
{/if}