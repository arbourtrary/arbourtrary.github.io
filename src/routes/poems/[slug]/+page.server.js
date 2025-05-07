import poems from "../../../data/poems.json";

export function entries() {
    return poems.map(poem => {
       return {"slug": poem.slug}
    });
}

export const ssr = true;
export const prerender = true;
