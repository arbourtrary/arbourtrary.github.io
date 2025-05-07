import writings from "../../../data/writings.json";

export function entries() {
    return writings.map(writing => {
       return {"slug": writing.slug}
    });
}

export const ssr = true;
export const prerender = true;
