


  <script>
    import Header from "../../components/Header.svelte"
    import Music from "../../components/Music.svelte"
    import Footer from '../../components/Footer.svelte';
    import photoData from "../../data/photos.json";
    import { onMount } from "svelte";

    let DEFAULT_HEIGHT = 40;
    let shouldHydrate = false;
    let gallery;

    let expand;
    let collapse;
    let expanded = false;

    onMount(() => {
        shouldHydrate = true;
    })  

    function updateHeight(img, parent) {
      if (img?.complete) {
        const naturalRatio = img.naturalHeight / img.naturalWidth;
        const isActive = parent.classList.contains('active');

        const baseWidth = parent.offsetWidth;
        const height = baseWidth * naturalRatio;
        const figure = parent.querySelector("figure");

        parent.style.height = isActive ? `${height}px` : `${DEFAULT_HEIGHT}px`;
        figure.style.height = isActive ? `${height}px` : `${DEFAULT_HEIGHT}px`;
      }
    }
      
    function handleClick(e, index) {
      const parent = e.target;
      const img = parent.querySelector("img");
      e.target.classList.toggle('active');
      updateHeight(img, parent);
    }

    function expandFigures() {
        expand.classList.remove("active");  
        collapse.classList.add("active");
        const figures = [...gallery.querySelectorAll(".image-container")];
        figures.forEach(figure => {
            figure.classList.add('active');
            const img = figure.querySelector("img");
            updateHeight(img, figure);
            expanded = true;
        })
    }

    function collpaseFigures() {
        expand.classList.add("active");  
        collapse.classList.remove("active");
        const figures = [...gallery.querySelectorAll(".image-container")];
        figures.forEach(figure => {
            figure.classList.remove('active');
            const img = figure.querySelector("img");
            updateHeight(img, figure);
        })
        expanded = false;
    }

    function handleExpansion() {
        expanded ? collpaseFigures() : expandFigures();
    }

    function resetFigureStyle() {
        const figures = [...gallery.querySelectorAll(".image-container")];
        figures.forEach(figure => {
            if (figure) {
                figure.removeAttribute('style');
                figure.classList.remove("active");
            }
        });
    }

    $: if (gallery) {
        resetFigureStyle();
        collpaseFigures();
    }
</script>

<svelte:head>
    <title>Photos</title>
    <link rel='canonical' href="https://arbourtrary.com/photos" />
    <meta name='description' content="" />        
    <meta property='og:title' content="Photos" />
    <meta property='og:site_name' content='arbourtrary' />
    <meta property='og:url' content="https://arbourtrary.com/photos" />
    <meta property='og:description' content="" />
    <meta property='og:locale' content='en_US' />
    <meta property='og:image' content="https://arbourtrary.com/images/social_music.webp" />
    
    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:site' content="https://arbourtrary.com/photos" />
    <meta name='twitter:creator' content='arbourtrary' />
    <meta name='twitter:title' content="Photos" />
    <meta name='twitter:description' content="" />
    <meta name='twitter:image:src' content="https://arbourtrary.com/images/social_photos.webp" />
</svelte:head>

