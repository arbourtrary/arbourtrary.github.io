<script>
    import { marked } from "marked";
    import { base } from "$app/paths";
    import Header from '../../../components/Header.svelte';
    import Footer from '../../../components/Footer.svelte';

    export let data;
    let randomButton;

    marked.use({
      mangle: false,
      headerIds: false
    });

    const formatDate = (date) => {
        const jsDate = new Date(date)
        const month = jsDate.toLocaleString('en-US', { month: 'short' });
        const fullYear = jsDate.getFullYear();
        const formattedDate = `<span class="month">${month}</span> ${fullYear}`;
        return formattedDate;
    }

    const getRandomPoemUrl = () => {
        const slug = data.slugs[Math.round(Math.random() * (data.slugs.length - 1))];
        const url = base + `/poems/${slug}`;
        if (randomButton) {
            randomButton.href = url;
        }
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

<Header/>
{#if data.poem.content}
    <div class="poem">
        <div class="title">{@html data.poem.name}</div>
        <div class="content">{@html marked(data.poem.content.text.replaceAll("\n","\n\n").replaceAll("/",""))}</div>
    </div>
    <div class="poem-date">{@html formatDate(data.poem.date)}</div>
{/if}
<div class="more">
    {#if data.poem.prev}
        <a href={base + `/poems/${data.poem.prev.slug}`} style="width: 50%; margin-right: 15px; margin-left: 0px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <p style="text-align: left;">{data.poem.prev.name}</p>
        </a>
    {:else}
        <div style="width: 50%; margin-right: 15px;"></div>
    {/if}
    <a on:click={getRandomPoemUrl} bind:this={randomButton}>
        <svg xmlns="http://www.w3.org/2000/svg" class="shuffle" height="22px" fill="currentColor"viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"/>
            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"/>
        </svg>
    </a>
    {#if data.poem.next}
        <a href={base + `/poems/${data.poem.next.slug}`} style="width: 50%; margin-left: 15px; margin-right: 0px; justify-content: end;">
            <p style="text-align: right;">{data.poem.next.name}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
            </svg>
        </a>
    {:else}
        <div style="width: 50%; margin-left: 15px;"></div>
    {/if}
</div>
<Footer/>

<style>
    :global(:root) {
        --selection-bg-color: var(--highlight);
    }
    .poem {
        margin: 0 10px;
        position: relative;
    }
    .poem-date {
        width: min(600px, 90vw);
        margin: 0 auto;
        padding-bottom: 15px;
        font-family: var(--serif);
        color: var(--color-2);
        font-size: 18px;
    }
    :global(.poem-date .month) {
        font-size: 16px;
    }
    .title, .content {
        font-family: var(--serif);
        color: var(--color-1);
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
        margin-bottom: 15px;
    }
    :global(.poem > .content a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
    }
    :global(.poem > .content a:hover) {
        background: var(--highlight);
        text-decoration: none;
        border-radius: 5px;
        color: white;
    }
    :global(.poem > .content > li) {
        margin: 20px 0;
    }
    :global(.poem > .content > p) {
        color: var(--color-1);
        margin: 0;
        text-indent: -1em;
        padding-left: 1em;
        line-height: 1.5;
    }
    :global(.poem > .content > h3) {
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
        color: var(--color-1);
    }
    .more p {
        margin: 0px;
        padding: 3px 5px;
        font-family: var(--serif);
        max-width: 170px;
    }
    .more svg {
        width: 16px;
        height: 16px;
        align-self: center;
    }
    .more svg.shuffle {
        height: 17px;
        width: auto;
        color: var(--color-2);
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .more svg.shuffle:hover {
        color: var(--color-1);
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
            padding-top: 45px;
        }
        :global(.poem > .content > p > a) {
            padding: 0px;
            text-decoration: underline;
        }
        :global(.poem > .content > h3) {
            font-size: 1.2em;
        }
        .content {
            font-size: 20px;
        }
        .poem-date {
            font-size: 16px;
        }
        :global(.poem-date .month) {
            font-size: 14px;
        }
        .more p { 
            max-width: 120px;
        }
    }
    @media only screen and (max-width: 400px) {
         .more p {
            max-width: 100px;
        }
    }
</style>