import sketches from "../../../data/sketches.json";

export function entries() {
    return sketches.map(sketch => {
       return {"slug": sketch.slug}
    });
}

export const ssr = true;
export const prerender = true;
