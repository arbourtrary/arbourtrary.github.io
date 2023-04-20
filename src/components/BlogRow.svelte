<script>
    export let blogPost = {};
    export let index = 0;
    export let scrollY = 0;

    let blogRow;
    let opacity = 0;
    let percent = 0;

    $: if (blogRow && scrollY) {
        percent = 1 - blogRow.getBoundingClientRect().top / (window.innerHeight)
        opacity = percent > 0.6 ? 0.8 - (percent - 0.4) : percent < 0.4 ? 2 * percent : 0.8
        opacity = opacity > 1.0 ? 1 : opacity < 0 ? 0 : opacity;
    }
</script>

<div bind:this={blogRow} class="row" style={`display: flex; flex-direction: row; opacity: ${opacity}`}>
    <div class="date">{@html blogPost.date}</div>
    <div class="droplet"><span 
        style="filter:invert(81%) sepia(6%) saturate(2525%) hue-rotate(178deg) brightness(86%) contrast(92%);"
        ><img style="width:100%; height: 100%" src={`/images/droplet_${index}.png`}></span>
</div>
    <div class="title">{blogPost.title}</div>
</div>

<style>
    .row {
        margin: 10px;
        height: 40px;
        transition: opacity 50ms linear;
    }
    .row:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
    .date {
        text-align: center;
        font-family: 'Avenir';
        font-size: 14px;
        white-space: pre-line;
        margin-right: 10px;
        line-height: 20px;
        margin-left: 20px;
    }
    .droplet {
        width: 40px;
    }
    .title {
        font-family: 'Avenir';
        font-size: 24px;
        line-height: 40px;
        margin-left: 10px;
    }
    @media screen and (max-width: 992px) {
        .row {
            height: 25px;
        }
        .date {
            font-size: 10px;
            line-height: 12px;
        }
        .droplet {
            width: 25px;
            height: 25px;
        }
        .title {
            font-size: 16px;
            line-height: 25px;
        }
    }
</style>