<script>
    import { onMount } from "svelte";
    import { section } from "../store.js"
    import { base } from '$app/paths'
    import ProjectRow from "./ProjectRow.svelte";

    export let projects = [];
    export let splitByFormat = true;
    export let limit = 10;

    let currentFormat;

    function isUniqueFormat(format) {
        if (format !== currentFormat) {
            currentFormat = format;
            return true;
        } else {
            return false;
        }
    }
</script>


<div id="projects-homepage">
    <div class="projects-container">
        <a class="projects-header" href={base + "/projects"} style={limit ? "" : "pointer-events: none"}>
            <h2 class="section-header" style={`margin-left: ${limit ? "0px" : "10px"};`}>Projects
                {#if limit}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                {/if}
            </h2>
        </a>
        {#if !limit}
            <p class="blurb">Kind of a catch-all category of various things I've worked on - articles, websites, self-published books of poems.</p>
        {/if}
        {#each projects.slice().reverse() as project, i}
            {#if (limit && i < limit) || (!limit)}
                {#if splitByFormat && isUniqueFormat(project.format)}
                    <h3 class="format section-subhead">{project.format}</h3>
                {/if}
                <ProjectRow 
                    {project}
                />
            {/if}
        {/each}
    </div>
</div> 

<style>
    #projects-homepage {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin-top: 30px !important;
        margin-bottom: 60px !important;
    }
    .projects-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .projects-header {
        cursor: pointer;
        text-decoration: none !important;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .projects-header:hover h2 {
        color: var(--color-1);
    }
    .blurb {
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        margin: 0 10px;
        margin-bottom: 15px;
    }
    h2 svg {
        position: relative;
        margin-left: 7px;
        margin-bottom: 4px;
        height: 16px;
        width: 16px;
    }
    .format {
        letter-spacing: 2px;
        margin-top: 30px;
        margin-bottom: 5px;
        text-transform: uppercase;
  		font-size: 12px;
    }
    @media only screen and (max-width: 700px) {
        h2 svg {
            position: relative;
            margin-left: 7px;
            margin-bottom: 2px;
            height: 14px;
            width: 14px;
        }
    }
</style>