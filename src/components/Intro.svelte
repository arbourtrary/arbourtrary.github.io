<script>
    import { section, bgColor, textColor3, textColor4 } from "../store.js"
    import { onMount } from "svelte";
    import { loadJSON } from "../utils/file.js";
    import { getFieldFromArrayOfObjects } from "../utils/array.js";

    let innerWidth = window.innerWidth

    // "ɑrbərtrɛri", "deɪvɪd njukəm"
    // TODO: Build Spanish version toggle later
    // "David Morales" appears and everything switches - easter egg
    // Maybe Greek letters? αρβουρτραρψ
    let texts = ["arbourtrary", "David Newcomb", "David Morales"];
    let linearGradient = "linear-gradient(to right, #8CB2D3, #AAC4A2, #EFBD8D, #D2B0EC);"

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<scrolling-anchor id="intro">
    
        <div class="intro-container desktop">
            <div class="intro-intro">
                <div class="intro-name">
                    <div class="name-container">
                        <span class="name" style={`background: ${linearGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}>{texts[Math.round(Math.random() * (texts.length - 1))]}</span>
                        <div class="progress-bar-bg"></div>
                    </div>
                </div>
                <div class="intro-description">
                    <div class="intro-header">
                        I'm a <span style="color: var(--blue)">creative developer</span> who enjoys making code sketches and writing about <span style="color: var(--green)">nature</span>, <span style="color: var(--orange)">mathematics</span> &amp; <span style="color: var(--purple)">poetry</span>
                    </div>
                </div>
            </div>

            <div class="img-container">
                <img class="drawing" src={innerWidth > 1000 ? "/images/drawing.jpg" : ""} height="800" width="800" alt="a large, circular primary image - it's a multicolored geometric hand-drawn design with 4 interlocked, interwoven parts (blue, green, orange, purple)"/>
            </div>
        </div>


        <div class="intro-container mobile">
            <div class="intro-name">
                <div class="name-container">
                    <span class="name" style={`background: ${linearGradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent;`}>{texts[Math.round(Math.random() * (texts.length - 1))]}</span>
                </div>
                <div class="header-container">
                    <div class="progress-bar-bg"></div>
                </div>
            </div>
            <div class="img-container">
                <img class="drawing" src={innerWidth <= 1000 ? "/images/drawing-mobile.jpg" : ""} height="500" width="500" alt="a large, circular primary image - it's a multicolored geometric hand-drawn design with 4 interlocked, interwoven parts (blue, green, orange, purple)"/>
            </div>
            <div class="intro-description">
                <div class="intro-header">
                    I'm a <span style="color: var(--blue)">creative developer</span> who enjoys making code sketches and writing about <span style="color: var(--green)">nature</span>, <span style="color: var(--orange)">mathematics</span> &amp; <span style="color: var(--purple)">poetry</span>
                </div>
            </div>
        </div>
</scrolling-anchor>

<style>
    .progress-bar-bg {
        height: 1px;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background: #D0C6B6;
        z-index: 1;
    }
    .header-container {
        display: flex;
        flex-direction: row;
        position: relative;
    }
    .intro-name {
        position: relative;
        width: fit-content;
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
    .intro-intro {
        width: 375px;
        display: flex;
        flex-direction: column;
        margin: auto 0;
        gap: 10px;
        margin-right: 40px;
    }
    scrolling-anchor {
        padding-bottom: 20px;
        width: min(90vw, 1100px);
        margin: 0 auto;
        position:relative;
        height: 100vh;
        display: block;
    }
    img {
        font-size: 0;
    }
    .intro-container {
        position: sticky;
        top: 0;
        display: flex;
        padding-top: 25px;
        height: calc(100vh - 25px);
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        align-items: center;
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
        height: 100%;
        width: 100%;
        position: absolute;
        object-fit: contain;
        z-index: 22;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .img-container .drawing {
        background: var(--bg-color);
    }
    .intro-header {
        font-size: 28px;
        font-family: var(--serif);
        font-weight: 300;
        text-align: left;
        margin: 0 auto;
        padding-bottom: 5px;
        color: var(--color-1);
        transition: color 150ms ease-out;
        max-width: 420px;
        margin-top: 5px;
        opacity: 1;
        line-height: 1.25;
    }
    .desktop {
        display: flex;
    }
    .mobile {
        display: none;
    }
    @media screen and (max-width: 1000px) {
        
        .header-container {
            width: min(350px, 100%);
            position: relative;
            margin: 0 auto;
        }
        .name-container {
            text-align: center;
        }
        .name {
            letter-spacing: .1px;
        }
        .intro-container {
            height: calc(100vh - 75px);
            flex-direction: column;
            top: 55px;
            transform: translate(0,0);
            padding-top: 0px;
            grid-row-gap: min(2vh, 10px);
            min-height: 0;
        }
        .intro-header {
            font-size: 28px;
            text-align: left;
        }
        .intro-description {
            padding-top: 0px;
            margin: 10px;
            max-width: calc(100% - 20px);
        }
        .img-container {
            margin: 0 auto;
            width: min(95vw, 500px);
            height: min(95vw, 500px);
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
        .intro-header {
            font-size: 26px;
        }
    }
</style>