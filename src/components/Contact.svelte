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

    let innerWidth = window.innerWidth
    let innerHeight = window.innerHeight
</script>

<svelte:window bind:innerWidth={innerWidth} bind:innerHeight={innerHeight}/>

<div class="background" bind:this={outerContainer}>
	<img class="background-image" src={`${(innerWidth < 1000) && (innerWidth < innerHeight) ? "/images/bg_bw_portrait.jpeg" : "/images/bg_bw_landscape.jpeg"}`} style={`opacity: ${opacity};`}>
    <div class="background-contacts" style={`opacity: ${Math.pow(percent, 3)};`}>
        <!-- <p class="logo-text" style={`pointer-events: ${$section === sectionIndex ? 'all' : 'none'};`}>Follow me on Twitter :)</p> -->
        <a class="logo twitter" style={`pointer-events: ${$section === sectionIndex ? 'all' : 'none'};`} href="https://www.twitter.com/arbourtrary" target="_blank"></a>
       <!--  <p class="logo-text" style={`pointer-events: ${$section === sectionIndex ? 'all' : 'none'};`}>Check out my code on Github</p> -->
        <a class="logo github" style={`pointer-events: ${$section === sectionIndex ? 'all' : 'none'};`} href="https://github.com/arbourtrary" target="_blank"></a>
    </div>
</div>
<div id="contact"></div>
<style>
    #id {
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
		object-position: right;
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
    .logo-text {
        text-align: center;
        margin: 5px;
        font-family: 'Avenir';
    }
    .logo {
        height: 75px;
        width: 75px;
        margin: 40px auto;
        background: gray;
        transition: all 100ms ease-in;
    }
    .logo:hover {
        transform: scale(1.2);
    }
    .twitter {
        background: no-repeat center url("/images/twitter.png");
        background-size: contain;
    }
    .mastodon {
        background: no-repeat center url("/images/mastodon.png");
        background-size: contain;
    }
    .github {
        background: no-repeat center url("/images/github.svg");
        background-size: contain;
    }
    @media screen and (max-width: 1000px) {
        .background-image {
            object-position: center;
        }
    }
</style>
