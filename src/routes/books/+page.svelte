<script>
    import Header from "../../components/Header.svelte"
    import Books from "../../components/Books.svelte"
    import Footer from '../../components/Footer.svelte';
    import booksData from "../../data/books.json";
    import { onMount } from "svelte";

    let shouldHydrate = false;

    onMount(() => {
        shouldHydrate = true;
    })  
</script>

<svelte:head>
    <title>Books</title>
    <link rel='canonical' href="https://arbourtrary.com/books" />
    <meta name='description' content="Making a list of books that have really stuck with me, changed my outlook, inspired me, surprised me." />        
    <meta property='og:title' content="Books" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/books" />
    <meta property='og:description' content="Making a list of books that have really stuck with me, changed my outlook, inspired me, surprised me." />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/social_books.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/books" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Books" />
    <meta name='twitter:description' content="Making a list of books that have really stuck with me, changed my outlook, inspired me, surprised me." />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/social_books.webp" />
</svelte:head>

{#if shouldHydrate}
    <Header/>
    <Books
        books={booksData}
        limit={null}
    />
    <Footer/>
{/if}