<script>
    export let writing = {};
</script>

<a href={`/writings/${writing.slug}`}>
    <div class="row">
        <div class="title">{writing.title}</div>
        <div class="connector"></div>
        <div class="droplet">
            <span style={`filter: ${writing?.filter};`}>
                <img loading="lazy" src={writing?.image} alt="watercolor droplet">
            </span>
        </div>
        <div class="date">{@html writing.date}</div>
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
        margin: 5px 10px;
        transition: opacity 50ms linear;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: var(--color-1);
    }
    .connector {
        width: 100%;
        flex: 1;
        height: 1px;
        opacity: 0.4;
        background: var(--color-3);
        margin: 0 10px;
    }
    .row:hover .connector {
        opacity: 1;
    }
    .row:hover {
        opacity: 1 !important;
        cursor: pointer;
    }
    .row:hover .droplet {
        filter: brightness(0.95);
    }
    .row:hover .title {
        color: var(--black);
    }
    .row:hover .date {
        color: var(--black);
    }
    .date {
        text-align: center;
        font-family: var(--serif);
        color: var(--color-2);
        font-size: 14px;
        white-space: pre-line;
        margin: auto 0;
        margin-left: 10px;
    }
    .droplet {
        width: 40px;
        height: 40px;
        filter: brightness(1.05);
    }
    .title {
        font-family: var(--serif);
        font-size: 24px;
        margin: auto 0;
    }
    .droplet img {
        color: transparent;
    }
    @media screen and (max-width: 700px) {
        /*.date {
            display: none;
        }*/
        .droplet {
            width: 30px;
            height: 30px;
        }
        .title {
            font-size: 22px;
        }
    }
    @media screen and (max-width: 400px) {
        .title {
            font-size: 20px;
        }
    }
</style>