<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import Header from "./Header.svelte"
    import Footer from './Footer.svelte';

    export let dataFilename = "";

    let about;

    onMount(async () => {
        const response = await fetch(dataFilename);
        about = await response.text();
    });

</script>

<Header/>
{#if about}
	<div id="about-homepage">
	    <div class="about-container">
	        <a class="about-header">
	            <h2>A B O U T</h2>
	        </a>
	        <div class="about-body">
	        	{@html about}
	    	</div>
	    </div>
	</div> 
	<Footer/>
{/if}

<style>
	header {
        border-bottom: 0.5px solid var(--color-2);
    }
    #about-homepage {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin-top: 30px !important;
        margin-bottom: 60px !important;
        --highlight: var(--blue);
    }
    .about-container {
        width: min(95vw, 600px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .about-header {
        cursor: pointer;
        text-decoration: none;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .about-header:hover h2 {
        color: var(--color-1);
    }
    :global(.about-body a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
        filter: brightness(0.85);
    }
    :global(.about-body a:hover) {
        background: var(--highlight);
        text-decoration: none;
        border-radius: 5px;
        color: white;
        filter: brightness(1);
    }
    :global(#about-homepage p) {
    	font-size: 22px;
		line-height: 1.4;
		font-family: var(--serif);
		margin: 0 10px;
		margin-top: 15px;
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
    a:has(h2) {
        pointer-events: none;
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