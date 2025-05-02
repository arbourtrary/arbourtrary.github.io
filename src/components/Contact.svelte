<script>
    import { onMount } from "svelte";
    import { base } from '$app/paths';
    // export let scrollY = 0;
    // let outerContainer;
    // let mounted = false;
    // let percent = 0;
    // let opacity = 0;
    
    // onMount(() => {
    //     mounted = true;
    // });
    
    // $: if (mounted && (outerContainer && scrollY > 0)) {
    //     percent = 1 - (outerContainer.getBoundingClientRect().top + window.innerHeight / 2) / (window.innerHeight);
    //     opacity = percent / 5;
    // } else {
    //     percent = 0;
    //     opacity = 0;
    // }
</script>

<div class="background">
    <div class="background-contacts" style="opacity: 1;">
        <!-- <picture>
            <source media="(max-width: 1000px) and (orientation: portrait)" srcset="{base}/images/bg_bw_portrait.webp" />
            <source media="(min-width: 1001px), (orientation: landscape)" srcset="{base}/images/bg_bw_landscape.webp" />
            <img
                class="background-image"
                src="{base}/images/bg_bw_landscape.webp"
                style={`opacity: ${opacity};`}
                alt="background patterned with an aperiodic monotile"
                loading="lazy"
            />
        </picture> -->
        
        <a
            class="logo"
            aria-label="arbourtrary link to bluesky"
            href="https://bsky.app/profile/arbourtrary.com"
            target="_blank"
        >
            <img class="bluesky" width="100" height="90" loading="lazy" src="{base}/images/bluesky.webp" alt="bluesky logo"/>
        </a>
        <a
            class="logo github"
            aria-label="arbourtrary link to github"
            href="https://github.com/arbourtrary"
            target="_blank"
            rel="me"
        >
            <img class="github" width="100" height="100" loading="lazy" src="{base}/images/github.webp" alt="github logo"/>
        </a>
        <a
            class="logo"
            aria-label="arbourtrary link to rss feed"
            href="https://arbourtrary.com/feed/rss"
            target="_blank"
        >
            <img class="rss" width="100" height="100" loading="lazy" src="{base}/images/rss.webp" alt="rss logo" />
        </a>
    </div>
</div>
<div id="contact"></div>

<style>
    #contact {
        height: 0px;
    }
    .background {
        height: 100vh;
        position: relative;
        pointer-events: none;
    }
    .background-image {
        transition: opacity 250ms linear;
        position: absolute;
        height: 100vh;
        width: 100vw;
        top: 0px;
        left: 0px;
        z-index: 10;
        pointer-events: none;
        object-fit: cover;
        object-position: top right;
        mix-blend-mode: multiply;
    }
    .background-contacts {
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0px;
        z-index: 11;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }
    .logo {
        height: 60px;
        width: 60px;
        margin: 30px auto;
        transition: all 200ms ease-in;
        display: flex;
        justify-content: center;
        text-decoration: none;
        pointer-events: all;
        filter: var(--logo-filter);
    }
    .logo:hover {
        transform: scale(1.1);
    }
    .logo img {
        height: 100%;
        width: 100%;
        color: transparent;
    }
    .bluesky {
        height: 90% !important;
    }
    .rss {
        height: 45px !important;
        width: 45px !important;
    }
    @media screen and (max-width: 1000px) {
        .background-image {
            object-position: center;
        }
        .logo {
            height: 55px;
            width: 55px;
        }
        .rss {
            height: 40px !important;
            width: 40px !important;
        }
    }
</style>