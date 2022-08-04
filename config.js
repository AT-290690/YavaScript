const href = window.location.href.split('/').filter(Boolean);
const envi = href.slice(1, 2);
const protocol = envi[0].includes('localhost') ? 'http://' : 'https://';

export const API = protocol + envi.join('/');
export const APP = 'YavaScript';
export const GIST = 'https://gist.githubusercontent.com/';
