import { CodeMirror } from './libs/editor/editor.bundle.js';
import { execute } from './commands/exec.js';
import { printErrors, run, State } from './commands/utils.js';
import { GIST } from './config.js';
export const consoleElement = document.getElementById('console');
export const editorContainer = document.getElementById('editor-container');
export const canvasContainer = document.getElementById('canvas-container');
export const mainContainer = document.getElementById('main-container');
export const headerContainer = document.getElementById('header');
export const focusButton = document.getElementById('focus-button');
export const keyButton = document.getElementById('key');

// export const plotButton = document.getElementById('plot-button');
// export const plotContainer = document.getElementById('plot');
export const appButton = document.getElementById('app-button');
export const fullRunButton = document.getElementById('full-run');
export const alertIcon = document.getElementById('alert');
export const errorIcon = document.getElementById('error');
export const compositionContainer = document.getElementById(
  'composition-container'
);
export const editorResizerElement = document.getElementById('editor-resizer');
export const consoleResizerElement = document.getElementById('console-resizer');

fullRunButton.addEventListener('click', () => run());
appButton.addEventListener('click', () =>
  execute({ value: 'LINK ' + consoleElement.value })
);

keyButton.addEventListener('click', () => {
  const out = [];
  for (let i = 0; i < localStorage.length; ++i) {
    const key = localStorage.key(i);
    if (key.includes('stash-')) out.push(key.split('stash-')[1]);
  }

  editor.setValue(`Stashed code: 
${out.join('\n')}

type STASH LOAD name
to ovewrte STASH SAVE name
`);
});
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
  } else if (
    activeElement === consoleElement &&
    e.altKey &&
    e.key === 'ArrowUp'
  ) {
    editor.focus();
    State.activeWindow = editorContainer;
  } else if (
    State.activeWindow === editorContainer &&
    e.altKey &&
    e.key === 'ArrowDown'
  ) {
    consoleElement.focus();
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

if (urlParams.has('gist')) {
  fetch(`${GIST}${urlParams.get('gist')}`)
    .then(buffer => {
      if (buffer.status >= 400)
        return printErrors('Request failed with status ' + buffer.status);
      return buffer.text();
    })
    .then(gist => editor.setValue(gist))
    .catch(err => printErrors(err));
}
