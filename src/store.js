import { writable } from 'svelte/store'

export const section = writable(0)
export const isPortrait = writable(window.innerWidth < 1000);
export const bgColor = writable("");

export const textColor1 = writable("");
export const textColor2 = writable("");
export const textColor3 = writable("");
export const textColor4 = writable("");
export const white = writable("");