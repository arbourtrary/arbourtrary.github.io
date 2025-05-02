<script>
    import { section } from "../store.js"
    import { base } from '$app/paths'
    import SideMenu from "./SideMenu.svelte"

    let header;
    export let position = "relative";
    let titles = [];
    $: if (header) {
        titles = header.querySelectorAll(".title")
    }

    $: if (titles.length) {
        titles.forEach((x, i) => { i !== $section && x.classList.remove("active") });
        titles[$section].classList.add("active")
    }
</script>

<div class="header" bind:this={header} style={`position: ${position}`}>
    <button on:click={() => document.documentElement.classList.toggle('dark-theme')} aria-label="Theme toggle">
        <div class="home">
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke-width="1.5" stroke="currentColor" version="1.1" viewBox="0 0 20 20">
              <path class="st0" d="M8.5,2.3c.2.2.2.6,0,.9-.6,1.1-.9,2.3-.9,3.5,0,4,3.3,7.3,7.3,7.3.5,0,1,0,1.5-.2.3,0,.6,0,.8.3.2.3.2.6,0,.9-1.6,2-4,3.1-6.5,3.1-4.6,0-8.3-3.7-8.3-8.3S4.6,3.3,7.6,2.1c.3-.1.7,0,.9.2"/>
            </svg>
        </div>
    </button>
    <div class="image-container">
        <div class="header-circle" style="margin-right: -2px; width: 10px; height: 10px; background: var(--red);">&nbsp;</div>
        <div class="header-circle" style="margin-right: -3px; width: 14px; height: 14px; background: var(--orange);">&nbsp;</div>
        <div class="header-circle" style="margin-right: -6px; width: 20px; height: 20px; background: var(--yellow);">&nbsp;</div>
        <div class="header-circle" style="width: 25px; height: 25px; background: var(--green);">&nbsp;</div>
        <div class="header-circle" style="margin-left: -6px; width: 20px; height: 20px; background: var(--blue);">&nbsp;</div>
        <div class="header-circle" style="margin-left: -3px; width: 14px; height: 14px; background: var(--indigo);">&nbsp;</div>
        <div class="header-circle" style="margin-left: -2px; width: 10px; height: 10px; background: var(--purple);">&nbsp;</div>
    </div>
    <SideMenu/>
</div>

<style>
    :root {
        --circle-opacity: 0.5;
        --theme-fill: none;
    }
    :root.dark-theme {
        --circle-opacity: 0.8;
        --theme-fill: var(--color-1);
    }
    .header {
        height: 41px;
        width: 100vw;
        margin: 0 auto;
        top: 0px;
        left: 0px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        background: var(--bg-color);
        transition: all 0.3s ease;
        z-index: 100;
        padding: 10px;
        box-sizing: border-box;
        border-bottom: 0.5px solid var(--color-2);
    }
    .header-circle {
        border-radius: 50%;
        opacity: var(--circle-opacity);
    }
    button {
        border: none;
        padding: 0px;
        margin: 0px;
        background: none;
        width: 20px;
    }
    .home {
        color: var(--color-1);
        padding-left: 5px;
        display: flex;
        align-items: center;
        width: 29px;
    }
    .home svg {
        height: 20px;
        width: 20px;
        fill: var(--theme-fill);
    }
    .home svg:hover {
        cursor: pointer;
        color: var(--color-1);
    }
    .image-container {
        position: relative;
        height: 100%;
        margin: auto;
        display: flex;
        align-items: center;
        flex: 1;
        width: 100%;
        justify-content: center;
    }
</style>