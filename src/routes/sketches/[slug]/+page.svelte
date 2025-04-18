<script>
    import { base } from '$app/paths'
    import Header from '../../../components/Header.svelte';
    import Footer from '../../../components/Footer.svelte';
    import SideMenu from '../../../components/SideMenu.svelte';
    import DynamicSketch from '../../../components/DynamicSketch.svelte';

    export let data;
</script>

<svelte:head>
    <link rel='canonical' href={`https://arbourtrary.com/sketches/${data.sketch.slug}`} />
    <title>{data.sketch.title}</title>
    <meta name='description' content={data.sketch.description} />        
    <meta property='og:title' content={data.sketch.title} />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content={`https://arbourtrary.com/sketches/${data.sketch.slug}`} />
    <meta property='og:description' content={data.sketch.description} />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content={data.sketch.socialImage} />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content={`https://arbourtrary.com/sketches/${data.sketch.slug}`} />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content={data.sketch.title} />
    <meta name='twitter:description' content={data.sketch.description} />
    <meta name='twitter:image:src' content={data.sketch.socialImage} />
</svelte:head>

<Header position="fixed"/>
<div class="sketch">
    <DynamicSketch componentName={data.sketch.sketch.name} />
</div>

<div class="notes">
    {@html data.sketch.content}
</div>

<div class="more">
    {#if data.sketch.prev}
        <a href={base + `/sketches/${data.sketch.prev.slug}`} style="margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <p style="text-align: left;">{data.sketch.prev.title}</p>
        </a>
    {/if}
    {#if data.sketch.next}
        <a href={base + `/sketches/${data.sketch.next.slug}`} style="margin-left: 15px;">
            <p style="text-align: right;">{data.sketch.next.title}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
        </a>
    {/if}
</div>

<Footer/>

<style>
    :global(:root) {
        --header-height: 41px;
    }
    :global(.notes) {
        max-width: 600px;
        padding: 20px 0;
        margin: 0 auto;
        margin-bottom: 30px;
    }
    :global(.notes h2) {
        font-family: var(--serif);
        color: var(--color-1);
        text-align: center;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--color-3);
    }
    :global(.notes p) {
        font-family: var(--serif);
        color: var(--color-1);
    }
    :global(.indent) {
        margin: 0px 0px 10px 30px;
    }
    :global(.indent:last-of-type) {
        margin-bottom: 0px;
    }
    :global(.indent span) {
        margin-left: 25px;
        opacity: 0.85;
        font-size: 15px;
    }
    .sketch {
    	min-height: calc(100vh - var(--header-height));
    	padding-top: calc(var(--header-height));
    	display: flex;
    	flex-direction: column;
    	justify-content: center;
        font-family: var(--serif);
    }
    .header {
        height: 41px;
        margin: 0 0 10px 0;
        width: 100%;
        display: flex;
        -webkit-display: flex;
        position: fixed;
        top: 0;
        background: var(--bg-color);
        justify-content: center;
        z-index: 99999999;
        padding: 10px;
        box-sizing: border-box;
        border-bottom:  0.5px solid var(--color-2);
    }
    .home {
        position: relative;
        display: flex;
        align-items: center;
        padding-left: 5px;
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
    .image-container {
        position: relative;
        height: 100%;
        margin: auto -6px;
        display: flex;
        align-items: center;
        flex: 1;
        width: 100%;
        justify-content: center;
    }
    :global(.notes a) {
        text-decoration: underline;
        padding: 0px 3px;
        color: var(--color-2);
    }
    :global(.notes a:hover) {
        background: var(--color-3);
        text-decoration: none;
        border-radius: 5px;
        color: white;
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

    /* TODO: Coalescing Text - find home for specific CSS elsewhere */
    :global(.plosives span) {
        filter: drop-shadow(0 0 5px var(--red)) drop-shadow(0 0 10px var(--red)) drop-shadow(0 0 15px var(--red));
    }
    :global(.fricatives span) {
        filter: drop-shadow(0 0 5px var(--orange)) drop-shadow(0 0 10px var(--orange)) drop-shadow(0 0 15px var(--orange));
    }
    :global(.nasal span, .affricates span) {
        filter: drop-shadow(0 0 5px var(--yellow)) drop-shadow(0 0 10px var(--yellow)) drop-shadow(0 0 15px var(--yellow));
    }
    :global(.liquids span, .glides span, .whisper span) {
        filter: drop-shadow(0 0 5px var(--blue)) drop-shadow(0 0 10px var(--blue)) drop-shadow(0 0 15px var(--blue));
    }
    :global(.front span) {
        filter: drop-shadow(0 0 5px var(--green)) drop-shadow(0 0 10px var(--green)) drop-shadow(0 0 15px var(--green));
    }
    :global(.mid span) {
        filter: drop-shadow(0 0 5px var(--indigo)) drop-shadow(0 0 10px var(--indigo)) drop-shadow(0 0 15px var(--indigo));
    }
    :global(.dipthongs span, .back span) {
        filter: drop-shadow(0 0 5px var(--purple)) drop-shadow(0 0 10px var(--purple)) drop-shadow(0 0 15px var(--purple));
    }
    .more {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin: 0 auto;
        margin-bottom: 30px;
        max-width: 600px;
        padding-top: 30px;
        border-top: 1px solid var(--color-3);;
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
    }
    .more svg {
        width: 16px;
        height: 16px;
        align-self: center;
    }
    @media only screen and (max-width: 640px) {
        :global(.notes), .more {
            margin: 0 20px;
            margin-bottom: 15px;
            padding-top: 15px;
            margin-top: 30px;
        }
    }
    @media only screen and (max-width: 600px) {
        :global(.indent) {
            margin-left: 20px;
        }
        :global(.indent span) {
            margin-left: 15px;
            font-size: 14px;
        }
    }
    @media only screen and (max-width: 400px) {
         .more p {
            max-width: 125px;
        }
    }
</style>