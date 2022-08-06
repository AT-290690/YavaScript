import { editor, sparkleIcon } from '../main.js';
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
  mute: localStorage.getItem('mute') ? +localStorage.getItem('mute') : 1,
  topLevel: '',
  settings: {
    lint: false,
    beautify: {
      indent_size: '2',
      indent_char: ' ',
      max_preserve_newlines: '-1',
      preserve_newlines: false,
      keep_array_indentation: true,
      break_chained_methods: true,
      indent_scripts: 'keep',
      brace_style: 'none,preserve-inline',
      space_before_conditional: true,
      unescape_strings: false,
      jslint_happy: true,
      end_with_newline: false,
      wrap_line_length: '80',
      indent_inner_html: false,
      comma_first: false,
      e4x: true,
      indent_empty_lines: false
    }
  }
};

export const extractTopLevel = (source, tag) => {
  const regex = new RegExp(`\\<${tag}\\>([\\s\\S]+?)\\<\\/${tag}>`, 'g');
  let result = [],
    matches;
  while ((matches = regex.exec(source))) {
    result.push(matches[1]);
  }
  return result;
};

export const debug = () => {
  if (!State.settings.lint) {
    editor.switchInstance({
      lint: true,
      doc: editor.getValue(),
      callback: () => {
        setTimeout(() => {
          State.settings.lint = true;
          debug();
          droneIntel(sparkleIcon);
          playSound(3);
        }, 2000);
      }
    });
  }
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
    setTimeout(() => sounds[index].play());
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
  const source = (State.source = editor.getValue());
  const out = exe(source.trim(), { topLevel: State.topLevel });
  if (out !== undefined) print(out);
  return source;
};
