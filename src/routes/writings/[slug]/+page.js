import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 

const writings = [
  {
    "index": 0,
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
    "index": 1,
    "date": "9/13/23",
    "title": "The future is irreducible", 
    "slug": "future-is-irreducible",
    "description": "Examining some limits of knowledge, and how the future bends towards chaos.",
    "filename": "/data/writings/future-is-irreducible.txt",
    "highlight": "var(--orange)",
    "filter": "invert(90%) sepia(90%) saturate(5641%) hue-rotate(300deg) brightness(107%) contrast(88%)",
    "image": "https://arbourtrary.com/images/droplet_1.png",
    "socialImage": "https://arbourtrary.com/images/social_droplet_1.jpg"
  },
  {
    "index": 2,
    "date": "11/26/23",
    "title": "In real time", 
    "slug": "in-real-time",
    "description": "Reminding ourselves that we can move away from the false time of computation and encouraging ourselves to live in real time",
    "filename": "/data/writings/in-real-time.txt",
    "highlight": "var(--purple)",
    "filter": "invert(58%) sepia(57%) saturate(315%) hue-rotate(231deg) brightness(81%) contrast(88%)",
    "image": "https://arbourtrary.com/images/droplet_2.png",
    "socialImage": "https://arbourtrary.com/images/social_droplet_2.jpg"
  },
  {
    "index": 3,
    "date": "10/23/24",
    "title": "Silvology", 
    "slug": "silvology",
    "description": "An ongoing poetic dictionary of the forest, the woods and all things sylvan",
    "filename": "/data/writings/silvology.txt",
    "highlight": "var(--green)",
    "filter": "invert(94%) sepia(10%) saturate(700%) hue-rotate(52deg) brightness(83%) contrast(83%)",
    "image": "https://arbourtrary.com/images/droplet_3.png",
    "socialImage": "https://arbourtrary.com/images/social_droplet_3.jpg"
  }
]

export async function load({ params }) {
  // const writings = await loadJSON('/data/writings.json')
  const writing = writings.find(item => item.slug === params.slug);

  if (writing) {
    return {writing, writings};
  }
 
  throw error(404, 'Not found');
}