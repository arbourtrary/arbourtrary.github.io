<script>
    import { section, bgColor, textColor3, textColor4 } from "../store.js"
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { getFieldFromArrayOfObjects } from "../utils/array.js";

    export let sectionIndex = 0;
    export let scrollY = 0;
    export let dataFilename = "";

    let currentIndex = -1;
    let prevIndex;
    let scrollingAnchorHeight;
    let initialOffset;
    let interests = [];
    let inspirations = [];
    let images = []
    // let headers = []
    let activeColor = "#D0C6B6"
    let progress = 0;
    let linearGradient;
    let outerContainer;
    let innerWidth = window.innerWidth
    let viewport;
    let canvas;
    let context;

    let data = null;
    let allColors = []
    let headers = [];
    let headerTexts = []
    let allInterests = []
    let allInspirations = []
    let masks = []
    let maskOpacities = [0,0,0,0]
    let gradients = []

    // "ɑrbərtrɛri", "deɪvɪd njukəm"
    // TODO: Build Spanish version toggle later
    // "David Morales" appears and everything switches - easter egg
    // Maybe Greek letters? αρβουρτραρψ
    let texts = ["arbourtrary", "David Newcomb", "David Morales"];

    onMount(async () => {
        initialOffset = window.innerHeight / 5;
        scrollingAnchorHeight = outerContainer.offsetHeight - window.innerHeight - initialOffset;
        data = await loadJSON(dataFilename);
        allColors = getFieldFromArrayOfObjects(data, 'color');
        headerTexts = getFieldFromArrayOfObjects(data, 'header');
        allInterests = getFieldFromArrayOfObjects(data, 'interests');
        allInspirations = getFieldFromArrayOfObjects(data, 'inspirations');
        masks = getFieldFromArrayOfObjects(data, 'mask');
        gradients = [
            `linear-gradient(to right, ${allColors[0]}, ${$textColor4}, ${$textColor4}, ${$textColor4})`,
            `linear-gradient(to right, ${$textColor4}, ${allColors[1]}, ${$textColor4}, ${$textColor4})`,
            `linear-gradient(to right, ${$textColor4}, ${$textColor4}, ${allColors[2]}, ${$textColor4})`,
            `linear-gradient(to right, ${$textColor4}, ${$textColor4}, ${$textColor4}, ${allColors[3]})`
        ]
    });

    // Create a function that highlights the correct header based on the equal splits of the height of the scrolling-anchor component
    function highlightHeader() {
        if (data && outerContainer && $section === 0 && initialOffset) {
            if (!headers.length) {
                headers = outerContainer.querySelectorAll('.about-header');
            }
            progress = (window.scrollY - initialOffset) / scrollingAnchorHeight;
            progress = progress > 1 ? 1 : progress < 0 ? 0 : progress;

            const headerHeight = scrollingAnchorHeight / headerTexts.length;
            currentIndex = Math.floor((window.scrollY - initialOffset) / headerHeight);
            currentIndex = currentIndex > (headerTexts.length - 1) ? (headerTexts.length - 1) : currentIndex;

            // Loop through the headers
            if (prevIndex !== currentIndex) {
                for (let i = 0; i < headerTexts.length; i++) {
                    if (window.scrollY > initialOffset) {
                        // If the current index is the same as the looped index
                        if (i === currentIndex) {
                            activeColor = allColors[i]
                            // Add the active class
                            if (headers.length) {
                                headers[i].classList.add('active');
                                headers[i].style.color = activeColor
                            }
                            maskOpacities[i] = 0;
                            interests = allInterests[i]
                            inspirations = allInspirations[i]
                            linearGradient = gradients[i]
                        } else {
                            // Remove the active class
                            if (headers.length) {
                                headers[i].classList.remove('active');
                                headers[i].style.color = $textColor4
                            }
                            maskOpacities[i] = 0.8;
                        }
                    } else {
                        linearGradient = `linear-gradient(to right, ${allColors.join(', ')})`;
                        if (headers.length) {
                            headers[i].classList.remove('active');
                            headers[i].style.color = $textColor3;
                            activeColor = "#D0C6B6"                
                        }
                        maskOpacities[i] = 0;
                        interests = []
                        inspirations = []
                    }
                }
            }
            prevIndex = currentIndex;
        }
        window.requestAnimationFrame(highlightHeader);
    }
    window.requestAnimationFrame(() => { highlightHeader() })


    $: offset = window.innerHeight / 2

    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)

    $: linearGradientLine = Array.from({length: (currentIndex + 2)}, (_, i) => i + 1).map((elem) => $bgColor).join(", ")

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<scrolling-anchor id="about" bind:this={outerContainer}>
    
        <div class="about-container desktop">
            <div class="about-intro">
                <div class="about-name">
                    <div class="name-container">
                        <span class="name" style={`background: ${linearGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}>{texts[Math.round(Math.random() * (texts.length - 1))]}</span>
                    </div>
                </div>
                <div class="header-container">
                    <div class="progress-bar-bg"></div>
                    <div
                        class="progress-bar-fg" 
                        style={`
                            height: ${progress * 100}%;
                            background: linear-gradient(${linearGradientLine}, ${activeColor});
                        `}>
                    </div>

                    <div>
                        {#each headerTexts as headerText}
                            <div class="about-row">
                                <div class="about-header">{headerText}</div>
                            </div>
                        {/each}
                    </div>
                </div>
                <div class="about-interests">
                    {#if currentIndex < 0}
                        <div
                            class="section-subtitle center">Scroll to explore
                        </div>
                        <div class="line line-neg left"></div>
                        <div class="line line-zero left"></div>
                        <div class="line line-one left"></div>
                        <div class="line line-two left"></div>
                        <div class="line line-three left"></div>
                        <div class="line line-four left"></div>
                        <div class="line line-five left"></div>
                        <div class="line line-six left"></div>
                        <div class="line line-seven left"></div>
                        <div class="line line-eight left"></div>
                    {/if}

                    <div class="section-subtitle" style={`visibility: ${interests.length ? 'visible' : 'hidden'}`}>Interests</div>
                    <div class="section-description">{@html interests.join(", ")}</div>
                    <div class="section-subtitle about-inspirations" style={`visibility: ${inspirations.length ? 'visible' : 'hidden'}`}>Inspirations</div>
                    <div class="section-description">{@html inspirations.join(", ")}</div>
                </div>
            </div>

            <div class="img-container">
                <img class="drawing" src={innerWidth > 1000 ? "/images/drawing.jpg" : ""} height="800" width="800" alt="a large, circular primary image - it's a multicolored geometric hand-drawn design with 4 interlocked, interwoven parts (blue, green, orange, purple)"/>
                {#each masks as mask, index}
                    <img height="1000" width="1000" class="mask" style={`opacity: ${maskOpacities[index]};`} src={mask} alt="mask for image"/>
                {/each}
            </div>
        </div>


        <div class="about-container mobile">
            <div class="about-name">
                <div class="name-container">
                    <span class="name" style={`background: ${linearGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}>{texts[Math.round(Math.random() * (texts.length - 1))]}</span>
                </div>
                <div class="header-container">
                    <div class="progress-bar-bg"></div>
                    <div
                        class="progress-bar-fg" 
                        style={`
                            width: ${progress * 100}%;
                            background: linear-gradient(to right, ${linearGradientLine}, ${activeColor});
                        `}>
                    </div>
                </div>
            </div>
            <div class="img-container">
                <img class="drawing" src={innerWidth <= 1000 ? "/images/drawing-mobile.jpg" : ""} height="500" width="500" alt="a large, circular primary image - it's a multicolored geometric hand-drawn design with 4 interlocked, interwoven parts (blue, green, orange, purple)"/>
                {#each masks as mask, index}
                    <img height="1000" width="1000" class="mask" style={`opacity: ${maskOpacities[index]};`} src={mask} alt="mask for image"/>
                {/each}
            </div>
            <div class="about-interests">
                <div
                    style={`
                        padding-bottom: ${currentIndex >= 0 ? "0px" : '5px'};
                        color: ${currentIndex >= 0 ? allColors[currentIndex] : 'var(--color-1)'};
                        font-weight: ${currentIndex >= 0 ? '900' : '300'};
                        font-size: ${currentIndex >= 0 ? '28px' : '16px'};
                        ${currentIndex >= 0 ? "" : "margin: 15px auto 0px auto; border: none; text-transform: none; letter-spacing: normal;"}
                    `}
                    class="section-subtitle center">{currentIndex >= 0 ? headerTexts[currentIndex] : "Scroll to explore"}
                </div>
                {#if currentIndex < 0}
                    <div class="line line-one"></div>
                    <div class="line line-two"></div>
                    <div class="line line-three"></div>
                    <div class="line line-four"></div>
                    <div class="line line-five"></div>
                    <div class="line line-six"></div>
                    <div class="line line-seven"></div>
                    <div class="line line-eight"></div>
                {/if}
                <div class="about-details flex-column">
                    {#if Math.random() > 0.5}
                        <div class="flex-column">
                            <div class="section-column-title" style={`visibility: ${interests.length ? 'visible' : 'hidden'}`}>Interests</div>
                            <div class="section-description">{@html interests.join(", ")}</div>
                        </div>
                    {:else}
                        <div class="flex-column">
                            <div class="section-column-title" style={`visibility: ${inspirations.length ? 'visible' : 'hidden'}`}>Inspirations</div>
                            <div class="section-description">{@html inspirations.join(", ")}</div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
</scrolling-anchor>

<style>
    .flex-column {
        display: flex;
        flex-direction: column;
    }
    .about-details {
        text-align: center;
        width: 80%;
        margin: 0 auto;
    }
    .about-row {
        display: flex;
        flex-direction: row;
        justify-content: start;
    }
    .progress-bar-bg {
        height: 1px;
        width: 100%;
        top: unset;
        bottom: 6px;
        left: 0px;

        width: 1px;
        height: 100%;
        top: 0;
        left: 6px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        background: #D0C6B6;
        z-index: 1;
    }
    .progress-bar-fg {
        width: 3px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: absolute;
        top: 0;
        left: 5px;
        z-index: 2;
    }
    .header-container {
        display: flex;
        flex-direction: row;
        position: relative;
    }
    .about-name {
        position: relative;
    }
    .name-container {
        position: relative;
        margin: auto;
        width: 100%;
        z-index: 20;
        margin-bottom: 2px;
        text-align: left;
    }
    .name {
        display: inline-block;
        letter-spacing: .1px;
        font-family: var(--serif), sans-serif, sans-serif;
        font-size: min(45px, 11vw);
        text-align: left;
        font-weight: 600;
        user-select: none;
        width: max-content;
        -webkit-backface-visibility: hidden;
        -webkit-perspective: 1000;
        -webkit-transform: translate3d(0,0,0);
        -webkit-transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000;
        transform: translate3d(0,0,0);
        transform: translateZ(0);
    }
    .about-intro {
        width: 375px;
        display: flex;
        flex-direction: column;
        margin: auto 0;
    }
    #viewport {
        height: 100%;
        width: 100%;
        position: absolute;
        z-index: 22;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .left {
        text-align: left !important;
        margin: 0 !important;
    }
    .line {
        display:block;
        border-top:1px solid #4E4D4A;
        text-align:center;
        padding-bottom: 8px;
        margin: 0 auto;
    }
    .line-neg {
        width:110px;
        animation: line1 3s infinite linear;
        animation-delay: 100ms;
    }
    .line-zero {
        width:95px;
        animation: line1 3s infinite linear;
        animation-delay: 100ms;
    }
    .line-one {
        width:75px;
        animation: line1 3s infinite linear;
        animation-delay: 100ms;
    }
    .line-two {
        width:58px;
        animation: line2 3s infinite linear;
        animation-delay: 200ms;
    }
    .line-three {
        width:40px;
        animation: line3 3s infinite linear;
        animation-delay: 300ms;
    }
    .line-four {
        width:25px;
        animation: line4 3s infinite linear;
        animation-delay: 400ms;
    }
    .line-five {
        width:15px;
        animation: line5 3s infinite linear;
        animation-delay: 500ms;
    }
    .line-six {
        width:8px;
        animation: line6 3s infinite linear;
        animation-delay: 600ms;
    }
    .line-seven {
        width:5px;
        animation: line7 3s infinite linear;
        animation-delay: 700ms;
    }
    .line-eight {
        width:2px;
        animation: line8 3s infinite linear;
        animation-delay: 800ms;
    }

    @keyframes line1 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line2 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line3 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line4 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line5 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line6 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line7 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes line8 {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.05;
      }
      100% {
        opacity: 1;
      }
    }
    scrolling-anchor {
        padding-bottom: 20px;
        width: min(90vw, 1100px);
        margin: 0 auto;
        position:relative;
        height: 300vh;
        display: block;
    }
    img {
        font-size: 0;
    }
    .about-container {
        position: sticky;
        top: 0;
        display: flex;
        padding-top: 25px;
        height: calc(100vh - 25px);
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
    }
    .img-container {
        height: min(80vh, 85vw);
        width: min(80vh, 85vw);
        margin: auto 0;
        position: relative;
        -webkit-transform: translate3d(0,0,1px);
        transform: translate3d(0,0,1px);
        z-index: 2;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .img-container img {
        height: auto;
        width: 100%;
        position: absolute;
        z-index: 22;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .img-container .drawing {
        background: var(--bg-color);
    }
    .img-container .mask {
        position: absolute;
        z-index: 23;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        opacity: 0.0;
        transition: opacity 250ms ease-out;

    }
    scrolling-anchor canvas {
        width: 100% !important;
        height: unset !important;
    }
    .about-header {
        font-size: 28px;
        font-family: var(--serif);
        font-weight: 300;
        text-align: left;
        margin: 5px 40px 0px 0px;
        padding-bottom: 5px;
        color: var(--color-3);
        padding-left: 21px;
        transition: color 150ms ease-out;
    }
    :global(.about-header.active) {
        filter: saturate(130%);
    }
    .about-interests {
        padding-top: 15px;
        margin: 5px 40px 0px 0px;
        height: 180px;
    }
    .about-inspirations {
        padding-top: 20px;
    }
    .section-description {
         font-size: 18px;
    }
    .section-subtitle, .section-column-title {
        font-weight: 300;
        font-size: 16px;
        border: none;
        text-transform: none;
        letter-spacing: normal;
        padding-bottom: 4px;
        margin-bottom: 0px;
    }
    .desktop {
        display: flex;
    }
    .mobile {
        display: none;
    }
    @media screen and (max-width: 1000px) {
        .progress-bar-bg {
            height: 1px;
            width: 100%;
            top: unset;
            bottom: 6px;
            left: 0px;
        }
        .progress-bar-fg {
            height: 3px;
            top: unset;
            left: 0px;
            bottom: 5px;
        }
        .header-container {
            width: min(350px, 100%);
            position: relative;
            margin: 0 auto;
        }
        .line {
            padding-bottom: 5px;
        }
        .name-container {
            text-align: center;
        }
        .name {
            letter-spacing: .1px;
        }
        .about-container {
            height: calc(100vh - 75px);
            flex-direction: column;
            top: 55px;
            transform: translate(0,0);
            padding-top: 0px;
            grid-row-gap: min(2vh, 10px);
            min-height: 0;
        }
        scrolling-anchor canvas {
            height: 100% !important;
            width: unset !important;
        }
        .about-header {
            font-size: 22px;
            margin: 0;
            text-align: center;
        }
        .about-interests {
            padding-top: 0px;
            margin: 0px auto;
            max-width: 400px;
            height: 120px;
        }
        .img-container {
            margin: 0 auto;
            height: min(80vh, 90vw, 600px);
            width: min(80vh, 90vw, 600px);
        }
        .center {
            text-align: center !important;
        }
        .section-subtitle {
            padding: 0px 5px 0px 5px;
            font-size: 16px;
            margin: 0px auto 7px auto;
        }
        .section-column-title {
            margin:  0px;
            font-size: 14px;
            padding: 0px 5px 2px 0px;
            color: var(--color-2);
            font-family: var(--serif);
        }
        .desktop {
            display: none;
        }
        .mobile {
            display: flex;
        }
    }
    @media screen and (max-width: 700px) {
        .img-container {
            margin: 0 auto;
            height: min(80vh, 90vw, 500px);
            width: min(80vh, 90vw, 500px);
        }
    }
    @media screen and (max-width: 500px) {
        .section-description {
            font-size: 16px;
        }
    }
</style>