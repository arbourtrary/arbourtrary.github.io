<script>
    import { onMount } from 'svelte';
    import { clamp, mapToUnitRange } from '../../../utils/math.js';
    export let data;
    let scrollY = 0;

    let body;
    let html;
    onMount(() => {
        body = document.body;
        html = document.documentElement;
    })

    $: pageHeight = body && html && Math.max(
        body.scrollHeight,
        body.offsetHeight, 
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
    );
    $: scrollProgress = pageHeight && clamp(scrollY / (pageHeight - window.innerHeight), 0, 1)
</script>

<svelte:window bind:scrollY/>

<div class="header">
    <a href="https://arbourtrary.com">
        <div class="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
    </a>
    <!-- TODO: Refactor for a loop - I think this test worked well enough though -->
    <div class="image-container"  style="height: 30%;">
        <img src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, 0, .25)) * 100}%);
            opacity: ${clamp(0.4 + mapToUnitRange(scrollProgress, 0, .25), 0.4, 1)}
        `}/>
    </div>
    <div class="image-container" style="height: 40%;">
        <img src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .25, .5)) * 100}%);
            opacity: ${clamp(0.4 + mapToUnitRange(scrollProgress, 0.25, .5, 0.4, 1))}
        `}/>
    </div>
    <div class="image-container" style="height: 70%;">
        <img src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .5, .75)) * 100}%);
            opacity: ${clamp(0.4 + mapToUnitRange(scrollProgress, 0.5, .75, 0.4, 1))}
        `}/>
    </div>
    <div class="image-container">
        <img src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .75, 1)) * 100}%);
            opacity: ${0.2 + mapToUnitRange(scrollProgress, 0.75, 1) / 2}
        `}/>
        <img src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .75, 1)) * 100}%);
            opacity: ${0.2 + mapToUnitRange(scrollProgress, 0.75, 1) / 2};
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, 0) scale(-1,1);
        `}/>
    </div>
    <div class="image-container"  style="height: 70%;">
        <img class="horizontal-mirror" src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .5, .75)) * 100}%);
            opacity: ${clamp(0.4 + mapToUnitRange(scrollProgress, .5, .75), 0.4, 1)}
        `}/>
    </div>
    <div class="image-container" style="height: 40%;">
        <img class="horizontal-mirror" src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, .25, .5)) * 100}%);
            opacity: ${clamp(0.4 + mapToUnitRange(scrollProgress, .25, .5), 0.4, 1)}
        `}/>
    </div>
    <div class="image-container"  style="height: 30%;">
        <img class="horizontal-mirror" src={data.image} style={`
            filter: ${data.filter} grayscale(${(1 - mapToUnitRange(scrollProgress, 0, .25)) * 100}%);
            opacity: ${clamp(0.4 + mapToUnitRange(scrollProgress, 0, .25), 0.4, 1)};
        `}/>
    </div>
    <a href="https://arbourtrary.com">
        <div class="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
        </div>
    </a>
</div>
<div class="writ">
    <div class="title">{data.title}</div>
    <div class="content">{@html data.content}</div>
</div>

<style>
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
        height: 50px;
        margin: 0 0 10px 0;
        width: 100%;
        display: flex;
        -webkit-display: flex;
        position: fixed;
        background: var(--bg-color);
        justify-content: center;
        z-index: 1;
        padding: 5px 0;
        /*box-shadow: 0px 0px 40px var(--color-4);*/
    }
    .home {
        position: absolute;
        left: 15px;
    }
    .home svg {
        height: 50px;
        width: 22px;
        color: var(--color-2);
    }
    .home svg:hover {
        cursor: pointer;
        color: var(--color-1);
        stroke-width: 2;
    }
    .image-container {
        position: relative;
        height: 100%;
        width: auto;
        margin: auto 2px;
    }
    .image-container img {
        height: 100%;
        width: auto;
        object-fit: contain;
        opacity: 0.1;
    }
    .title, .content {
        font-family: var(--serif);
    }
    .title {
        width: min(600px, 90vw);
        font-size: 2em;
        margin: 0 auto;
        padding-top: 80px;
        text-align: center;
    }
    .content {
        width: min(600px, 90vw);
        margin: 0 auto;
        font-size: 20px;
    }
</style>