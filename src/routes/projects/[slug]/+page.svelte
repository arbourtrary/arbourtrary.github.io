<script>
    import { marked } from "marked";
    import { onMount } from 'svelte';
    import { base } from '$app/paths'
    import { page } from '$app/stores';
    import { clamp, mapToUnitRange } from '../../../utils/math.js';
    import Header from '../../../components/Header.svelte';
    import Footer from '../../../components/Footer.svelte';

    export let data;

    let DEFAULT_HEIGHT = 100;
    let gallery;
    let project;
    let projectIndex;
    let prevProject;
    let nextProject;
    let content = "";
    let body;
    let response;
    let observers = [];

    marked.use({
      mangle: false,
      headerIds: false
    });

    function updateHeight(img, figure) {
        if (img?.complete) {
            const naturalRatio = img.naturalHeight / img.naturalWidth;
            const isActive = figure.classList.contains('active');

            const baseWidth = figure.offsetWidth;
            const height = baseWidth * naturalRatio;

            figure.style.height = isActive ? `${height}px` : `${DEFAULT_HEIGHT}px`;
        }
    }
      
    function handleClick(e, index) {
        const figure = e.target;
        const img = figure.querySelector("img");
        e.target.classList.toggle('active');
        updateHeight(img, figure);
    }

    function fetchContent(slug) {
        project = data.project;
        projectIndex = project.index;

        const prevIndex = clamp(projectIndex - 1, 0, data.projects.length - 1);
        prevProject = (prevIndex !== projectIndex) ? data.projects[prevIndex] : data.projects[data.projects.length - 1];

        const nextIndex = clamp(projectIndex + 1, 0, data.projects.length - 1);
        nextProject = (nextIndex !== projectIndex) ? data.projects[nextIndex] : data.projects[0];
    }

    function resetFigureStyle() {
        const figures = [...gallery.querySelectorAll("figure")];
        figures.forEach(figure => {
            if (figure) {
                figure.removeAttribute('style');
                figure.classList.remove("active");
            }
        });
    }

    const formatDate = (date) => {
        const jsDate = new Date(date)
        const month = jsDate.toLocaleString('en-US', { month: 'short' });
        const fullYear = jsDate.getFullYear();
        const formattedYear = fullYear.toString().slice(2);
        const formattedDate = `<span class="month">${month}</span> <span style="font-family:'Vollkorn'">'</span>${formattedYear}`;
        return formattedDate;
    }

    onMount(async () => {
        fetchContent(data.project.slug);

        if (observers.length) {
            observers.forEach(observer => observer.disconnect());
            observers = [];
        }

        const figures = [...gallery.querySelectorAll("figure")];
        const resizeObserver = new ResizeObserver(entries => {
          entries.forEach(entry => {
            const index = figures.indexOf(entry.target);
            if (index !== -1 && entry.contentRect.width) {
              requestAnimationFrame(() => updateHeight(index));
            }
          });
        });
        
        figures.forEach(figure => resizeObserver.observe(figure));
        figures.forEach(figure => figure && figure.removeAttribute('style'));
        observers.push(resizeObserver);
    })

    $: data && fetchContent(data.project.slug);
    $: data && gallery && resetFigureStyle();
    
</script>
<svelte:head>
    <title>{data.project.title}</title>
    <link rel='canonical' href={`https://arbourtrary.com/projects/${data.project.slug}`} />
    <meta name='description' content={data.project.description} />        
    <meta property='og:title' content={data.project.title} />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content={`https://arbourtrary.com/projects/${data.project.slug}`} />
    <meta property='og:description' content={data.project.description} />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content={data.project.socialImage} />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content={`https://arbourtrary.com/projects/${data.project.slug}`} />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content={data.project.title} />
    <meta name='twitter:description' content={data.project.description} />
    <meta name='twitter:image:src' content={data.project.socialImage} />
</svelte:head>

