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
    <a on:click={() => section.set(0)} href="#about" class="title active">About</a>
    <a on:click={() => section.set(1)} href="#projects" class="title">Projects</a>
    <a on:click={() => section.set(2)} href="#writings" class="title">Writings</a>
    <a on:click={() => section.set(3)} href="#sketches" class="title">Sketches</a>
    <a on:click={() => section.set(4)} href="#contact" class="title">Contact</a>
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
        background: var(--bg-color);
        z-index: 10;
        padding: 20px 0;
        pointer-events: none;
        box-shadow: 
            0px 0px 10px var(--bg-color),
            0px 0px 10px var(--bg-color),
            0px 0px 10px var(--bg-color),
            0px 0px 10px var(--bg-color),
            0px 0px 10px var(--bg-color);
    }
    .title {
        width: 70px;
        font-size: 16px;
        font-family: var(--serif);
        font-weight: 300;
        letter-spacing: 0.5px;
        text-align: center;
        margin: 0px 40px;
        padding-bottom: 3px;
        color: var(--color-2);
        transition: all 100ms ease-out;
        z-index: 11;
        pointer-events: all;
    }
    .title.active {
        color: var(--color-1);
/*        border-bottom: 1px solid var(--color-1) !important;*/
    }
    a {
        text-decoration: none;
    }
    .title:hover {
        cursor: pointer;
        color: var(--color-1);
/*        border-bottom: 1px solid var(--color-1) !important;*/
    }
    @media screen and (max-width: 1000px) {
        .title {
            padding-top: min(2vh, 12px);
            width: auto;
            margin: 0px 20px;
            padding-bottom: 2px;
        }
        .header {
            padding:  0;
        }
    }
    @media screen and (max-width: 500px) {
        .title {
            font-size: 14px;
            margin: 0px 10px;
        }
    }
</style>