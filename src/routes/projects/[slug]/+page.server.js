import projects from "../../../data/projects-homepage.json";

export function entries() {
    return projects.map(project => {
       return {"slug": project.slug}
    });
}

export const ssr = true;
export const prerender = true;
