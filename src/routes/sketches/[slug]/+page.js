import { error } from '@sveltejs/kit';
import { getBase } from '../../../utils/paths.js';
import { clamp } from '../../../utils/math.js'; 
import sketches from "../../../data/sketches.json";

function formatContent(content) {
  // Sketch text only renders at /sketches/<slug>, so one level up is the site
  // root under any base path — and the same string on server and client.
  return content.replaceAll('src="/', 'src="../')
}

export async function load({ params, fetch }) {
  const sketchIndex = sketches.findIndex(item => item.slug === params.slug);

  const sketch = sketches[sketchIndex];
  const prevIndex = clamp(sketchIndex - 1, 0, sketches.length - 1);
  const nextIndex = clamp(sketchIndex + 1, 0, sketches.length - 1);
  
  sketch.prev = (prevIndex !== sketchIndex) ? sketches[prevIndex] : "";
  sketch.next = (nextIndex !== sketchIndex) ? sketches[nextIndex] : "";
  
  const response = await fetch(getBase() + sketch.filename)
  const content = await response.text();
  sketch.content = formatContent(content);

  if (sketch) {
    return {sketch};
  }
 
  throw error(404, 'Not found');
}