<script>
    import { randomNumber } from '../utils/identifier.js'
    import { getTwoDigitMonthYearDate } from '../utils/date.js';
    import { base } from '$app/paths'

    export let poem = {};

    const colors = [
        "var(--red)",
        "var(--orange)",
        "var(--yellow)",
        "var(--green)",
        "var(--blue)",
        "var(--indigo)",
        "var(--purple)"
    ]
    const color = colors[Math.round(randomNumber(`color ${poem.name}`) * 100) % colors.length];
    const rotate = Math.round(randomNumber(`color ${poem.name}`) * 360);
</script>

<a href={`${base}/poems/${poem.slug}`}>
    <div class="row">
        <div class="title">{poem.name}</div>
        <div class="connector"></div>
        <div class="hexagon" style={`transform-origin: center; transform: rotate(${rotate}deg);`}>
            <svg fill="currentColor" height="75%" width="75%" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                 viewBox="0 0 184.751 184.751" xml:space="preserve">
                <path fill={color} stroke={color} stroke-width="5" d="M0,92.375l46.188-80h92.378l46.185,80l-46.185,80H46.188L0,92.375z"/>
            </svg>
        </div>
        <div class="date">{@html getTwoDigitMonthYearDate(poem.date)}</div>
    </div>
</a>

<style>
    :root {
        --hexagon-opacity: 0.5;
    }
    :root.dark-theme {
        --hexagon-opacity: 0.8;
    }
    a {
        color: unset;
        text-decoration: none;
    }
    .row:hover .hexagon {
        filter: brightness(0.95);
    }
    .row:hover .hexagon {
        opacity: 1;
    }
    .hexagon {
      height: 30px;
      width: 30px;
      opacity: 0.8;
      transition: all 0.3s ease;
      display: flex;
      justify-content: center;
    }
    .hexagon > svg {
        margin: auto;
        overflow: visible;
    }
    .hexagon path {
        fill-opacity: var(--hexagon-opacity);
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
    .row:hover .title {
        color: var(--color-1);
    }
    .row:hover .date {
        color: var(--color-1);
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
    .title {
        font-family: var(--serif);
        font-size: 24px;
        margin: auto 0;
    }
    @media screen and (max-width: 700px) {
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