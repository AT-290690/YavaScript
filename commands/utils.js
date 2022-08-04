import { editor } from '../main.js';
import { consoleElement, alertIcon, errorIcon } from '../main.js';
export const print = function (...values) {
  values.forEach(
    x => (consoleElement.value += `${JSON.stringify(x) ?? undefined}`)
  );
  return values;
};
export const printErrors = errors => {
  consoleElement.classList.remove('info_line');
  consoleElement.classList.add('error_line');
  //consoleElement.style.visibility = 'visible';

  consoleElement.value = errors;
};
const href = window.location.href.split('/').filter(Boolean);
const envi = href.slice(1, 2);
const protocol = envi[0].includes('localhost') ? 'http://' : 'https://';
export const API = protocol + envi.join('/');
export const correctFilePath = filename => {
  if (!filename) return '';
  return '/' + filename.split('/').filter(Boolean).join('/');
};
export const State = {
  list: {},
  selectedRealm: 'realm0',
  lsHistory: '/',
  lastVisitedDir: '/',
  env: null,
  components: {},
  lastSelection: '',
  AST: {},
  activeWindow: null,
  comments: null,
  lastComposition: null,
  isLogged: false,
  isErrored: true,
  isAtTheBottom: true,
  gap: 15,
  height: window.innerHeight - 62,
  stash: { liveSession: '' }
};

export const droneIntel = icon => {
  icon.style.visibility = 'visible';
  setTimeout(() => {
    icon.style.visibility = 'hidden';
  }, 500);
};

export const exe = (source, params) => {
  try {
    const result = new Function(`${params.topLevel};${source}`)();
    droneIntel(alertIcon);
    return result;
  } catch (err) {
    droneIntel(errorIcon);
    canvasContainer.style.background = 'var(--background-primary)';
    consoleElement.classList.remove('info_line');
    consoleElement.classList.add('error_line');
    consoleElement.value = consoleElement.value.trim() || err + ' ';
  }
};
// const preprocess = source =>
//   source

export const run = () => {
  consoleElement.classList.add('info_line');
  consoleElement.classList.remove('error_line');
  consoleElement.value = '';
  const source = editor.getValue();
  const out = exe(source.trim(), { topLevel: State.topLevel });
  if (out !== undefined) print(out);
  return source;
};
