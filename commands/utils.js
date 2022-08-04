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

export const correctFilePath = filename => {
  if (!filename) return '';
  return '/' + filename.split('/').filter(Boolean).join('/');
};

export const State = {
  activeWindow: null,
  isErrored: true,
  mute: !!localStorage.getItem('mute')
};

export const droneIntel = icon => {
  icon.style.visibility = 'visible';
  setTimeout(() => {
    icon.style.visibility = 'hidden';
  }, 500);
};
const sounds = [];
for (const sound of document.getElementsByTagName('audio')) {
  sound.volume = sound.volume * 0.1;
  sounds.push(sound);
}
export const playSound = index => {
  if (!State.mute) {
    sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    sounds[index].play();
  }
};
export const exe = (source, params) => {
  try {
    const result = new Function(`${params.topLevel};${source}`)();
    droneIntel(alertIcon);
    playSound(1);
    return result;
  } catch (err) {
    droneIntel(errorIcon);
    consoleElement.classList.remove('info_line');
    consoleElement.classList.add('error_line');
    consoleElement.value = consoleElement.value.trim() || err + ' ';
    playSound(0);
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
