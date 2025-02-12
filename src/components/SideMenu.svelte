<script>
  import Footer from "./Footer.svelte";
  import { onMount } from 'svelte';
  import { base } from '$app/paths'

  let isOpen = false;
  let overlay;
  let mounted = false;

  onMount(() => {
    mounted = true;
  });
  
  function toggleMenu() {
    isOpen = !isOpen;
    if (isOpen) {
      mounted && document.body.classList.add("no-overflow");
      overlay && overlay.classList.add("fade");
    } else {
      mounted && document.body.classList.remove("no-overflow");
      overlay && overlay.classList.remove("fade");
    }
  }

  $: !isOpen && mounted && document.body.classList.remove("no-overflow");
</script>

<div class="overlay" bind:this={overlay}></div>

<div class="menu-container">
  <!-- Menu Button -->
  <button 
    class="menu-button" 
    on:click={toggleMenu}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
  >
    {#if isOpen}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
      </svg>
    {/if}
  </button>

  <!-- Side Menu Panel -->
  <nav class="side-menu" class:open={isOpen}>
    <ul>
      <li><a href={base + "/about"}>About</a></li>
      <li><a href={base + "/books"}>Books</a></li>
      <li><a href={base + "/poems"}>Poems</a></li>
      <li><a href={base + "/projects"}>Projects</a></li>
      <li><a href={base + "/sketches"}>Sketches</a></li>
      <li><a href={base + "/writings"}>Writings</a></li>
    </ul>
    
    <Footer/>
  </nav>
</div>

<style>
  .overlay {
    position: fixed;
    height: 100%;
    width: 100%;
    background: var(--bg-color);
    opacity: 0;
    pointer-events: none;
    margin: 0;
    padding: 0;
    top: 0;
    transition: opacity 0.8s ease-out;
  }
  :global(.overlay.fade) {
    opacity: 0.6 !important;
    pointer-events: all;
  }
  :global(nav footer) {
    padding-top: 30px !important;
  }
  nav {
    box-sizing: border-box;
    border-left: 0.5px solid var(--color-2);
  }
  .menu-container {
    position: relative;
    display: flex;
    width: 29px;
    padding: 0px;
    padding-right: 5px;
  }

  .menu-button {
    position: relative;
    z-index: 50;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .side-menu {
    position: fixed;
    top: 0;
    right: max(-250px, -100%);
    height: 100%;
    width: min(250px, 100%);;
    background: var(--bg-color);
    padding: 4rem 1.5rem;
    z-index: 45;
    transition: right .8s cubic-bezier(.16,1,.3,1);
  }

  .side-menu.open {
    right: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
  }

  li {
    margin-bottom: 1rem;
  }

  a {
    color: var(--color-1);
    font-family: var(--serif);
    font-size: var(--font-lg);
    text-decoration: none;
    transition: color 0.2s ease;
    width: 100%;
    display: block;
  }

  a:hover {
    color: var(--blue);
  }

  .menu-button svg, .menu-button path {
    color: var(--color-1);
  }

  @media only screen and (max-width: 640px) {
    :global(nav footer) {
        margin: unset !important;
    }
  }
</style>