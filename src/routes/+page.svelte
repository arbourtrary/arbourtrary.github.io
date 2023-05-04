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
        font-size: 16px;
        /*text-transform: uppercase;*/
        /*letter-spacing: 2px;*/
        color: #999;
        font-family: 'IM Fell English';
        padding-bottom: 2px;
        border-bottom: 1px solid gray;
        margin-bottom: 10px;
        padding-right: 5px;
    }
    :global(.section-description) {
        color: #555;
        font-family: 'IM Fell English';
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
<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+English" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Libre+Franklin" rel="stylesheet">
</svelte:head>
<script>
    import Header from "../components/Header.svelte"
    import Progress from "../components/Progress.svelte"
    import About from "../components/About.svelte"
    import Projects from "../components/Projects.svelte"
    import Blog from "../components/Blog.svelte"
    import Contact from "../components/Contact.svelte"

    let scrollY = 0;

    // function updateScrollY() {
    //     scrollY = window.scrollY
    //     window.requestAnimationFrame(updateScrollY);
    // }

    // window.requestAnimationFrame(() => { updateScrollY() })
// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.outerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

</script>
<svelte:window bind:scrollY={scrollY}/>
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

