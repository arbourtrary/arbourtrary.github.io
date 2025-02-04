<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { section } from "../store.js"
    import ProjectRow from "./ProjectRow.svelte";

    export let dataFilename = "";
    export let splitByFormat = true;
    export let limit = 10;

    let currentFormat;
    let projects = [];

    function isUniqueFormat(format) {
        if (format !== currentFormat) {
            currentFormat = format;
            return true;
        } else {
            return false;
        }
    }

    onMount(async () => {
        projects = await loadJSON(dataFilename);
        projects.reverse();
        const newline = "&#10;"
        for(const project of projects) {
            const date = new Date(project.date)
            const month = date.getMonth() + 1;
            const fullYear = date.getFullYear();
            const formattedMonth = month < 10 ? `<span style="visibility: hidden;">1</span>${month}` : month;
            const formattedYear = fullYear.toString().slice(2);
            const dateFormatted = `${formattedMonth}/${formattedYear}`;
            project.date = dateFormatted
            project.year = fullYear;
        }
    });

</script>


<div id="projects-homepage">
    <div class="projects-container">
        <a class="projects-header" href="/projects" style={limit ? "" : "pointer-events: none"}>
            <h2>P R O J E C T S
                {#if limit}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                {/if}
            </h2>
        </a>
            
        {#each projects as project, i}
            {#if (limit && i < limit) || (!limit)}
                {#if splitByFormat && isUniqueFormat(project.format)}
                    <h2 class="format">{project.format}</h2>
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
        text-decoration: none;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .projects-header:hover h2 {
        color: var(--color-1);
    }
    h2 {
        padding-bottom: 3px;
        width: fit-content;
        margin-left: 10px;
        font-family: "Vollkorn";
        font-size: 16px;
        color: var(--color-2);
        display: flex;
        align-items: center;
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
    .see-all {
        font-family: "Vollkorn";
        color: var(--color-2);
        text-decoration: none;
        text-align: left;
        padding-top: 10px;
        width: fit-content;
        margin-left: 10px;
    }
    @media only screen and (max-width: 700px) {
        h2 {
            font-size: 13px;
        }
        h2 svg {
            position: relative;
            margin-left: 7px;
            margin-bottom: 2px;
            height: 14px;
            width: 14px;
        }
    }
</style>