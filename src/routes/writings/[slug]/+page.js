import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 

const writings = [
  {
    "date": "5/1/23",
    "title": "Forest for the trees", 
    "slug": "forest-for-the-trees",
    "description": "Walking through the dark forest of the internet and wondering how we can revitalize it.",
    "filename": "/data/writings/forest-for-the-trees.txt",
    "highlight": "var(--green)",
    "filter": "invert(94%) sepia(10%) saturate(700%) hue-rotate(52deg) brightness(83%) contrast(83%)",
    "image": "https://arbourtrary.com/images/droplet_0.png",
    "socialImage": "https://arbourtrary.com/images/social_droplet_0.jpg"
  },
  {
    "date": "9/13/23",
    "title": "The future is irreducible", 
    "slug": "future-is-irreducible",
    "description": "Examining some limits of knowledge, and how the future bends towards chaos.",
    "filename": "/data/writings/future-is-irreducible.txt",
    "highlight": "var(--orange)",
    "filter": "invert(90%) sepia(90%) saturate(5641%) hue-rotate(300deg) brightness(107%) contrast(88%)",
    "image": "https://arbourtrary.com/images/droplet_1.png",
    "socialImage": "https://arbourtrary.com/images/social_droplet_1.jpg"
  }
]

export async function load({ params }) {
  // const writings = await loadJSON('/data/writings.json')
  const writing = writings.find(item => item.slug === params.slug);

  if (writing) {
    return writing;
  }
 
  throw error(404, 'Not found');
}