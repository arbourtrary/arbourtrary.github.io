<script>
    import { marked } from "marked";
    import { onMount } from 'svelte';
    import { base } from '$app/paths'
    import { clamp, mapToUnitRange } from '../../../utils/math.js';
    import Header from '../../../components/Header.svelte';
    import Footer from '../../../components/Footer.svelte';

    export let data;

    let scrollY = 0;
    let poem;
    let poemIndex;
    let prevPoem;
    let nextPoem;
    let content = "";
    let body;
    let response;

    async function fetchContent(slug) {
        const filename = `/data/poems/${slug}.json`;
        response = await fetch(filename)
        content = await response.json();
    }

    onMount(async () => {
        fetchContent(data.poem.slug);
        body = document.body;
    })

    $: if (body) {
        poem = data.poem;
        fetchContent(data.poem.slug);
        poemIndex = poem.index;

        const prevIndex = clamp(poemIndex - 1, 0, data.poems.length - 1);
        prevPoem = (prevIndex !== poemIndex) ? data.poems[prevIndex] : data.poems[data.poems.length - 1];

        const nextIndex = clamp(poemIndex + 1, 0, data.poems.length - 1);
        nextPoem = (nextIndex !== poemIndex) ? data.poems[nextIndex] : data.poems[0];
    }
    
</script>
<svelte:head>
    <title>{data.poem.name}</title>
    <link rel='canonical' href={`https://arbourtrary.com/poems/${data.poem.slug}`} />
    <meta name='description' content={data.poem.description} />        
    <meta property='og:title' content={data.poem.name} />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content={`https://arbourtrary.com/poems/${data.poem.slug}`} />
    <meta property='og:description' content={data.poem.description} />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content={data.poem.socialImage} />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content={`https://arbourtrary.com/poems/${data.poem.slug}`} />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content={data.poem.name} />
    <meta name='twitter:description' content={data.poem.description} />
    <meta name='twitter:image:src' content={data.poem.socialImage} />
</svelte:head>
<svelte:window bind:scrollY/>

<Header/>
{#if content}
    <div class="poem">
        <div class="title">{data.poem.name}</div>
        <div class="content">{@html marked(content["text"].replaceAll("\n","\n\n").replaceAll("/",""))}</div>
    </div>
{/if}
<div class="more">
    {#if prevPoem}
        <a on:click={fetchContent(prevPoem.slug)} href={`/poems/${prevPoem.slug}`} style="margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <p style="text-align: left;">{prevPoem.name}</p>
        </a>
    {/if}
    {#if nextPoem}
        <a on:click={fetchContent(nextPoem.slug)} href={`/poems/${nextPoem.slug}`} style="margin-left: 15px;">
            <p style="text-align: right;">{nextPoem.name}</p>
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
    .horizontal-mirror {
        -moz-transform: scale(-1, 1);
        -o-transform: scale(-1, 1);
        -webkit-transform: scale(-1, 1);
        transform: scale(-1, 1);
    }
    .poem {
        margin: 0 10px;
        position: relative;
    }
    .header {
        height: 41px;
        margin: 0 0 10px 0;
        width: 100%;
        display: flex;
        -webkit-display: flex;
        position: fixed;
        background: var(--bg-color);
        justify-content: center;
        z-index: 1;
        padding: 10px;
        box-sizing: border-box;
        border-bottom:  0.5px solid var(--color-2);
        /*box-shadow: 0 0 1px var(--color-1)*/
        /*box-shadow: 0px 0px 40px var(--color-4);*/
    }
    .home {
        position: relative;
        padding-left: 5px;
        display: flex;
        align-items: center;
        color: var(--color-1);
        width: 29px;
    }
    .home svg {
        height: 20px;
        width: 20px;
        color: var(--color-1);
    }
    .home svg:hover {
        cursor: pointer;
        color: var(--color-1);
        stroke-width: 2;
    }
    .horizontal-spacer {
        width: 100%;
        flex: 1;
    }
    .watermark-container {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 35px;
        pointer-events: none;
    }
    .image-container {
        position: relative;
        height: 100%;
        margin: auto -6px;
    }
    .image-container img {
        height: 100%;
        width: auto;
        object-fit: contain;
        opacity: 0;
    }
    .title, .content {
        font-family: var(--serif);
    }
    .title {
        width: min(600px, 90vw);
        font-size: 1.75rem;
        margin: 0 auto;
        padding-top: 60px;
        text-align: left;
        padding-bottom: 15px;
        font-weight: bold;
    }
    .content {
        width: min(600px, 90vw);
        margin: 0 auto;
        font-size: 22px;
        margin-bottom: 60px;
    }
    :global(.content a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
    }
    :global(.content a:hover) {
        background: var(--highlight);
        text-decoration: none;
        border-radius: 5px;
        color: white;
    }
    :global(.content > li) {
        margin: 20px 0;
    }
    :global(.content > p) {
        color: var(--color-1);
        margin: 0;
        text-indent: -1em;
        padding-left: 1em;
        line-height: 1.5;
    }
    :global(.content > h3) {
        margin-bottom: 0px;
        margin-top: 45px;
    }
    :global(.bold) {
        color: var(--highlight);
        font-weight: bold;
    }
    :global(.superscript) {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -0.4em;
        text-decoration:none !important;
        color: var(--highlight);
    }
    :global(.superscript:hover) {
        text-decoration: underline;
        color: var(--color-1);
    }
    :global(.italic) {
        font-style: italic;
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
    @media only screen and (max-width: 640px) {
        :global(.notes), .more {
            margin: 0 20px;
            margin-bottom: 30px;
        }
    }
    @media only screen and (max-width: 600px) {
        .title {
            font-size: 1.5em;
        }
        :global(.content > p > a) {
            padding: 0px;
            text-decoration: underline;
        }
        :global(.content > h3) {
            font-size: 1.2em;
        }
        .content {
            font-size: 20px;
        }
    }
    @media only screen and (max-width: 400px) {
         .more p {
            max-width: 125px;
        }
    }
</style>