<Header/>
{#if data.project}
    <div class="project">
            <div class="title">
                <a href={data.project.url} target="_blank" aria-label={`project link to ${data.project.title}`}>
                {data.project.title}
                <div class="external-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-external-link"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </div>
                </a>
            </div>
    </div>
    <!-- <div class="project-date">{@html formatDate(data.project.date)}</div> -->
    {#if data.project.text}
        <div class="project-tools">
            <h2 class="section-header">Summary</h2>
            <p>{@html data.project.text}</p>
        </div>
    {/if}
    {#if data.project.tools}
        <div class="project-tools">
            <h2 class="section-header">Tools</h2>
            <p>{data.project.tools.join(", ")}</p>
        </div>
    {/if}
    {#if data.project.gallery}
        <h2 class="section-header" style="margin-bottom: 15px !important;">Gallery</h2>
        <div class="project-gallery" bind:this={gallery}>
            {#each data.project.gallery as photo, i}
                <figure 
                    on:click={(e) => handleClick(e, i)}
                >
                    <img 
                        alt={`Gallery image ${i + 1}`}
                        src={base + `/images/projects/${data.project.slug}/${photo}`}
                    />
                </figure>
            {/each}
        </div>
    {/if}
{/if}
<div class="more">
    {#if prevProject}
        <a on:click={fetchContent(prevProject.slug)} href={`/projects/${prevProject.slug}`} style="margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <p style="text-align: left;">{prevProject.title}</p>
        </a>
    {/if}
    {#if nextProject}
        <a on:click={fetchContent(nextProject.slug)} href={`/projects/${nextProject.slug}`} style="margin-left: 15px;">
            <p style="text-align: right;">{nextProject.title}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
        </a>
    {/if}
</div>
<Footer/>

<style>
    :global(:root) {
        --selection-bg-color: var(--highlight);
    }
    .project, .project-date, .content, .project-gallery, .section-header, .project-tools {
        width: min(600px, 90vw);
        margin: 0 auto;
    }
    .project {
        position: relative;
    }
    .project-date {
        padding-bottom: 15px;
        font-family: var(--serif);
        color: var(--color-2);
        font-size: 18px;
    }
    :global(.project-date .month) {
        font-size: 16px;
    }
    .project-tools {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 45px;
        margin-bottom: 45px;
    }
    h2 {
        line-height: 1;
    }
    .project-tools p {
        margin: 0;
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
    }
    .title, .content {
        font-family: var(--serif);
    }
    .title {
        cursor: pointer;
        font-size: 1.75rem;
        margin-top: 60px;
        text-align: left;
        margin-bottom: 15px;
        font-weight: bold;
        position: relative;
        padding-bottom: 1px;
        border-bottom: 1px solid var(--color-2);
        width: fit-content;
    }
    .content {
        font-size: 22px;
        margin-bottom: 15px;
    }
    .project-gallery {
        display: grid;
        gap: 10px;
        grid-template-columns: 100%;
        grid-template-rows: auto auto;
        gap: 10px;

    }
    figure {
        cursor: pointer;
/*        height: 40px;*/
        height: 100px;
        width: min(100%, 600px);
        overflow: hidden;
        margin: 0 auto;
        border-radius: 10px;
        box-shadow: 0px 0px 1px rgba(3, 7, 18, 0.02),
      0px 0px 4px rgba(3, 7, 18, 0.03),
      0px 0px 9px rgba(3, 7, 18, 0.05),
      0px 0px 15px rgba(3, 7, 18, 0.06),
      0px 0px 24px rgba(3, 7, 18, 0.08);
      transition: all 0.5s ease;
      border: 1px solid transparent;
    }
    .project-gallery figure:hover { 
        border: 1px solid var(--color-3);
    }
    .project-gallery figure:hover img { 
        opacity: 0.9;
    }
    :global(.project-gallery figure.active) {
        width: min(100%, 600px);
        max-height: unset;
        border: 1px solid var(--color-3);
    }
    :global(.project-gallery figure.active img) {
        opacity: 1;
    }
    .project a {
        text-decoration: none;
        color: var(--color-1);
        width: fit-content;
        padding-right: 20px;
    }
    img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        object-position: center;
        filter: blur(0px);
        opacity: 0.65;
        transition: all 0.5s ease;
        pointer-events: none;
    }
    :global(.project > .content a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
    }
    :global(.project > .content a:hover) {
        background: var(--highlight);
        text-decoration: none;
        border-radius: 5px;
        color: white;
    }
    :global(.project > .content > li) {
        margin: 20px 0;
    }
    :global(.project > .content > p) {
        color: var(--color-1);
        margin: 0;
        line-height: 1.5;
    }
    :global(.project > .content > h3) {
        margin-bottom: 0px;
        margin-top: 45px;
    }
    .more {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
        max-width: 600px;
        margin-bottom: 30px;
        margin-top: 30px;
        padding-top: 30px;
        border-top: 1px solid var(--color-3);
    }
    .more a {
        display: flex;
        gap: 3px;
        text-decoration: none;
        color: var(--color-1);
    }
    .more a:hover p {
        text-decoration: underline;
        color: var(--black);
    }
    .more p {
        margin: 0px;
        padding: 3px 5px;
        font-family: var(--serif);
    }
    .more svg {
        width: 16px;
        height: 16px;
        align-self: center;
    }
    .external-link {
        display: inline-block;
        height: 13px;
        width: 13px;
        position: absolute;
        top: -5px;
        padding-left: 5px;
        color: var(--color-2);
    }
    .title:hover .external-link {
        cursor: pointer;
        color: var(--black);
    }
    .title:hover {
        border-bottom: 1px solid var(--color-1);
    }
    @media only screen and (max-width: 640px) {
        .more {
            margin: 0 20px;
            margin-bottom: 15px;
            padding-top: 15px;
            margin-top: 30px;
        }
    }
    @media only screen and (max-width: 600px) {
        .title {
            font-size: 1.5em;
        }
        :global(.project > .content > p > a) {
            padding: 0px;
            text-decoration: underline;
        }
        :global(.project > .content > h3) {
            font-size: 1.2em;
        }
        .content {
            font-size: 20px;
        }
        .project-date {
            font-size: 16px;
        }
        :global(.project-date .month) {
            font-size: 14px;
        }
    }
    @media only screen and (max-width: 400px) {
         .more p {
            max-width: 125px;
        }
    }
</style>