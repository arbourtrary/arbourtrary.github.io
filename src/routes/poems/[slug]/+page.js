import { error } from '@sveltejs/kit';
import { clamp } from '../../../utils/math.js';  
import poems from "../../../data/poems.json";

export async function load({ params, fetch }) {
  const poemIndex = poems.findIndex(item => item.slug === params.slug);

  const poem = poems[poemIndex];
  const prevIndex = clamp(poemIndex - 1, 0, poems.length - 1);
  const nextIndex = clamp(poemIndex + 1, 0, poems.length - 1);
  
  poem.prev = (prevIndex !== poemIndex) ? poems[prevIndex] : "";
  poem.next = (nextIndex !== poemIndex) ? poems[nextIndex] : "";
  
  const response = await fetch(`/data/poems/${poem.slug}.json`);
  poem.content = await response.json();

  if (poem) {
    return {poem};
  }
 
  throw error(404, 'Not found');
}