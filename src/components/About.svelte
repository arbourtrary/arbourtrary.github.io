<script>
    import { section } from "../store.js"
    import TextMorph from "./TextMorph.svelte";

    export let sectionIndex = 0;
    export let scrollY = 0;

    let outerContainer;
    $: offset = window.innerHeight / 2
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)

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
        "#fcd361"
    ]

    let linearGradients = [
        "linear-gradient(to right, #D2B0EC, #e6e6e6, #e6e6e6, #e6e6e6)",
        "linear-gradient(to right, #e6e6e6, #AAC4A2, #e6e6e6, #e6e6e6)",
        "linear-gradient(to right, #e6e6e6, #e6e6e6, #8CB2D3, #e6e6e6)",
        "linear-gradient(to right, #e6e6e6, #e6e6e6, #e6e6e6, #fcd361)",
        "linear-gradient(to right, #e6e6e6, #e6e6e6, #e6e6e6, #e6e6e6)"
    ]

    const headerTexts = ["Creative Developer", "Environmentalist", "Mathematician", "Poetry Enthusiast"]

    const aboutInterests = [
        ['threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art'],
        ['renewables', 'wind energy'],
        ['threeJS', 'generative art'],
        ['threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art']
    ]
    let interests  = aboutInterests[0]
    let currentIndex = -1;
    // Create a function that highlights the correct header based on the equal splits of the height of the scrolling-anchor component
    function highlightHeader() {
        if (outerContainer) {
            const initialOffset = window.innerHeight / 4
            const headers = outerContainer.querySelectorAll('.about-header');
            const imgs = outerContainer.querySelectorAll('.about-img');

            const scrollingAnchorHeight = outerContainer.offsetHeight - window.innerHeight - initialOffset;
            const headerHeight = scrollingAnchorHeight / headerTexts.length;
            currentIndex = Math.floor((scrollY - initialOffset) / headerHeight);
            currentIndex = currentIndex > (headerTexts.length - 1) ? (headerTexts.length - 1) : currentIndex;
            // Loop through the headers

            for (let i = 0; i < headerTexts.length; i++) {
                if (scrollY > initialOffset) {
                    // If the current index is the same as the looped index
                    if (i === currentIndex) {
                        // Add the active class
                        if (headers.length) {
                            headers[i].classList.add('active');
                            headers[i].style.color = aboutColors[i]
                        }
                        imgs[i].classList.add('active');
                        interests = aboutInterests[i]
                        linearGradient = linearGradients[i]
                    } else {
                        // Remove the active class
                        if (headers.length) {
                            headers[i].classList.remove('active');
                            headers[i].style.color = "lightgray"                            
                        }
                        imgs[i].classList.remove('active');
                    }
                } else {
                    linearGradient = "linear-gradient(to right, #D2B0EC, #AAC4A2, #8CB2D3, #F2DC9B)";
                    if (headers.length) {
                        headers[i].classList.remove('active');
                        headers[i].style.color = "lightgray"                        
                    }
                    imgs[i].classList.add('active');
                }
            }
        }
        window.requestAnimationFrame(highlightHeader);
    }
    let innerWidth = window.innerWidth

    $: isMobile = innerWidth < 1000;

    window.requestAnimationFrame(() => { highlightHeader() })

</script>
<svelte:window bind:innerWidth={innerWidth}/>

<scrolling-anchor id="about" bind:this={outerContainer}>
    <div class="about-container">

        {#if isMobile}
            <div class="about-name mobile">
                <TextMorph
                    texts={morphTexts}
                    {linearGradient}
                />
            </div>
        {/if}

        {#if !isMobile}
            <div style="width: 375px; display: flex; flex-direction: column; margin: auto;">
                <div class="about-name desktop">
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
        {:else}
            <div class="img-container">
                <img class="about-img active" src="/images/drawing_purple.png">
                <img class="about-img active" src="/images/drawing_green.png">
                <img class="about-img active" src="/images/drawing_blue.png">
                <img class="about-img active" src="/images/drawing_yellow.png">
            </div>
        {/if}

        {#if !isMobile}
            <div class="img-container">
                <img class="about-img active" src="/images/drawing_purple.png">
                <img class="about-img active" src="/images/drawing_green.png">
                <img class="about-img active" src="/images/drawing_blue.png">
                <img class="about-img active" src="/images/drawing_yellow.png">
            </div>
        {:else}
            <div class="about-interests">
                <div
                    style={`
                        color: ${currentIndex >= 0 ? aboutColors[currentIndex] : 'gray'};
                        font-weight: ${currentIndex >= 0 ? '900' : '300'};
                    `}
                    class="section-subtitle center">{currentIndex >= 0 ? headerTexts[currentIndex] : "Interests"}
                </div>
                <div class="section-description center">{@html interests.join(", ")}</div>
            </div>
        {/if}
    </div>
</scrolling-anchor>

<style>
    scrolling-anchor {
        padding-bottom: 20px;
        width: min(90vw, 1000px);
        margin: 0 auto;
        position:relative;
        height: 600vh;
        display: block;
    }
    .about-container {
        position: sticky;
        top: 0;
        display: flex;
        padding-top: 75px;
        height: calc(100vh - 75px);
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
    }
    .img-container {
        background: white;
        height: min(80vh, 90vw);
        width: min(80vh, 90vw);
        margin: auto;
        position: relative;
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
        padding-top: 30px;
        margin: 5px 40px 0px 0px;
        height: 100px;
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
    @media screen and (max-width: 992px) {
        .about-container {
            flex-direction: column;
            height: 100vh;
            padding-top: 0px;
        }
        .about-header {
            font-size: 22px;
            margin: 0;
            text-align: center;
        }
        .about-interests {
            padding-top: 0px;
            margin: 0px auto;
            max-width: 340px;
        }
        .img-container {
            margin: 0 auto;
            height: min(80vh, 90vw, 500px);
            width: min(80vh, 90vw, 500px);
        }
        .center {
            text-align: center !important;
        }
        .section-subtitle {
            margin: 15px auto;
            font-size: 16px;
            border-bottom: 1px solid lightgray;
            padding: 0px 5px 5px 5px;
        }
    }
</style>