<script>
    import { base } from '$app/paths'
    import { randomNumber } from '../utils/identifier.js'
    import { getTwoDigitMonthYearDate } from '../utils/date.js';

    export let project = {};

    const colors = [
        "var(--red)",
        "var(--orange)",
        "var(--yellow)",
        "var(--green)",
        "var(--blue)",
        "var(--indigo)",
        "var(--purple)"
    ]
    const color = colors[Math.round(randomNumber(`color ${project.title}`) * 100) % colors.length];
    const rotate = Math.round(randomNumber(`color ${project.title}`) * 360);
</script>

<a href={base + `projects/${project.slug}`}>
    <div class="row">
        <div class="title">{project.title}</div>
        <div class="connector"></div>
        <div class="pentagon" style={`transform-origin: center; transform: rotate(${rotate}deg);`}>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
				<path d="M 76.21 24.77 L 0 80 L -76.21 24.77 L -47.14 -64.77 L 47.14 -64.77 Z" fill-opacity={0.5} fill={color} stroke={color} stroke-width="5"/>
			</svg>
        </div>
        <div class="date">{@html getTwoDigitMonthYearDate(project.date)}</div>
    </div>
</a>

<style>
    a {
        color: unset;
        text-decoration: none;
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
    .row:hover .pentagon {
        filter: brightness(0.95);
    }
    .row:hover .title {
        color: var(--black);
    }
    .row:hover .date {
        color: var(--black);
    }
    .row:hover .pentagon {
    	opacity: 1;
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
	.pentagon {
	  height: 30px;
	  width: 30px;
	  opacity: 0.8;
	  transition: all 0.3s ease;
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