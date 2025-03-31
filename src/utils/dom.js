// From https://stackoverflow.com/questions/64959908/svelte-component-onload
export const createLoadObserver = handler => {
  const onload = el => {
    el.addEventListener('load', () => {
      handler(el);
    })
  }
  return onload
}
