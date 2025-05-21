<script>
    import { base } from '$app/paths'
    let introText = `I'm a <span style="color: var(--blue)">creative developer</span> who enjoys musing about <span style="color: var(--green)">nature</span>, <span style="color: var(--orange)">mathematics</span> &amp; <span style="color: var(--purple)">poetry</span>`
    let imageText = "a large, circular primary drawing - it's a multicolored geometric hand-drawn design with 4 interlocked, interwoven parts (blue, green, orange, purple)"
</script>

<div id="intro">
    <div class="intro-container desktop">
        <div class="intro-intro">
            <div class="intro-name">
                <div class="name-container"></div>
                <div class="header-container">
                    <div class="progress-bar-bg"></div>
                </div>
            </div>
            <div class="intro-description">
                <div class="intro-header">{@html introText}</div>
            </div>
        </div>
        <div class="img-container">
            <picture>
                <source 
                    media="(max-width: 1000px)" 
                    srcset=""
                    width="500" 
                    height="500">
                <source 
                    media="(min-width: 1000px)" 
                    srcset="{base}/images/drawing.webp"
                    width="800" 
                    height="800">
                <img class="drawing" 
                    fetchpriority="high"
                    src="" 
                    alt={imageText}
                    width="800"
                    height="800">
            </picture>
        </div>
    </div>
    <div class="intro-container mobile">
        <div class="intro-name">
            <div class="name-container"></div>
            <div class="header-container">
                <div class="progress-bar-bg"></div>
            </div>
        </div>
        <div class="img-container">
            <picture>
                <source 
                    media="(max-width: 500px)" 
                    srcset="{base}/images/drawing-mobile-sm.webp"
                    width="400" 
                    height="400">
                <source 
                    media="(max-width: 1000px)" 
                    srcset="{base}/images/drawing-mobile.webp"
                    width="600" 
                    height="600">
                <source 
                    media="(min-width: 1000px)" 
                    srcset=""
                    width="800" 
                    height="800">
                <img class="drawing" 
                    fetchpriority="high"
                    src="" 
                    alt={imageText}
                    width="500"
                    height="500">
            </picture>
        </div>
        <div class="intro-description">
            <div class="intro-header">{@html introText}</div>
        </div>
    </div>
</div>

<style>
    :root {
        --name-linear-gradient: linear-gradient(to right, #8CB2D3, #AAC4A2, #EFBD8D, #D2B0EC);
        --name-filter: brightness(1);
        --intro-img-filter: blur(0px) brightness(1) !important;
    }
    :root.dark-theme {
        --name-linear-gradient: linear-gradient(to right, var(--blue), var(--green), var(--yellow), var(--purple));
        --name-filter: brightness(1.1);
        --intro-img-filter: blur(0px) brightness(1) drop-shadow(0px 1px var(--color-1)) !important;
    }
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
    .name-container:after {
      content: "arbourtrary";
      display: inline-block;
      font-family: var(--serif), sans-serif;
      font-size: min(45px, 11vw);
      text-align: left;
      font-weight: 600;
      letter-spacing: .1px;
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
      
      background: var(--name-linear-gradient);
      filter: var(--name-filter);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      
      animation-name: smooth-content-change;
      animation-duration: 5s;
      animation-timing-function: ease-in-out;
      animation-iteration-count: infinite;
    }
    .intro-intro {
        width: 360px;
        display: flex;
        flex-direction: column;
        margin: auto 0;
        gap: 10px;
        margin-right: 40px;
    }
    #intro {
        padding-top: var(--header-height);
        padding-bottom: 20px;
        width: min(95vw, 1100px);
        margin: 0 auto;
        position:relative;
        height: calc(100vh - 41px);
        display: block;
    }
    img {
        font-size: 0;
    }
    .intro-container {
        position: relative;
        top: 0;
        display: flex;
        height: 100%;
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
    .img-container picture {
        height: 100%;
        width: 100%;
        position: absolute;
        object-fit: contain;
        z-index: 22;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        transition: all 0.75s ease;
        aspect-ratio: 1;
    }
    .img-container img {
        height: auto;
        width: 100%;
        position: absolute;
        object-fit: contain;
        aspect-ratio: 1;
        filter: var(--intro-img-filter);
        top: 50%;
        transform: translate(0, -50%);
    }
    .intro-header {
        font-size: 28px;
        font-family: var(--serif);
        font-weight: 300;
        text-align: left;
        margin: 5px auto 0 0;
        padding-bottom: 5px;
        color: var(--color-1);
        width: 340px;
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
        #intro {
            display: flex;
        }
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
            flex-direction: column;
            transform: translate(0,0);
            padding-top: 0px;
            grid-row-gap: min(2vh, 10px);
            min-height: 0;
            margin: 0 auto;
        }
        .intro-header {
            font-size: 28px;
            text-align: left;
        }
        .intro-description {
            padding-top: 0px;
            margin: 10px;
            max-width: min(calc(100% - 20px), 335px)
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
        .intro-description {
            max-width: min(calc(100% - 20px), 310px)
        }
    }
</style>