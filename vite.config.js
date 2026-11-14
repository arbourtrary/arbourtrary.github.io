import { sveltekit } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-static';
import { defineConfig } from 'vite';
// import { visualizer } from 'rollup-plugin-visualizer';

// SvelteKit 3 reads its config here (svelte.config.js is no longer used).
const dev = process.argv.includes('dev');

export default defineConfig({
	plugins: [
		sveltekit({
			adapter: adapter(),
			paths: {
				base: dev ? '' : process.env.BASE_PATH
			}
		}),
		// visualizer({
		// 	emitFile: true,
		// 	filename: 'stats.html'
		// })
	],
	build: {
		chunkSizeWarningLimit: 520
    },
	optimizeDeps: {},
	server: {
		port: 8000
	}
});
