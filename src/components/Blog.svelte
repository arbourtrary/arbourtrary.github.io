<script>
    import { section } from "../store.js"
    import BlogRow from "./BlogRow.svelte";

    export let sectionIndex = 2;
    export let scrollY = 0;

    let outerContainer;
    $: offset = window.innerHeight / 2;
    $: outerContainer && (scrollY >= (outerContainer.offsetTop - offset)) && (scrollY < (outerContainer.offsetTop + outerContainer.offsetHeight - offset)) && $section !== sectionIndex && section.set(sectionIndex)


    const blogPosts = [
        {
            date: "5/1/23",
            title: "Forest for the trees", 
            slug: "forest-for-the-trees",
            filter: "invert(94%) sepia(10%) saturate(700%) hue-rotate(52deg) brightness(83%) contrast(83%);"
        },
        {
            date: "6/1/23",
            title: "ChatGOT & other puns",
            slug: "chat-got-puns",
            filter: "invert(81%) sepia(6%) saturate(2525%) hue-rotate(178deg) brightness(86%) contrast(92%);"
        },
        {
            date: "7/1/23",
            title: "Orbital tensors, false inventions",
            slug: "orbital-tensors-false-inventions",
            filter: "invert(91%) sepia(12%) saturate(3946%) hue-rotate(186deg) brightness(92%) contrast(90%);"
        },
        {
            date: "8/1/23",
            title: "Scrollytelling with MapLibre",
            slug: "scrollytelling-maplibre",
            filter: "invert(81%) sepia(6%) saturate(2525%) hue-rotate(178deg) brightness(86%) contrast(92%);"
        }
    ]


    const newline = "&#10;"
    for(const blogPost of blogPosts) {
        const date = new Date(blogPost.date)
        const dateFormatted = `${date.toLocaleString('default', { month: 'short' })}${newline}${date.getUTCFullYear()}`
        blogPost.date = dateFormatted
    }

</script>


<div id="blog" bind:this={outerContainer}>
    <div class="blog-container">
        {#each blogPosts as blogPost, i}
            <BlogRow 
                {scrollY}
                {blogPost}
                index={i}
            />
        {/each}
    </div>
</div> 

<style>
    #blog {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
    }
    .blog-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        min-height: 100vh;
        justify-content: center;
    }
    @media screen and (max-width: 1000px) {
        .blog-spacer {
            height: 50px;
        }
    }
</style>