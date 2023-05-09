<style>
    :global(:root){
       --sans: "IM Fell English", serif;
       --selection-bg-color: #CBC3B4;
       --selection-color: #FFFFFF;
       --bg-color: #F5F2EB;

       /* In case I want an off-shade of black/white */
       --black: #000000;
       --white: #FFFFFF;

       /* Shades of color, ordered darkest (1) to lightest (n) */
       --color-1: #373531;
       --color-2: #908B80;
       --color-3: #A8A195;
       --color-4: #EAE6DF;
    }

    /*** Works on common browsers ***/
    :global(::selection) {
        background-color: var(--selection-bg-color);
        color: var(--selection-color);
    }
    /*** Mozilla based browsers ***/
    :global(::-moz-selection) {
        background-color: var(--selection-bg-color);
        color: var(--selection-color);
    }

    /***For Other Browsers ***/
    :global(::-o-selection) {
        background-color: var(--selection-bg-color);
        color: var(--selection-color);
    }

    :global(::-ms-selection) {
        background-color: var(--selection-bg-color);
        color: var(--selection-color);
    }

    /*** For Webkit ***/
    :global(::-webkit-selection) {
        background-color: var(--selection-bg-color);
        color: var(--selection-color);
    }

    :global(body) {
        margin: 0;
        background: var(--bg-color);
    }
    :global(.section-subtitle) {
        width: fit-content;
        font-size: 16px;
        color: var(--color-2);
        font-family: var(--sans);
        padding-bottom: 2px;
        margin-bottom: 10px;
        padding-right: 5px;
    }
    :global(.section-description) {
        color: var(--color-1);
        font-family: var(--sans);
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
    import { isPortrait, bgColor, textColor1, textColor2, textColor3, textColor4, white } from '../store.js'
    import Header from "../components/Header.svelte"
    import Progress from "../components/Progress.svelte"
    import About from "../components/About.svelte"
    import Projects from "../components/Projects.svelte"
    import Blog from "../components/Blog.svelte"
    import Contact from "../components/Contact.svelte"

    let scrollY = 0;
    let innerWidth = window.innerWidth;

    window.addEventListener('resize', () => {
      let vh = window.outerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    $: isPortrait.set(innerWidth < 1000)

    bgColor.set(window.getComputedStyle(document.body).getPropertyValue('--bg-color'))
    textColor1.set(window.getComputedStyle(document.body).getPropertyValue('--color-1'))
    textColor2.set(window.getComputedStyle(document.body).getPropertyValue('--color-2'))
    textColor3.set(window.getComputedStyle(document.body).getPropertyValue('--color-3'))
    textColor4.set(window.getComputedStyle(document.body).getPropertyValue('--color-4'))
    white.set(window.getComputedStyle(document.body).getPropertyValue('--white'))
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=IM+Fell+English" rel="stylesheet">
</svelte:head>
<svelte:window bind:scrollY bind:innerWidth/>

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

