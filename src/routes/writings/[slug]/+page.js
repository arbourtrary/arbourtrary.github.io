import { error } from '@sveltejs/kit';
import { clamp } from '../../../utils/math.js';  

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
    "image": "/images/droplet_0.webp",
    "socialImage": "/images/social_droplet_0.webp"
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
    "image": "/images/droplet_1.webp",
    "socialImage": "/images/social_droplet_1.webp"
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
    "image": "/images/droplet_2.webp",
    "socialImage": "/images/social_droplet_2.webp"
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
    "image": "/images/droplet_3.webp",
    "socialImage": "/images/social_droplet_3.webp"
  }
]

export async function load({ params, fetch }) {
  const writing = writings.find(item => item.slug === params.slug);

  const writingIndex = writing.index;
  const prevIndex = clamp(writingIndex - 1, 0, writings.length - 1);
  const nextIndex = clamp(writingIndex + 1, 0, writings.length - 1);
  
  writing.prev = (prevIndex !== writingIndex) ? writings[prevIndex] : writings[writings.length - 1];
  writing.next = (nextIndex !== writingIndex) ? writings[nextIndex] : writings[0];
  
  const response = await fetch(`/data/writings/${writing.slug}.txt`);
  writing.content = await response.text();

  if (writing) {
    return {writing};
  }
 
  throw error(404, 'Not found');
}