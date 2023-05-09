<script>
    export let blogPost = {};
    export let index = 0;
    export let scrollY = 0;

    let blogRow;
    let opacity = 0;
    let percent = 0;

    $: if (blogRow && scrollY) {
        percent = 1 - blogRow.getBoundingClientRect().top / (window.innerHeight)
        opacity = percent < 0.5 ? 1.5 * percent : 1
        // fadein til midpage then fadeout
        // opacity = percent > 0.6 ? 0.8 - (percent - 0.4) : percent < 0.4 ? 2 * percent : 0.8
        opacity = opacity > 1.0 ? 1 : opacity < 0 ? 0 : opacity;
    }
</script>

<a href={`/blog/${blogPost.slug}`} target="_blank">
    <div bind:this={blogRow} class="row" style={`opacity: ${opacity}`}>
        <div class="date">{@html blogPost.date}</div>
        <div class="droplet">
            <span style={`filter: ${blogPost?.filter}`}>
                <img src={`/images/droplet_${index}.png`}>
            </span>
        </div>
        <div class="title">{blogPost.title}</div>
    </div>
</a>

<style>
    a {
        color: unset;
        text-decoration: none;
    }
    img {
        width:100%;
        height: 100%
    }
    .row {
        margin: 10px;
        transition: opacity 50ms linear;
        display: flex;
        flex-direction: row;
        justify-content: center;
        color: var(--color-1);
    }
    .row:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
    .row:hover .title {
        text-decoration: underline;
    }
    .row:hover .droplet {
        filter: brightness(0.95);
    }
    .row:hover .date, .title {
        color: var(--black);
    }
    .date {
        text-align: center;
        font-family: var(--sans);
        font-size: 14px;
        white-space: pre-line;
        margin: auto 0;
        margin-right: 10px;
    }
    .droplet {
        width: 50px;
        height: 50px;
        filter: brightness(1.05);
    }
    .title {
        font-family: var(--sans);
        font-size: 24px;
        margin: auto 0;
        margin-left: 10px;
    }
    @media screen and (max-width: 700px) {
        .date {
            display: none;
            font-size: 14px;
        }
        .droplet {
            width: 40px;
            height: 40px;
        }
        .title {
            font-size: 22px;
        }
    }
    @media screen and (max-width: 400px) {
        .date {
            display: none;
        }
        .title {
            font-size: 18px;
        }
    }
</style>