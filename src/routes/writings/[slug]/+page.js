import { error } from '@sveltejs/kit';
import { loadJSON } from '../../../utils/file.js'
 
export async function load({ params }) {
  const writings = await loadJSON('/data/writings.json')
  const writing = writings.find(item => item.slug === params.slug);

  if (writing) {
    return writing;
  }
 
  throw error(404, 'Not found');
}