import { GIST, API, APP } from '../config.js';
import {
  alertIcon,
  consoleElement,
  errorIcon,
  sparkleIcon,
  keyIcon
} from '../main.js';
import { editor } from '../main.js';
import {
  run,
  printErrors,
  playSound,
  State,
  debug,
  droneIntel
} from './utils.js';

export const execute = async CONSOLE => {
  consoleElement.classList.remove('error_line');
  consoleElement.classList.add('info_line');
  const selectedConsoleLine = CONSOLE.value.trim();
  const [CMD, ...PARAMS] = selectedConsoleLine.split(' ');
  switch (CMD?.trim()?.toUpperCase()) {
    case 'EMPTY':
      editor.setValue('');
      consoleElement.value = '';
      playSound(5);
      droneIntel(sparkleIcon);
      break;
    case 'RUN':
      run();
      consoleElement.value = '';
      break;

    case 'ABOUT':
      editor.setValue(`/*
  MIT License

  Copyright (c) 2022 AT-290690
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
      */`);

      break;
    case 'LINT':
      {
        const inp = PARAMS[0]?.toUpperCase();
        if (inp === 'OFF') {
          playSound(5);

          State.settings.lint = false;
          editor.switchInstance({
            lint: false,
            doc: editor.getValue()
          });
        } else if (inp === 'ON') {
          playSound(3);

          debug();
        } else consoleElement.value = 'Provide a lint option on/off';
      }
      break;
    case 'LOAD':
      editor.setValue(
        localStorage.getItem(PARAMS[0] ? 'stash-' + PARAMS[0] : 'stash-main')
      );
      playSound(2);
      droneIntel(keyIcon);
      consoleElement.value = '';
      break;
    case 'SAVE':
      consoleElement.value = '';
      localStorage.setItem(
        PARAMS[0] ? 'stash-' + PARAMS[0] : 'stash-main',
        editor.getValue()
      );
      playSound(6);
      droneIntel(keyIcon);

      break;
    case 'DELETE':
      localStorage.removeItem(PARAMS[0] ? 'stash-' + PARAMS[0] : 'stash-main');
      consoleElement.value = '';
      playSound(5);
      droneIntel(keyIcon);
      break;
    case 'DROP':
      for (let i = 0; i < localStorage.length; ++i) {
        const key = localStorage.key(i);
        if (key.includes('stash-')) localStorage.removeItem(key);
      }
      consoleElement.value = '';
      editor.setValue('');
      droneIntel(keyIcon);
      playSound(5);
      break;
    case 'SOUND':
      switch (PARAMS[0]?.toUpperCase()) {
        case 'ON':
          State.mute = 0;
          localStorage.setItem('mute', 0);
          break;

        case 'OFF':
          State.mute = 1;
          localStorage.setItem('mute', 1);
          break;
      }
      break;
    // case 'TEST':
    //   const topLevel = extractTopLevel(editor.getValue(), 'vanish');
    //   editor.setValue(
    //     editor
    //       .getValue()
    //       .replace(`//<vanish>${(State.topLevel = topLevel)}</vanish>`, '')
    //       .trimStart()
    //   );
    //   break;
    case 'PRETTY':
      editor.setValue(js_beautify(editor.getValue(), State.settings.beautify));
      playSound(4);
      droneIntel(sparkleIcon);
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
      if (
        PARAMS[0] &&
        consoleElement.value !== 'Paste a link from RAW github gist here!'
      ) {
        const gist = PARAMS[0].split(GIST)[1];
        consoleElement.value = gist
          ? `${API}/${APP}/?g=${gist}`
          : 'Invalid Gist Raw Link!';
      } else {
        consoleElement.value = 'Paste a link from RAW github gist here!';
      }
      droneIntel(alertIcon);
      break;
    // case 'APP':
    //   window.open().document.write(await execute({ value: '_COMPILE' }));
    //break;
    case 'HELP':
      editor.setValue(`/* 
 HELP: list these commands
 EMPTY: clears the editor content
 SAVE: save in starage
 LOAD load from storage
 DELETE remove from storage
 DROP drop all storage
 RUN: run code 
 SOUND ON  enable sounds
 SOUND OFF dissable sounds
 LINT ON enable lint
 LINT OFF dissable lint
 PRETTY format code
 ABOUT read license info
*/`);
      playSound(2);
      droneIntel(alertIcon);

      consoleElement.value = '';

      break;
    default:
      if (CMD.trim()) printErrors(CMD + ' does not exist!');
      else consoleElement.value = '';
      droneIntel(errorIcon);
      playSound(0);
      break;
  }
};