{#if shouldHydrate}
    <Header/>


    <div id="photos-homepage">
      <h2 class="section-header s-7zkFwywqcCts">Photos</h2>
      <p class="blurb">As long as I can remember, I've enjoyed taking photos mostly of nature - trees, oceans, lakes, flowers. Sometimes there's cool geometry in a building or a bridge. The blurred, grainy style is inspired by this <a href='https://photogradient.com/' target='_blank'>Photo Gradient</a> tool by <a href='https://www.danield.design/' target='_blank'>Daniel Destanfis</a>.</p>
    </div>
    <div class="gallery-header">
        <h3 class="subsection-header">Gallery</h3>
        <button on:click={() => handleExpansion()}>
            <svg bind:this={expand} class="active" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"/>
            </svg>
            <svg bind:this={collapse} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-arrows-collapse" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z"/>
            </svg>
        </button>
    </div>
    <div class="gallery" bind:this={gallery}>
      {#each photoData as photo, i}
        <div class="image-container" on:click={(e) => handleClick(e, i)} on:keydown={(e) => handleClick(e, i)}>
            <figure>
              <img loading={i > 20 ? "lazy" : "eager"} class="filtered-image" src={`/images/photos/${photo.filename}`}/>
              <div class="noise"></div>
          </figure>
        </div>
      {/each}
    </div>
    <Footer/>
{/if}

<style>
  #photos-homepage {
    width: min(90vw, 600px);
    display: flex;
    flex-direction: column;
    margin: auto;
    justify-content: center;
    margin-top: 30px !important;
  }
    .blurb {
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        margin: 0;
        margin-bottom: 45px;
    }
    .blurb a {
      color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-2);
        text-decoration-thickness: 0.5px;
        text-underline-offset: 3px;
    }
    .blurb a:hover {
        text-decoration-color: var(--color-1);
        text-decoration-thickness: 1px;
    }
  .gallery, .gallery-header {
    width: min(600px, 90vw);
    margin: 0 auto;
  }
  .section-header {
    margin-left: 0px;
  }
  .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      margin-bottom: 10px;
  }
  .gallery-header button {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      height: 23px;
      width: 20px;
      color: var(--color-2);
      transition: all 0.3s ease;
      padding-bottom: 3px;
  }
  .gallery-header button svg {
      display: none;
  }
  .gallery-header button svg.active {
      display: block;
  }
  .gallery-header button:hover {
      color: var(--color-1);
  }
  .subsection-header {
      font-size: 0.8rem;
      padding-bottom: 3px;
        width: fit-content;
        margin: 0;
        font-family: "Vollkorn";
        color: var(--color-2);
        display: flex;
        align-items: center;
        text-transform: uppercase;
        letter-spacing: 2px;
  }
  .gallery {
    margin: 0 auto;
    max-width: 600px;
  }
  .image-container {
    display: flex;
    justify-content: center;
    gap: 0px;
    overflow: hidden;
    border-radius: 10px;
/*    box-shadow: 0px 0px 1px rgba(3, 7, 18, 0.02), 0px 0px 4px rgba(3, 7, 18, 0.03), 0px 0px 9px rgba(3, 7, 18, 0.05), 0px 0px 15px rgba(3, 7, 18, 0.06), 0px 0px 24px rgba(3, 7, 18, 0.08);*/
    transition: all 0.5s ease;
    border: 1px solid transparent;
    height: 40px;
    cursor: pointer;
    opacity: 0.8;
  }
  .image-container:hover {
    opacity: 1;
  }
  figure {
    height: 40px;
    width: 100%;
    overflow: hidden;
    border-radius: 10px;
    position: relative;
    opacity: 1;
    margin: 0;
    transition: all 0.5s ease;
    pointer-events: none;
  }
  .filtered-image {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    width: 100%;
    height: auto;
    filter: blur(20px);
    transition: all 0.5s ease;
    pointer-events: none;
  }
  .noise {
      width: 100%;
      height: 100%;
      opacity: 0.2;
/*      filter: contrast(170%) brightness(100%);*/
      transition: all 0.5s ease;
      background: linear-gradient(0deg, rgba(255,255,255,0.005), rgba(255,255,255,0.005)), url("/images/photos/noise.webp");

/*      url("data:image/svg+xml,%3Csvg viewBox='0 0 347 347' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.74' numOctaves='20' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")*/
      pointer-events: none;
  }
  :global(.image-container.active) {
    opacity: 1;
  }
  :global(.image-container.active .filtered-image) {
    filter: blur(0px);
  }
  :global(.image-container.active .noise) {
    opacity: 0;
  }
  .image-container:last-of-type {
    margin-bottom: 60px !important;
  }
  @media only screen and (max-width: 600px) {
      .gallery, .gallery-header {
          width: 90vw;
      }
      .subsection-header {
          font-size: 0.75rem;
      }
  }
</style>