<script>
    import { onMount } from "svelte";
    import { sortByDateString } from "../utils/array.js";
    import { getFullYear } from "../utils/date.js";
    import WritingRow from "./WritingRow.svelte";

    export let writings = [];
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


<div id="writings">
    <div class="writings-container">
        <a class="writings-header" href="/writings" style={limit ? "" : "pointer-events: none"}>
            <h2 class="section-header">Writings
                {#if limit}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"/>
                    </svg>
                {/if}
            </h2>
        </a>
        {#if !limit}
            <p class="blurb">Somewhere to collect my thoughts / ideas / ramblings. Mostly write about nature, philosophies of time, geometry, maybe some software topics.</p>
        {/if}
        {#each sortByDateString(writings, "date") as writing, i}
            {#if (limit && i < limit) || (!limit)}
                {#if splitByYear && isUniqueYear(getFullYear(writing.date))}
                    <h3 class="year section-subhead">{getFullYear(writing.date)}</h3>
                {/if}
                <WritingRow 
                    {writing}
                />
            {/if}
        {/each}
    </div>
</div> 

<style>
    #writings {
        width: 100vw;
        position: relative;
        display: flex;
        flex-direction: row;
        margin: auto 0;
        justify-content: center;
        margin-top: 30px !important;
        margin-bottom: 60px !important;
    }
    .writings-container {
        width: min(95vw, 500px);
        display: flex;
        flex-direction: column;
        margin: auto;
        justify-content: center;
    }
    .writings-header {
        cursor: pointer;
        text-decoration: none !important;
        transition: all 0.3s ease;
        width: fit-content;
    }
    .writings-header:hover h2 {
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