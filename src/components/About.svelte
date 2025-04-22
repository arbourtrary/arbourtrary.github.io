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
	        <div class="about-header">
	            <h2 class="section-header">About</h2>
	        </div>
	        <div class="about-body">
	        	{@html about}
	    	</div>
	    </div>
	</div> 
	<Footer/>
{/if}

<style>
    #about-homepage {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin-top: 30px !important;
        margin-bottom: 30px !important;
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
        text-decoration: none;
        transition: all 0.3s ease;
        width: fit-content;
    }
    :global(.about-body a) {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-2);
        text-decoration-thickness: 0.5px;
        text-underline-offset: 3px;
    }
    :global(.about-body a:hover) {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-1);
        text-decoration-thickness: 1px;
    }
    :global(#about-homepage p) {
    	font-size: 22px;
		line-height: 1.4;
		font-family: var(--serif);
        margin-left: 10px;
        margin-right: 10px;
        color: var(--color-1);
    }
    :global(#about-homepage p:first-of-type) {
        margin-top: 0px;
    }
    @media only screen and (max-width: 600px) {
        :global(#about-homepage p) {
            font-size: 20px;
        }
    }
</style>