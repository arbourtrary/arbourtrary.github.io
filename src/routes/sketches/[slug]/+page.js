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
    "socialImage": "https://arbourtrary.com/images/social_sketch_0.jpg"
  },
  {
    "date": "12/03/24",
    "title": "Polygon or Circle?", 
    "slug": "polygon-or-circle",
    "description": "The Platonic circle does not exist, but at what point can we no longer tell the difference?",
    "sketch": {
      "name": "PolygonOrCircle"
    },
    "filename": "/data/sketches/polygon-or-circle.txt",
    "socialImage": "https://arbourtrary.com/images/social_sketch_1.jpg"
  }
]

export async function load({ params }) {
  const sketch = sketches.find(item => item.slug === params.slug);

  if (sketch) {
    return sketch;
  }
 
  throw error(404, 'Not found');
}