<script>
    import { section } from "../store.js"
    import TextMorph from "./TextMorph.svelte";
    import { onMount } from "svelte";

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

    const headerTexts = ["Creative Developer", "Environmentalist", "Applied Mathematician", "Poetry Enthusiast"]

    const aboutInterests = [
        ['threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art'],
        ['renewables', 'wind energy'],
        ['threeJS', 'generative art'],
        ['threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art', 'threeJS', 'generative art']
    ]
    let interests = [];
    let currentIndex = -1;
    let prevIndex;

    let headers = []
    // let imgs = []
    onMount(() => {
        headers = outerContainer.querySelectorAll('.about-header');
        // imgs = outerContainer.querySelectorAll('.about-img');
    });

    // Create a function that highlights the correct header based on the equal splits of the height of the scrolling-anchor component
    function highlightHeader() {
        if (outerContainer && $section === 0) {

            const initialOffset = window.innerHeight / 4
            const scrollingAnchorHeight = outerContainer.offsetHeight - window.innerHeight - initialOffset;
            const headerHeight = scrollingAnchorHeight / headerTexts.length;
            currentIndex = Math.floor((window.scrollY - initialOffset) / headerHeight);
            currentIndex = currentIndex > (headerTexts.length - 1) ? (headerTexts.length - 1) : currentIndex;
            // Loop through the headers

            if (prevIndex !== currentIndex) {
                context.clearRect(0, 0, canvas.width, canvas.height)
                for (let i = 0; i < headerTexts.length; i++) {
                    if (window.scrollY > initialOffset) {
                        // If the current index is the same as the looped index
                        if (i === currentIndex) {
                            // Add the active class
                            if (headers.length) {
                                headers[i].classList.add('active');
                                headers[i].style.color = aboutColors[i]
                            }
                            // imgs[i].classList.add('active');
                            paintBackground(canvas, context, images[i], 1)
                            interests = aboutInterests[i]
                            linearGradient = linearGradients[i]
                        } else {
                            // Remove the active class
                            if (headers.length) {
                                headers[i].classList.remove('active');
                                headers[i].style.color = "lightgray"                            
                            }
                            paintBackground(canvas, context, images[i], 0.2)
                            // imgs[i].classList.remove('active');
                        }
                    } else {
                        linearGradient = "linear-gradient(to right, #D2B0EC, #AAC4A2, #8CB2D3, #F2DC9B)";
                        if (headers.length) {
                            headers[i].classList.remove('active');
                            headers[i].style.color = "lightgray"                        
                        }
                        // imgs[i].classList.add('active');
                        paintBackground(canvas, context, images[i], 1)
                        interests = []
                    }
                }
            }
            prevIndex = currentIndex;
        }
        window.requestAnimationFrame(highlightHeader);
    }
    window.requestAnimationFrame(() => { highlightHeader() })


    let images = []
    function make_base(canvas, context, filename, opacity) {
      let base_image = new Image();
      base_image.src = filename;
      base_image.onload = function(){
        paintBackground(canvas, context, base_image, opacity)
      }
      return base_image
    }

    let viewport;
    let canvas;
    let context;
    const imgFiles = [
        "/images/drawing_purple.png",
        "/images/drawing_green.png",
        "/images/drawing_blue.png",
        "/images/drawing_yellow.png",
    ]
    // // let context;
    $: if (viewport) {
        canvas = document.getElementById('viewport');
        context = canvas.getContext('2d');
        imgFiles.forEach((imgFile) => {
            const img = make_base(canvas, context, imgFile, 1);
            images.push(img);
        })
    }

  function paintBackground(canvas, context, element, opacity) {
    if (element) {
      let mode = "contain";
      let percent = 0.5;

      // Background width and height
      let bw = element.width;
      let bh = element.height;

      if(element.nodeName == "VIDEO") {
        bw = element.videoWidth;
        bh = element.videoHeight;
      }

      // Canvas width and height
      let cw = canvas.width;
      let ch = canvas.height;

      // Horizontal and vertical ratios of canvas to image
      let hr = cw / bw;
      let vr = ch / bh;

      // Figure out the draw ratio
      let dr;
      switch(mode) {
        case "horizontal":
          dr = vr;
          break;
        case "vertical":
          dr = hr;
          break;
        case "cover":
          dr = Math.max(hr, vr);
          percent = .5;
          break;
        case "contain":
          dr = Math.min(hr, vr);
          percent = .5;
          break;
      }

      // Scale the image by the draw ratio
      let dw = bw * dr;
      let dh = bh * dr;

      // Figure out the x and y for the image
      let dx = (cw - dw) * percent;
      let dy = (ch - dh) * percent;

      // Clear it
      // context.clearRect(0, 0, cw, ch)

      // Draw the image
      // context.save()
      context.globalAlpha = opacity;
      context.drawImage(element, 0,0, bw, bh, dx, dy, dw, dh);  
      // context.restore();
    }
  }


    let innerWidth = window.innerWidth
    $: isMobile = innerWidth < 1000;
</script>

<svelte:window bind:innerWidth={innerWidth}/>

<scrolling-anchor id="about" bind:this={outerContainer}>
    <div class="about-container">
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
                    <div class="section-subtitle" style={`visibility: ${interests.length ? 'visible' : 'hidden'}`}>Interests</div>
                    <div class="section-description">{@html interests.join(", ")}</div>
                </div>
            </div>
            <div class="img-container">
                <canvas id="viewport"  height="700" width="700" bind:this={viewport}/>
            </div>
        {:else}
            <div class="about-name mobile">
                <TextMorph
                    texts={morphTexts}
                    {linearGradient}
                />
            </div>
            <div class="img-container">
                <canvas id="viewport" height="700" width="700" bind:this={viewport}>
                </canvas>
            </div>
            <div class="about-interests">
                <div
                    style={`
                        color: ${currentIndex >= 0 ? aboutColors[currentIndex] : 'gray'};
                        font-weight: ${currentIndex >= 0 ? '900' : '300'};
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
                <div class="section-description center">{@html interests.join(", ")}</div>
            </div>
        {/if}
    </div>
</scrolling-anchor>

<style>
    #viewport {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    .line {
        display:block;
        border-top:1px solid black;
        text-align:center;
        padding-bottom: 5px;
        margin: 0 auto;
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
        opacity: 0.1;
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
        opacity: 0.1;
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
        opacity: 0.1;
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
        opacity: 0.1;
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
        opacity: 0.1;
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
        opacity: 0.1;
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
        opacity: 0.1;
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
        opacity: 0.1;
      }
      100% {
        opacity: 1;
      }
    }
    scrolling-anchor {
        padding-bottom: 20px;
        width: min(90vw, 1000px);
        margin: 0 auto;
        position:relative;
        height: 500vh;
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
        height: min(80vh, 85vw);
        width: min(80vh, 85vw);
        margin: auto;
        position: relative;
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
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
        -webkit-transform: translate3d(0,0,0);
        transform: translate3d(0,0,0);
        transition: all 0.3s ease-out;
        display: none;
    }
    :global(.about-img.active) {
        opacity: 1;
    }
    @media screen and (max-width: 1000px) {
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
            height: min(80vh, 90vw, 600px);
            width: min(80vh, 90vw, 600px);
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
        .section-description {
             font-size: 14px;
        }
    }
    @media screen and (max-width: 700px) {
        .img-container {
            height: min(80vh, 90vw, 500px);
            width: min(80vh, 90vw, 500px);
        }
    }
</style>