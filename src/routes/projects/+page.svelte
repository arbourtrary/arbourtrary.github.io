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

{#if shouldHydrate}
    <Header/>
    <Projects
        projects={projectsData}
        splitByFormat={true}
        limit={null}
    />
    <Footer/>
{/if}