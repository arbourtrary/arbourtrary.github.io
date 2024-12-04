<script>
    import { section } from "../store.js"

    export let sectionIndex = 3;
    export let scrollY = 0;

    let outerContainer;
    $: offset = window.innerHeight / 2
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)

    let percent = 0
    let opacity = 0;

    $: if (outerContainer && scrollY > 0) {
        percent = 1 - (outerContainer.getBoundingClientRect().top + window.innerHeight / 2) / (window.innerHeight);
        opacity = percent / 5;
    } else {
        percent = 0;
    	opacity = 0;
    }

    $: pointerEvents = $section === sectionIndex ? 'all' : 'none'

    let innerWidth = window.innerWidth
    let innerHeight = window.innerHeight
</script>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>

<div class="background" bind:this={outerContainer}>
	<img
        class="background-image"
        src={`${(innerWidth < 1000) && (innerWidth < innerHeight) ? "/images/bg_bw_portrait.jpeg" : "/images/bg_bw_landscape.jpeg"}`}
        style={`opacity: ${opacity};`}
        alt="background image patterned with an aperiodic monotile"
    >
    <div 
        class="background-contacts"
        style={`opacity: ${Math.pow(percent, 3)};`}
    >
        <a
            class="logo bluesky"
            style={`pointer-events: ${pointerEvents};`}
            href="https://bsky.app/profile/arbourtrary.com"
            target="_blank">
        </a>
        <a
            class="logo github"
            style={`pointer-events: ${pointerEvents};`}
            href="https://github.com/arbourtrary"
            target="_blank">
        </a>
    </div>
</div>
<div id="contact"></div>
<style>
    #contact {
        height: 0px;
    }
    .background {
    	height: 150vh;
    	position: relative;
        pointer-events: none;
    }
    .background-image {
		transition: opacity 250ms linear;
        position: fixed;
		height: 100vh;
		width: 100vw;
		top: 0px;
		left: 0px;
		z-index: 10;
		pointer-events: none;
		object-fit: cover;
		object-position: top right;
    }
    .background-contacts {
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0px;
        left: 0px;
        z-index: 11;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }
    .logo {
        height: 75px;
        width: 75px;
        margin: 40px auto;
        transition: all 100ms ease-in;
    }
    .logo:hover {
        transform: scale(1.2);
    }
    .github {
        background: no-repeat center url("/images/github.png");
        background-size: contain;
    }
    .bluesky {
        background: no-repeat center url("/images/bluesky.png");
        background-size: contain;
    }
    @media screen and (max-width: 1000px) {
        .background-image {
            object-position: center;
        }
    }
</style>
