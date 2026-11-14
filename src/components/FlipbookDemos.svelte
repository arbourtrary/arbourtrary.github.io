<script>
    // Live Flipbook Foundry on its own project page: a paragraph set by the
    // library with figures in the words, and a few inline figures that
    // inherit the text colour and flip when you point at them.
    import { onMount } from "svelte";
    import { Page, Figure } from "flipbook-foundry/svelte";

    const story =
        "Bob {walk} left the house at nine. Sue {wave} waved from the window, and the dog {run} chased the postman. " +
        "Halfway down the road Bob {trip>get-up>dust-off} tripped, sat {sit-idle} on the curb for a while, then got up and {backflip} showed off. Nobody {clap} minded.";

    let width = 0;
    let ink = "#373531";
    let font = "";

    // The page draws its words on a canvas, so it needs the site's font and
    // ink spelled out — and told again when the theme flips.
    function readTheme() {
        ink = getComputedStyle(document.documentElement).getPropertyValue("--color-1").trim() || ink;
    }

    onMount(() => {
        readTheme();
        const mo = new MutationObserver(readTheme);
        mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        const f = '400 18px "IM Fell English"';
        document.fonts.load(f).finally(() => (font = f));
        return () => mo.disconnect();
    });
</script>

<div class="demos" bind:clientWidth={width}>
    {#if font && width}
        {#key ink}
            <Page text={story} {font} color={ink} lineHeight={30} />
        {/key}
    {/if}

    <p>
        Or drop one into any sentence. This one <Figure animate="idle" whileHover="backflip" /> does a backflip when you point at it,
        this one <Figure animate="wave" whileHover="cheer" /> just wants to say hello, and this one
        <Figure animate="sit-idle" whileHover="stand-up" /> is taking a break.
    </p>
</div>

<style>
    .demos {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .demos p {
        margin: 0;
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        line-height: 1.6;
    }
</style>
