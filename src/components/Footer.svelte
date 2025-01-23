<script>
	export let maxWidth = 600;
</script>

<footer style={`max-width: ${maxWidth}px;`}>
    <a
        class="logo"
        aria-label="arbourtrary link to bluesky"
        href="https://bsky.app/profile/arbourtrary.com"
        target="_blank"
    >
        <img class="bluesky" width="100" height="90" loading="lazy" src="/images/bluesky.png" alt="bluesky logo"/>
    </a>
    <a
        class="logo github"
        aria-label="arbourtrary link to github"
        href="https://github.com/arbourtrary"
        target="_blank"
    >
        <img class="github" width="100" height="100" loading="lazy" src="/images/github.png" alt="github logo"/>
    </a>
    <a
        class="logo"
        aria-label="arbourtrary link to rss feed"
        href="https://arbourtrary.com/feed/rss"
        target="_blank"
    >
        <img class="rss" width="100" height="100" loading="lazy" src="/images/rss.png" alt="rss logo">
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
		filter: brightness(0) grayscale(1);
		opacity: 0.2;
		transition: opacity 200ms ease;
	}
	footer a:hover img {
		filter: brightness(0);
		opacity: 0.8;
	}
	@media only screen and (max-width: 640px) {
		footer {
			margin: 30px 20px;
			margin-bottom: 60px;
		}
	}
</style>