<script>
    import { section } from "../store.js"

    let header;
    let titles = [];
    $: if (header) {
        titles = header.querySelectorAll(".title")
    }

    $: if (titles.length) {
        titles.forEach((x, i) => { i !== $section && x.classList.remove("active") });
        titles[$section].classList.add("active")
    }
</script>

<div class="header" bind:this={header}>
    <div class="title active"><a on:click={() => section.set(0)} href="#about">About</a></div>
    <div class="title"><a on:click={() => section.set(1)} href="#projects">Projects</a></div>
    <div class="title"><a on:click={() => section.set(2)} href="#blog">Blog</a></div>
    <div class="title"><a on:click={() => section.set(3)} href="#contact">Contact</a></div>
</div>

<style>
    .header {
        width: 100vw;
        margin: 0 auto;
        position: fixed;
        top: 0px;
        left: 0px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        padding-top: 30px;
        background: #f6f5f1;
        /*background: white;*/
        z-index: 10;
        padding-bottom: 20px;
    }
    .title {
        width: 100px;
        font-size: 15px;
        text-transform: uppercase;
        font-family: 'IM Fell English';
        font-weight: 300;
        letter-spacing: 2px;
        text-align: center;
        margin: 0px 40px;
        padding-bottom: 5px;
        color: lightgray !important;
        border-bottom: 1px solid lightgray;
        transition: all 300ms ease-out;
    }
    .title.active {
        color: black !important;
        border-bottom: 1px solid black !important;
    }
    .title a {
        text-decoration: none;
        color: inherit !important;
    }
    @media screen and (max-width: 1000px) {
        .title {
            padding-top: min(2vh, 12px);
            width: auto;
            font-size: 12px;
            letter-spacing: 2px;
            margin: 0px 16px;
            padding-bottom: 2px;
        }
        .header {
/*            box-shadow: 
                0px 0px 10px white,
                0px 0px 10px white,
                0px 0px 10px white,
                0px 0px 10px white,
                0px 0px 10px white;*/
            box-shadow: 
                0px 0px 10px #f6f5f1,
                0px 0px 10px #f6f5f1,
                0px 0px 10px #f6f5f1,
                0px 0px 10px #f6f5f1,
                0px 0px 10px #f6f5f1;
            padding:  0;
        }
    }
</style>