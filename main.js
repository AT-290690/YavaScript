import { CodeMirror } from './libs/editor/editor.bundle.js';
import { execute } from './commands/exec.js';
import {
  extractTopLevel,
  playSound,
  printErrors,
  run,
  State
} from './commands/utils.js';
import { GIST } from './config.js';
export const consoleElement = document.getElementById('console');
export const editorContainer = document.getElementById('editor-container');
export const mainContainer = document.getElementById('main-container');
export const headerContainer = document.getElementById('header');
export const focusButton = document.getElementById('focus-button');
export const keyButton = document.getElementById('key');
export const appButton = document.getElementById('app-button');
export const fullRunButton = document.getElementById('full-run');
export const alertIcon = document.getElementById('alert-drone-icon');
export const errorIcon = document.getElementById('error-drone-icon');
export const sparkleIcon = document.getElementById('sparkle-drone-icon');
export const keyIcon = document.getElementById('key-drone-icon');
export const questionIcon = document.getElementById('question-drone-icon');
export const xIcon = document.getElementById('x-drone-icon');
export const sparkleButton = document.getElementById('sparkle');
export const debugButt = document.getElementById('debug-button');

export const compositionContainer = document.getElementById(
  'composition-container'
);
export const editorResizerElement = document.getElementById('editor-resizer');
export const consoleResizerElement = document.getElementById('console-resizer');
debugButt.addEventListener('click', () =>
  !State.settings.lint
    ? execute({ value: 'LINT ON' })
    : execute({ value: 'LINT OFF' })
);
fullRunButton.addEventListener('click', () => run());
appButton.addEventListener('click', () => {
  execute({ value: 'LINK ' + consoleElement.value });
  playSound(6);
});
sparkleButton.addEventListener('click', () => {
  execute({ value: 'PRETTY' });
});
keyButton.addEventListener('click', () => execute({ value: 'LIST' }));
export const editor = CodeMirror(editorContainer, {});

editorContainer.addEventListener(
  'click',
  () => (State.activeWindow = editorContainer)
);

document.addEventListener('keydown', e => {
  const activeElement = document.activeElement;
  if (e.key && e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event;
    e.preventDefault();
    e.stopPropagation();
    // (localStorage.getItem('imports') ?? '')
    run();
  } else if (e.key === 'Enter') {
    if (activeElement === consoleElement) {
      execute(consoleElement);
    }
  }
});

State.activeWindow = editorContainer;
editor.focus();

window.addEventListener('resize', () => {
  editor.setSize(
    document.body.getBoundingClientRect().width,
    document.body.getBoundingClientRect().height - 70
  );
});
editor.setSize(
  document.body.getBoundingClientRect().width,
  document.body.getBoundingClientRect().height - 70
);
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('g')) {
  fetch(`${GIST}${urlParams.get('g')}`)
    .then(buffer => {
      if (buffer.status >= 400)
        return printErrors('Request failed with status ' + buffer.status);
      return buffer.text();
    })
    .then(gist => {
      const topLevel = extractTopLevel(gist, 'vanish');
      State.topLevel = topLevel.length ? topLevel + '\n' : '';
      editor.setValue(
        (State.source = topLevel.length
          ? gist.replace(`//<vanish>${topLevel}</vanish>`, '').trimStart()
          : gist)
      );
    })
    .then(() => (urlParams.has('r') ? run() : null))
    .catch(err => printErrors(err));
}
