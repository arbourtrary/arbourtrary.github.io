import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 

const sketches = [
  {
    "index": 0,
    "date": "11/17/24",
    "title": "Coalescing Text", 
    "slug": "coalescing-text",
    "description": "Code sketch animating letters - words coalescing slowly, evolving, synaesthetic, dissolving",
    "sketch": {
		  "name": "CoalescingText"
    },
    "filename": "/data/sketches/coalescing-text.txt",
    "socialImage": "https://arbourtrary.com/images/social_sketch_0_viz.jpg"
  },
  {
    "index": 1,
    "date": "11/24/24",
    "title": "Polygon or Circle?", 
    "slug": "polygon-or-circle",
    "description": "The Platonic circle does not exist, but at what point can we no longer tell the difference?",
    "sketch": {
      "name": "PolygonOrCircle"
    },
    "filename": "/data/sketches/polygon-or-circle.txt",
    "socialImage": "https://arbourtrary.com/images/social_sketch_1_viz.jpg"
  },
  {
    "index": 2,
    "date": "11/29/24",
      "title": "Direct Etymologies", 
      "slug": "direct-etymologies",
      "description": "Scraping my own website to find etymologies of words that are the result of a direct lineage",
      "sketch": {
        "name": "DirectEtymologies"
      },
      "filename": "/data/sketches/direct-etymologies.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_2_viz.jpg"
  },
  {
    "index": 3,
    "date": "12/1/24",
      "title": "Childhood Dictionary", 
      "slug": "childhood-dictionary",
      "description": "An ongoing collection of all the brand new words, chimeric words and otherwise original language that come from my toddlers",
      "sketch": {
        "name": "ChildhoodDictionary"
      },
      "filename": "/data/sketches/childhood-dictionary.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_3_viz.jpg"
  },
  {
    "index": 4,
    "date": "12/1/24",
      "title": "Line Drawings", 
      "slug": "line-drawings",
      "description": "Vectorizing and animating a handful of Wacław Szpakowski's beautiful, mazelike line drawings",
      "sketch": {
        "name": "LineDrawings"
      },
      "filename": "/data/sketches/line-drawings.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_4_viz.jpg"
  },
  {
    "index": 5,
    "date": "12/31/24",
      "title": "Image Sampling", 
      "slug": "image-sampling",
      "description": "Recreating an image processing effect from the artist Kensuke Koike, finding beauty in the approximate",
      "sketch": {
        "name": "ImageSampling"
      },
      "filename": "/data/sketches/image-sampling.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_5_viz.jpg"
  },
  {
    "index": 6,
    "date": "1/13/25",
      "title": "Island Peakscapes", 
      "slug": "island-peakscapes",
      "description": "Taking inspiration from Chaney Swiney's peakscapes and creating beautiful gradients of some of my favorite islands",
      "sketch": {
        "name": "IslandPeakscapes"
      },
      "filename": "/data/sketches/island-peakscapes.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_6_viz.jpg"
  },
  {
    "index": 7,
    "date": "1/18/25",
      "title": "Cistercian Ciphers", 
      "slug": "cistercian-ciphers",
      "description": "Learning the interesting symmetry of the Cistercian numeric runes with an annotated interactive",
      "sketch": {
        "name": "CistercianCiphers"
      },
      "filename": "/data/sketches/cistercian-ciphers.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_7_viz.jpg"
  },
  {
    "index": 8,
    "date": "1/22/25",
      "title": "Climbing Trees", 
      "slug": "climbing-trees",
      "description": "Reminiscing and collecting silhouettes of a few of my favorite trees",
      "sketch": {
        "name": "ClimbingTrees"
      },
      "filename": "/data/sketches/climbing-trees.txt",
      "socialImage": "https://arbourtrary.com/images/social_sketch_8_viz.jpg"
  }
]

export async function load({ params }) {
  const sketch = sketches.find(item => item.slug === params.slug);

  if (sketch) {
    return {sketch, sketches};
  }
 
  throw error(404, 'Not found');
}