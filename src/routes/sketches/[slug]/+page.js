import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 

const sketches = [
  {
    "date": "11/19/24",
    "title": "Coalescing Text", 
    "slug": "coalescing-text",
    "description": "Code sketch animating letters - words coalescing slowly, evolving, synaesthetic, dissolving",
    "sketch": {
		"name": "CoalescingText"
    },
    "filename": "/data/sketches/coalescing-text.txt",
    "socialImage": "https://arbourtrary.com/images/src/routes/sketches/.jpg"
  }
]

export async function load({ params }) {
  const sketch = sketches.find(item => item.slug === params.slug);

  if (sketch) {
    return sketch;
  }
 
  throw error(404, 'Not found');
}