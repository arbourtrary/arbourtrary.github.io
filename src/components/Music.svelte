<script>
    import { onMount } from "svelte";
    import Song from "./Song.svelte"

    export let music = [];
    export const limit = 10;
</script>

{#if music}
	<div id="songs-homepage">
	    <div class="songs-container">
	        <div class="songs-header">
	            <h2 class="section-header">Music</h2>
                <data>{music.length}</data>
	        </div>

            <p class="blurb">There's a bunch of songs that I've played on repeat over the years. And I've compiled as many as I could remember. They kinda chronicle my musical journey as my knowledge and taste steadily expanded. A lot of nostalgia creating this - also made a Spotify <a href="https://open.spotify.com/playlist/49MNODTluYpP4z6s0CccPz?si=9e9c9c962cc344de" target="_blank">playlist</a> to accompany the list.</p>

            <div class="songs">
                {#each music as song, i}
        	        <Song 
                        {song}
                        loading={i > 4 ? "lazy" : "eager"}
                    />
                {/each}
            </div>
	    </div>
	</div> 
{/if}

<style>
    #songs-homepage {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin-top: 30px !important;
        margin-bottom: 30px !important;
        --highlight: var(--blue);
    }
    .songs-container, .songs {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .songs {
        margin-top: 15px;
        gap: 45px;
    }
    .songs-header {
        text-decoration: none;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .songs-header data {
        font-size: 16px;
        font-family: "Vollkorn";
        font-weight: 400;
        color: var(--color-2);
        margin-right: 5px;
    }
    .blurb {
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        margin: 0 10px;
        margin-bottom: 15px;
    }
    :global(.songs-body a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
        filter: brightness(0.85);
    }
    :global(.songs-body a:hover) {
        background: var(--highlight);
        text-decoration: none;
        border-radius: 5px;
        color: white;
        filter: brightness(1);
    }
    a {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-2);
        text-decoration-thickness: 0.5px;
        text-underline-offset: 3px;
    }
    a:hover {
        color: var(--color-1);
        text-decoration: underline;
        text-decoration-color: var(--color-1);
        text-decoration-thickness: 1px;
    }
    @media only screen and (max-width: 600px) {
        .songs {
            gap: 30px;
        }
    }
</style>