<script>
    import { onMount } from "svelte";
    import { getFullYear } from "../utils/date.js";
    import { base } from '$app/paths'
    import PoemRow from "./PoemRow.svelte";
    
    export let poems = [];
    export let splitByYear = false;
    export let limit = 10;

    let currentYear;

    function isUniqueYear(year) {
        if (year !== currentYear) {
            currentYear = year;
            return true;
        } else {
            return false;
        }
    }
</script>


<div id="poems">
    <div class="poems-container">
        <a class="poems-header" href={base + "/poems"} style={limit ? "" : "pointer-events: none"}>
            <h2 class="section-header">Poems
                {#if limit}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                {/if}
            </h2>
            {#if !limit}
                <data>{poems.length}</data>
            {/if}
        </a>
        {#if !limit}
            <p class="blurb">I can't say these are all good or worth your time. I can say I wrote them, sometimes out of reluctance. Sometimes in rapture.</p>
        {/if}
        {#each poems.slice().reverse() as poem, i}
            {#if (limit && i < limit) || (!limit)}
                {#if splitByYear && isUniqueYear(getFullYear(poem.date))}
                    <h3 class="year section-subhead">{getFullYear(poem.date)}</h3>
                {/if}
                <PoemRow 
                    {poem}
                />
            {/if}
        {/each}
    </div>
</div> 

<style>
    #poems {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin-top: 30px !important;
        margin-bottom: 60px !important;
    }
    .poems-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .poems-header {
        cursor: pointer;
        text-decoration: none !important;
        transition: all 0.3s ease;
        width: fit-content;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .poems-header data {
        font-size: 16px;
        font-family: "Vollkorn";
        font-weight: 400;
        color: var(--color-2);
        margin-right: 5px;
    }
    .poems-header:hover h2 {
        color: var(--color-1);
    }
    .blurb {
        font-family: var(--serif);
        color: var(--color-1);
        font-size: 18px;
        margin: 0 10px;
        margin-bottom: 15px;
    }
    h2 svg {
        position: relative;
        margin-left: 7px;
        margin-bottom: 4px;
        height: 16px;
        width: 16px;
    }
    .year {
        letter-spacing: 2px;
        margin-top: 30px;
        margin-bottom: 2px;
    }
    @media only screen and (max-width: 700px) {
        h2 svg {
            position: relative;
            margin-left: 7px;
            margin-bottom: 2px;
            height: 14px;
            width: 14px;
        }
    }
</style>