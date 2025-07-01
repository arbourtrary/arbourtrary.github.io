<script>
    import Tool from "./Tool.svelte"

    export let tools = [];
</script>

{#if tools}
	<div id="tools-homepage">
	    <div class="tools-container">
	        <div class="tools-header">
	            <h2 class="section-header">tools</h2>
                <data>{tools.length}</data>
	        </div>

            <p class="blurb">A small list of tools / components I've created to help me out with various projects.</p>

            <div class="tools">
                {#each tools as tool, i}
        	        <Tool 
                        {tool}
                    />
                {/each}
            </div>
	    </div>
	</div> 
{/if}

<style>
    #tools-homepage {
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
    .tools-container, .tools {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .tools {
        margin-top: 15px;
        gap: 45px;
    }
    .tools-header {
        text-decoration: none;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .tools-header data {
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
    :global(.tools-body a) {
        text-decoration: underline;
        padding: 2px;
        color: var(--highlight);
        filter: brightness(0.85);
    }
    :global(.tools-body a:hover) {
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
        .tools {
            gap: 30px;
        }
    }
</style>