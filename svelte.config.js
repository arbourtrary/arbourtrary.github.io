import adapter from '@sveltejs/adapter-static';

const dev = process.argv.includes('dev');

const config = {
    kit: {
        adapter: adapter(),
        paths: {
            base: dev ? '' : process.env.BASE_PATH,
        }
    }
};

export default config;
