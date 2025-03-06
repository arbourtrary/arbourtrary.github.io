<script>
    import { sketchComponents } from './sketch-components';
    
    export let componentName = '';
    
    async function loadComponent(name) {
        if (!sketchComponents[name]) {
            throw new Error(`Sketch component ${name} not found`);
        }
        const module = await sketchComponents[name]();
        return module.default;
    }
</script>

{#await loadComponent(componentName)}
    <div></div>
{:then component}
    <svelte:component this={component} />
{:catch error}
    <div>Error loading sketch: {error.message}</div>
{/await} 