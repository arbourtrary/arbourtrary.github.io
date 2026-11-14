import { resolve } from '$app/paths';

// SvelteKit 3 dropped `base` from $app/paths. This is the same value: the
// site's base path, read when called so relative paths still resolve per
// page during prerendering. Call it while rendering or inside a load/handler.
export const getBase = () => resolve('/').replace(/\/$/, '');
