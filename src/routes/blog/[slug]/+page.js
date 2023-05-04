import { error } from '@sveltejs/kit';
 
/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  if (params.slug === 'forest-for-the-trees') {
    return {
      title: 'forest-for-the-trees!',
      content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
    };
  } else if (params.slug === 'chat-got-puns') {
    return {
        title: 'chat-got-puns!',
        content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
      };
  } else if (params.slug === 'orbital-tensors-false-inventions') {
    return {
        title: 'orbital-tensors-false-inventions!',
        content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
      };
  } else if (params.slug === 'scrollytelling-maplibre') {
    return {
        title: 'scrollytelling-maplibre',
        content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
      };
  }
 
  throw error(404, 'Not found');
}