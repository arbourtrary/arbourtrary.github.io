import { error } from '@sveltejs/kit';
import { clamp } from '../../../utils/math.js';
import projects from "../../../data/projects-homepage.json";

export async function load({ params }) {
  const projectIndex = projects.findIndex(item => item.slug === params.slug);

  const project = projects[projectIndex];
  const prevIndex = clamp(projectIndex - 1, 0, projects.length - 1);
  const nextIndex = clamp(projectIndex + 1, 0, projects.length - 1);
  
  project.prev = (prevIndex !== projectIndex) ? projects[prevIndex] : "";
  project.next = (nextIndex !== projectIndex) ? projects[nextIndex] : "";

  if (project) {
    return {project};
  }
 
  throw error(404, 'Not found');
}