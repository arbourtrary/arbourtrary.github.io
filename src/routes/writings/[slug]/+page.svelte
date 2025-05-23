<script>
    import { marked } from "marked";
    import { onMount } from 'svelte';
    import { base } from '$app/paths'
    import { clamp, mapToUnitRange } from '../../../utils/math.js';
    import Footer from '../../../components/Footer.svelte';
    import SideMenu from '../../../components/SideMenu.svelte';

    export let data;
    let body;

    marked.use({
      mangle: false,
      headerIds: false
    });

    let scrollY = 0;

    onMount(async () => {
        body = document.body;
    })

    function formatContent(content) {
        return marked(content.replaceAll('src="/images', `src="${base}/images`))
    }
        
    $: body && document.documentElement.style.setProperty('--highlight', data.writing.highlight);
    $: scrollProgress = body && clamp(scrollY / (body.scrollHeight - window.innerHeight), 0, 1)
</script>
<svelte:head>
    <title>{data.writing.title}</title>
    <link rel='canonical' href={`https://arbourtrary.com/writings/${data.writing.slug}`} />
    <meta name='description' content={data.writing.description} />        
    <meta property='og:title' content={data.writing.title} />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content={`https://arbourtrary.com/writings/${data.writing.slug}`} />
    <meta property='og:description' content={data.writing.description} />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content={data.writing.socialImage} />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content={`https://arbourtrary.com/writings/${data.writing.slug}`} />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content={data.writing.title} />
    <meta name='twitter:description' content={data.writing.description} />
    <meta name='twitter:image:src' content={data.writing.socialImage} />
</svelte:head>
<svelte:window bind:scrollY/>

<div class="header">
    <a on:click={() => document.documentElement.classList.toggle('dark-theme')} aria-label="Homepage link">
        <div class="home">
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke-width="1.5" stroke="currentColor" version="1.1" viewBox="0 0 20 20">
                <path class="st0" d="M8.5,2.3c.2.2.2.6,0,.9-.6,1.1-.9,2.3-.9,3.5,0,4,3.3,7.3,7.3,7.3.5,0,1,0,1.5-.2.3,0,.6,0,.8.3.2.3.2.6,0,.9-1.6,2-4,3.1-6.5,3.1-4.6,0-8.3-3.7-8.3-8.3S4.6,3.3,7.6,2.1c.3-.1.7,0,.9.2"/>
            </svg>
        </div>
    </a>

    <div class="horizontal-spacer"></div>
    <div class="watermark-container">
        <!-- TODO: Refactor for a loop - I think this test worked well enough though -->
        <div class="image-container"  style="height: 40%;">
            <img alt="droplet" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, 0, .25)) * 100}%);
                opacity: ${clamp(0 + mapToUnitRange(scrollProgress, 0, .25), 0, 1)}
            `}/>
        </div>
        <div class="image-container" style="height: 50%;">
            <img alt="droplet" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .25, .5)) * 100}%);
                opacity: ${clamp(0 + mapToUnitRange(scrollProgress, 0.25, .5, 0, 1))}
            `}/>
        </div>
        <div class="image-container" style="height: 80%;">
            <img alt="droplet" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .5, .75)) * 100}%);
                opacity: ${clamp(0 + mapToUnitRange(scrollProgress, 0.5, .75, 0, 1))}
            `}/>
        </div>
        <div class="image-container">
            <img alt="droplet" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .75, 1)) * 100}%);
                opacity: ${0 + mapToUnitRange(scrollProgress, 0.75, 1)}
            `}/>
            <img alt="droplet" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .75, 1)) * 100}%);
                opacity: ${0 + mapToUnitRange(scrollProgress, 0.75, 1)};
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%, 0) scale(-1,1);
            `}/>
        </div>
        <div class="image-container"  style="height: 80%;">
            <img alt="droplet" class="horizontal-mirror" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .5, .75)) * 100}%);
                opacity: ${clamp(0 + mapToUnitRange(scrollProgress, .5, .75), 0, 1)}
            `}/>
        </div>
        <div class="image-container" style="height: 50%;">
            <img alt="droplet" class="horizontal-mirror" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .25, .5)) * 100}%);
                opacity: ${clamp(0 + mapToUnitRange(scrollProgress, .25, .5), 0, 1)}
            `}/>
        </div>
        <div class="image-container"  style="height: 40%;">
            <img alt="droplet" class="horizontal-mirror" src={base + data.writing.image} style={`
                filter: ${data.writing.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, 0, .25)) * 100}%);
                opacity: ${clamp(0 + mapToUnitRange(scrollProgress, 0, .25), 0, 1)};
            `}/>
        </div>
    </div>
    <SideMenu/>
</div>
<div class="writ">
    <div class="title">{data.writing.title}</div>
    <div class="content">{@html formatContent(data.writing.content)}</div>
</div>
<div class="more">
    {#if data.writing.prev}
        <a href={base + `/writings/${data.writing.prev.slug}`} style="margin-right: 15px; margin-left: 0px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <p style="text-align: left;">{data.writing.prev.title}</p>
        </a>
    {:else}
        <p></p>
    {/if}
    {#if data.writing.next}
        <a href={base + `/writings/${data.writing.next.slug}`} style="margin-left: 15px; margin-right: 0px;">
            <p style="text-align: right;">{data.writing.next.title}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
        </a>
    {:else}
        <p></p>
    {/if}
</div>
<Footer/>

<style>
    :root {
        --circle-opacity: 0.5;
        --theme-fill: none;
    }
    :root.dark-theme {
        --circle-opacity: 0.8;
        --theme-fill: var(--color-1);
    }
    :global(:root) {
        --selection-bg-color: var(--highlight);
    }
    .horizontal-mirror {
        -moz-transform: scale(-1, 1);
        -o-transform: scale(-1, 1);
        -webkit-transform: scale(-1, 1);
        transform: scale(-1, 1);
    }
    .writ {
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
        transition: background 0.3s ease;
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
        fill: var(--theme-fill);
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
        color: var(--color-1);
    }
    .title {
        width: min(600px, 90vw);
        font-size: 2.4em;
        margin: 0 auto;
        padding-top: 80px;
        text-align: center;
    }
    .content {
        width: min(600px, 90vw);
        margin: 0 auto;
        font-size: 22px;
        line-height: 1.4;
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
        color: var(--color-1);
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
        .more {
            margin: 0 20px;
            margin-bottom: 15px;
            padding-top: 15px;
            margin-top: 30px;
        }
    }
    @media only screen and (max-width: 600px) {
        .title {
            font-size: 2em;
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