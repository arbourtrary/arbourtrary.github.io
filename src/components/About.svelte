<script>
    import { section } from "../store.js"
    import TextMorph from "./TextMorph.svelte";
    import { onMount } from "svelte";
    import { inview } from 'svelte-inview';

    export let sectionIndex = 0;
    let about;
    let isInView = false;
    const options = {
        rootMargin: '-50px',
        unobserveOnEnter: false,
    };

    const handleChange = ((e) => isInView = e.detail.inView);
    $: isInView && section.set(sectionIndex)

    export let scrollY = 0;

    let linearGradient;
    let morphTexts = ["David Newcomb", "arbourtrary"];

    let aboutColors = [
        /*purple*/
        "#D2B0EC",
        /*green*/
        "#AAC4A2",
        /*blue*/
        "#8CB2D3",
        /*yellow*/
        "#F2DC9B"
    ]

    let linearGradients = [
        "linear-gradient(to right, #D2B0EC, #e6e6e6, #e6e6e6, #e6e6e6)",
        "linear-gradient(to right, #e6e6e6, #AAC4A2, #e6e6e6, #e6e6e6)",
        "linear-gradient(to right, #e6e6e6, #e6e6e6, #8CB2D3, #e6e6e6)",
        "linear-gradient(to right, #e6e6e6, #e6e6e6, #e6e6e6, #F2DC9B)"
    ]

    const aboutInterests = [
        ['threeJS', 'generative art'],
        ['renewables', 'wind energy'],
        ['threeJS', 'generative art'],
        ['threeJS', 'generative art']
    ]
    let interests  = aboutInterests[0]

    // Create a function that highlights the correct header based on the equal splits of the height of the scrolling-anchor component
    function highlightHeader() {
        const initialOffset = window.innerHeight / 4
        const headers = about.querySelectorAll('.about-header');
        const imgs = about.querySelectorAll('.about-img');

        const scrollingAnchorHeight = about.offsetHeight - window.innerHeight - initialOffset;
        const headerHeight = scrollingAnchorHeight / headers.length;
        const currentIndex = Math.floor((scrollY - initialOffset) / headerHeight);

        // Loop through the headers

        for (let i = 0; i < headers.length; i++) {
            if (scrollY > initialOffset) {
                // If the current index is the same as the looped index
                if (i === currentIndex) {
                    // Add the active class
                    headers[i].classList.add('active');
                    headers[i].style.color = aboutColors[i]
                    imgs[i].classList.add('active');
                    interests = aboutInterests[i]
                    linearGradient = linearGradients[i]
                } else {
                    // Remove the active class
                    headers[i].classList.remove('active');
                    headers[i].style.color = "lightgray"
                    imgs[i].classList.remove('active');
                }
            } else {
                linearGradient = "linear-gradient(to right, #D2B0EC, #AAC4A2, #8CB2D3, #F2DC9B)";
                headers[i].classList.remove('active');
                headers[i].style.color = "lightgray"
                imgs[i].classList.add('active');
            }
        }
        window.requestAnimationFrame(highlightHeader);
    }

    window.requestAnimationFrame(() => { highlightHeader() })
</script>

<scrolling-anchor use:inview={options} on:inview_change="{handleChange}" id="about" bind:this={about} style="width: min(90vw, 1000px); margin: 0 auto; position: relative; height: 600vh; display: block;">
    <div style="position: sticky; top: 0; display: flex; padding-top: 75px; height: calc(100vh - 75px); flex-direction: row; margin: auto 0; justify-content: center;">

        <div style="width: 375px; display: flex; flex-direction: column; margin: auto;">
            <div class="about-name">
                <TextMorph
                    texts={morphTexts}
                    {linearGradient}
                />
            </div>
            <div class="about-header">Creative Developer</div>
            <div class="about-header">Environmentalist</div>
            <div class="about-header">Mathematician</div>
            <div class="about-header">Poetry Enthusiast</div>
            <div class="about-interests">
                <div class="section-subtitle">Interests</div>
                <div class="section-description">{@html interests.join(", ")}</div>
            </div>
        </div>


        <div style="background: white; height: min(80vh, 800px); width: min(80vh, 800px); margin: auto; position: relative;">
            <img class="about-img active" src="/images/drawing_purple.png">
            <img class="about-img active" src="/images/drawing_green.png">
            <img class="about-img active" src="/images/drawing_blue.png">
            <img class="about-img active" src="/images/drawing_yellow.png">
        </div>
    </div>
</scrolling-anchor>

<style>
    scrolling-anchor {
        padding-bottom: 20px;
    }
    .about-header {
        font-size: 28px;
        font-family: 'Avenir';
        font-weight: 300;
        text-align: left;
        margin: 5px 40px 0px 0px;
        padding-bottom: 5px;
        color: lightgray;
    }
    :global(.about-header.active) {

        filter: saturate(150%);
        font-weight: bold;
    }
    .about-interests {
        padding-top: 40px;
        margin: 5px 40px 0px 0px;
    }
    .about-img {
        object-fit: contain;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        filter: saturate(120%);
        opacity: 0.2;
        transition: all 0.5s ease-out;
    }
    :global(.about-img.active) {
        opacity: 1;
    }
</style>