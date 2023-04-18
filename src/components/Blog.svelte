<script>
    import { section } from "../store.js"
    import { onMount } from "svelte";
    import BlogRow from "./BlogRow.svelte";
    import { inview } from 'svelte-inview';

    export let sectionIndex = 2;
    export let scrollY = 0;

    let blog;
    let isInView = false;
    const options = {
        rootMargin: '-50px',
        unobserveOnEnter: false,
    };

    const handleChange = ((e) => isInView = e.detail.inView);
    $: isInView && section.set(sectionIndex)

    const blogPosts = [
        {date: "7/1/23", title: "Forest for the trees", slug: "forest-for-the-trees"},
        {date: "6/1/23", title: "ChatGOT & other puns", slug: "chat-got-puns"},
        {date: "5/1/23", title: "Orbital tensors, false inventions", slug: "orbital-tensors-false-inventions"},
        {date: "4/1/23", title: "Scrollytelling with MapLibre", slug: "scrollytelling-maplibre"},
        {date: "7/1/23", title: "Forest for the trees", slug: "forest-for-the-trees"},
        {date: "6/1/23", title: "ChatGOT & other puns", slug: "chat-got-puns"},
        {date: "5/1/23", title: "Orbital tensors, false inventions", slug: "orbital-tensors-false-inventions"},
        {date: "4/1/23", title: "Scrollytelling with MapLibre", slug: "scrollytelling-maplibre"},
        {date: "7/1/23", title: "Forest for the trees", slug: "forest-for-the-trees"},
        {date: "6/1/23", title: "ChatGOT & other puns", slug: "chat-got-puns"},
        {date: "5/1/23", title: "Orbital tensors, false inventions", slug: "orbital-tensors-false-inventions"},
        {date: "4/1/23", title: "Scrollytelling with MapLibre", slug: "scrollytelling-maplibre"},
        {date: "7/1/23", title: "Forest for the trees", slug: "forest-for-the-trees"},
        {date: "6/1/23", title: "ChatGOT & other puns", slug: "chat-got-puns"},
        {date: "5/1/23", title: "Orbital tensors, false inventions", slug: "orbital-tensors-false-inventions"},
        {date: "4/1/23", title: "Scrollytelling with MapLibre", slug: "scrollytelling-maplibre"},
        {date: "7/1/23", title: "Forest for the trees", slug: "forest-for-the-trees"},
        {date: "6/1/23", title: "ChatGOT & other puns", slug: "chat-got-puns"},
        {date: "5/1/23", title: "Orbital tensors, false inventions", slug: "orbital-tensors-false-inventions"},
        {date: "4/1/23", title: "Scrollytelling with MapLibre", slug: "scrollytelling-maplibre"},
    ]  


    const newline = "&#10;"
    for(const blogPost of blogPosts) {
        const date = new Date(blogPost.date)
        const dateFormatted = `${date.toLocaleString('default', { month: 'short' })}${newline}${date.getUTCFullYear()}`
        blogPost.date = dateFormatted
    }

</script>

<div id="blog" style={`height: auto; width: 100vw`} bind:this={blog} use:inview={options} on:inview_change={handleChange}>
    <div style="position: relative; top: 0; display: flex; padding-top: 75px; flex-direction: row; margin: auto 0; justify-content: center;">

        <div style="height: 25vh;"></div>
        <div style="width: min(95vw, 500px); display: flex; flex-direction: column; margin: auto;">
            {#each blogPosts as blogPost, i}
                <BlogRow 
                    {scrollY}
                    {blogPost}
                    index={i}
                />
            {/each}
        </div>
    </div>
</div> 

<style>
    #blog {
        width: 100vw;
    }
</style>