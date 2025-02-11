<script>
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import Header from "./Header.svelte"
    import Book from "./Book.svelte"
    import Footer from './Footer.svelte';

    export let dataFilename = "";

    let books = [];

    onMount(async () => {
        const response = await fetch(dataFilename);
        books = await response.json();
        console.log(books)
    });

</script>

<Header/>
{#if books}
	<div id="books-homepage">
	    <div class="books-container">
	        <div class="books-header">
	            <h2 class="section-header">Books</h2>
	        </div>

            <p class="blurb">Making a list of books that have really stuck with me, changed my outlook, inspired me, surprised me. The book image effect comes from the fascinating art of <a href="https://www.kensukekoike.com/" target="_blank">Kensuke Koike</a> - which I translated into code.</p>

            <div class="books">
                {#each books as book}
        	        <Book {book}/>
                {/each}
            </div>
	    </div>
	</div> 
	<Footer/>
{/if}

<style>
    #books-homepage {
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
    .books-container, .books {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .books {
        margin-top: 15px;
        gap: 45px;
    }
    .books-header {
        text-decoration: none;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .blurb {
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        margin: 0 10px;
        margin-bottom: 15px;
    }
    :global(.books-body a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
        filter: brightness(0.85);
    }
    :global(.books-body a:hover) {
        background: var(--highlight);
        text-decoration: none;
        border-radius: 5px;
        color: white;
        filter: brightness(1);
    }
    a {
        text-decoration: none;
        padding: 0px 3px;
        color: var(--blue);
    }
    a:hover {
        background: var(--blue);
        text-decoration: none;
        border-radius: 5px;
        color: white;
    }
    @media only screen and (max-width: 600px) {
        .books {
            gap: 30px;
        }
    }
</style>