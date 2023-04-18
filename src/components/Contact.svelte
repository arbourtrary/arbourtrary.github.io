<script>
    import { section } from "../store.js"
	import { onMount } from "svelte";
    import { inview } from 'svelte-inview';

    export let sectionIndex = 3;
    export let scrollY = 0;

    let contact;
    let isInView = false;
    const options = {
        rootMargin: '5px',
        unobserveOnEnter: false,
    };

    const handleChange = ((e) => isInView = e.detail.inView);
    $: isInView && section.set(sectionIndex)

    let percent = 0
    let opacity = 0;

    $: if (contact && scrollY > 0) {
        percent = 1 - (contact.getBoundingClientRect().top + window.innerHeight / 2) / (window.innerHeight);
        opacity = percent / 2.5 - 0.2;
    } else {
    	opacity = 0;
    }
</script>

<div use:inview={options} on:inview_change={handleChange} style="position: relative; height: 100vh; width: 100vw"></div>
<div class="background" bind:this={contact}>
	<img class="background-image" src="/images/bg_bw.png" style={`opacity: ${opacity};`}>
</div>
<div id="contact" style="height: 0;"></div>

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
