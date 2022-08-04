import { GIST } from '../config.js';
import { consoleElement } from '../main.js';
import { editor } from '../main.js';
import { run, State, printErrors, API } from './utils.js';

export const execute = async CONSOLE => {
  consoleElement.classList.remove('error_line');
  consoleElement.classList.add('info_line');
  const selectedConsoleLine = CONSOLE.value.trim();
  const [CMD, ...PARAMS] = selectedConsoleLine.split(' ');
  switch (CMD?.trim()?.toUpperCase()) {
    case 'EMPTY':
      editor.setValue('');
      consoleElement.value = '';
      break;
    case 'RUN':
      run();
      consoleElement.value = '';
      break;

    case 'ABOUT':
      consoleElement.value = ``;

      break;
    case 'EXAMPLE':
      editor.setValue(``);
      break;
    case 'STASH':
      consoleElement.value = '';
      PARAMS[0] = PARAMS[0]?.toUpperCase();
      if (PARAMS[0] === 'PUSH') {
        localStorage.setItem(
          PARAMS[1] ? 'stash-' + PARAMS[1] : 'stash-main',
          editor.getValue()
        );
      }
      if (PARAMS[0] === 'POP') {
        editor.setValue(
          localStorage.getItem(PARAMS[1] ? 'stash-' + PARAMS[1] : 'stash-main')
        );
      }
      if (PARAMS[0] === 'CLEAR') {
        localStorage.removeItem(
          PARAMS[1] ? 'stash-' + PARAMS[1] : 'stash-main'
        );
      }
      break;

    // case 'DOWNLOAD':
    //   {
    //     const filename = PARAMS[0];
    //     const a = document.createElement('a');
    //     a.href = ``;
    //     a.setAttribute('download', filename);
    //     a.click();
    //     consoleElement.value = '';
    //   }
    //   break;

    case 'LINK':
      consoleElement.value = `${API}/${APP}/?gist=${PARAMS[0].split(GIST)[1]}`;
      break;
    // case 'APP':
    //   window.open().document.write(await execute({ value: '_COMPILE' }));
    //break;
    case 'HELP':
      editor.setValue(` HELP: list these commands
 EMPTY: clears the editor content
 SAVE: create a file
 RUN: run script locally 

`);
      consoleElement.value = '';

      break;
    default:
      if (CMD.trim()) printErrors(CMD + ' does not exist!');
      else consoleElement.value = '';
      break;
  }
};
