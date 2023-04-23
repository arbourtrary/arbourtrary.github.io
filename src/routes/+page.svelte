<style>
    /*
    ********************
           Raleway
    ********************
    */

    @font-face {
        font-family: 'Raleway';
        src: url('https://narro.design/assets/fonts/raleway/Raleway-extralight.woff');
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Raleway';
        src: url('https://narro.design/assets/fonts/raleway/Raleway-medium.woff');
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Raleway';
        src: url('https://narro.design/assets/fonts/raleway/Raleway-heavy.woff');
        font-weight: 700;
        font-style: normal;
        font-stretch: normal;
        font-display: swap;
    }

    /*
    ********************
           Avenir
    ********************
    */

    @font-face {
        font-family: 'Avenir';
        src: url('https://narro.design/assets/fonts/avenir/Avenir-Light.woff');
        font-weight: 400;
        font-style: normal;
        font-stretch: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Avenir';
        src: url('https://narro.design/assets/fonts/avenir/Avenir-Medium.woff');
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Avenir';
        src: url('https://narro.design/assets/fonts/avenir/Avenir-Heavy.woff');
        font-weight: 700;
        font-style: normal;
        font-stretch: normal;
        font-display: swap;
    }

    :global(body) {
        margin: 0;
        background: #f6f5f1;
    }
    :global(.section-subtitle) {
        width: fit-content;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: gray;
        font-family: 'Avenir';
        padding-bottom: 5px;
        border-bottom: 1px solid gray;
        margin-bottom: 20px;
        padding-right: 5px;
    }
    :global(.section-description) {
        color: black;
        font-family: 'Avenir';
    }
    :global(.desktop) {
        display: block;
    }
    :global(.mobile) {
        display: none;
    }
    @media screen and (max-width: 1000px) {
        :global(.desktop) {
            display: none;
        }
        :global(.mobile) {
            display: block;
        }
    }
</style>
<script>
    import Header from "../components/Header.svelte"
    import Progress from "../components/Progress.svelte"
    import About from "../components/About.svelte"
    import Projects from "../components/Projects.svelte"
    import Blog from "../components/Blog.svelte"
    import Contact from "../components/Contact.svelte"

    let scrollY = 0;

    function updateScrollY() {
        scrollY = window.scrollY
        window.requestAnimationFrame(updateScrollY);
    }

    window.requestAnimationFrame(() => { updateScrollY() })
</script>
<!-- <svelte:window bind:scrollY={scrollY}/> -->
<!-- Sticky elements -->
<Header/>
<Progress {scrollY}/>

<!-- Sections -->
<About
    sectionIndex={0}
    {scrollY}
/>
<Projects
    sectionIndex={1}
    {scrollY}
/>
<Blog
    sectionIndex={2}
    {scrollY}
/>
<Contact
    sectionIndex={3}
    {scrollY}
/>   

