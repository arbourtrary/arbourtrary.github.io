import { error } from '@sveltejs/kit';
import { clamp } from '../../../utils/math.js';  
import writings from "../../../data/writings.json";

export async function load({ params, fetch }) {
  const writingIndex = writings.findIndex(item => item.slug === params.slug);

  const writing = writings[writingIndex];
  const prevIndex = clamp(writingIndex - 1, 0, writings.length - 1);
  const nextIndex = clamp(writingIndex + 1, 0, writings.length - 1);
  
  writing.prev = (prevIndex !== writingIndex) ? writings[prevIndex] : "";
  writing.next = (nextIndex !== writingIndex) ? writings[nextIndex] : "";
  
  const response = await fetch(`/data/writings/${writing.slug}.txt`);
  writing.content = await response.text();

  if (writing) {
    return {writing};
  }
 
  throw error(404, 'Not found');
}