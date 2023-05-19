<script>
    import { isPortrait, bgColor, textColor1, textColor2, textColor3, textColor4, white } from '../store.js'
    import Header from "../components/Header.svelte"
    import Progress from "../components/Progress.svelte"
    import About from "../components/About.svelte"
    import Projects from "../components/Projects.svelte"
    import Writings from "../components/Writings.svelte"
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

<svelte:window bind:scrollY bind:innerWidth/>

<!-- Sticky elements -->
<Header/>
<Progress {scrollY}/>

<!-- Sections -->
<About
    sectionIndex={0}
    {scrollY}
    dataFilename={'/data/about.json'}
/>
<Projects
    sectionIndex={1}
    dataFilename={'/data/projects.json'}
    {scrollY}
/>
<Writings
    sectionIndex={2}
    dataFilename={'/data/writings.json'}
    {scrollY}
/>
<Contact
    sectionIndex={3}
    {scrollY}
/>   

