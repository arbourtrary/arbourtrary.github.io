<script>
	import { base } from '$app/paths'
	export let maxWidth = 600;
</script>

<footer style={`max-width: ${maxWidth}px;`}>
    <a
        class="logo"
        aria-label="arbourtrary link to rss feed"
        href="https://arbourtrary.com/feed/rss"
        target="_blank"
    >
        <img class="rss" width="100" height="100" loading="lazy" src={base + "/images/rss.webp"} alt="rss logo">
    </a>
    <a 
		class="logo kofi"
		aria-label="arbourtrary link to ko-fi"
		href="https://ko-fi.com/arbourtrary"
		target="_blank"
	>
		<img src={base + "/images/kofi.webp"} height="67" width="100" alt="Ko-Fi donation logo">
    </a>
    <a
        class="logo github"
        aria-label="arbourtrary link to github"
        href="https://github.com/arbourtrary"
        target="_blank"
    >
        <img class="github" width="100" height="100" loading="lazy" src={base + "/images/github.webp"} alt="github logo"/>
    </a>
    <a
        class="logo"
        aria-label="arbourtrary link to bluesky"
        href="https://bsky.app/profile/arbourtrary.com"
        target="_blank"
    >
        <img class="bluesky" width="100" height="90" loading="lazy" src={base + "/images/bluesky.webp"} alt="bluesky logo"/>
    </a>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: row;
		gap: 25px;
		justify-content: center;
		align-items: center;
		border-top: 1px solid var(--color-3);
		margin: 30px auto;
		padding-top: 60px;
		margin-bottom: 60px;
	}
	footer img {
		height: 25px;
		width: auto;
		filter: var(--logo-filter);
		opacity: 0.8;
		transition: opacity 200ms ease;
		color: transparent;
	}
	footer a:hover img {
		opacity: 1;
	}
	.logo {
		display: flex;
	}
	.kofi img {
		width: 34px;
	}
	.kofi img, .rss {
		height: 23px;
	}
	@media only screen and (max-width: 640px) {
		footer {
			margin: 15px 20px;
			margin-bottom: 30px;
			padding-top: 30px;
		}
	}
</style>