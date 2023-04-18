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
        opacity = percent / 2.5 - 0.2;
    } else {
    	opacity = 0;
    }
</script>

<div id="contact" class="background" bind:this={outerContainer}>
	<img class="background-image" src="/images/bg_bw.png" style={`opacity: ${opacity};`}>
</div>

<style>
    .background {
    	height: 150vh;
    	position: relative;
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
		pointer-events: none;
    }
</style>
