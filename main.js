import { CodeMirror } from './libs/editor/editor.bundle.js'
import { execute } from './commands/exec.js'
import { playSound, run, State } from './commands/utils.js'
export const consoleElement = document.getElementById('console')
export const editorContainer = document.getElementById('editor-container')
export const mainContainer = document.getElementById('main-container')
export const headerContainer = document.getElementById('header')
export const focusButton = document.getElementById('focus-button')
export const keyButton = document.getElementById('key')
export const appButton = document.getElementById('gist-link')
export const droneButton = document.getElementById('drone')
// export const alertIcon = document.getElementById('alert-drone-icon')
export const errorIcon = document.getElementById('error-drone-icon')
export const formatterIcon = document.getElementById('formatter-drone-icon')
export const keyIcon = document.getElementById('key-drone-icon')
// export const questionIcon = document.getElementById('question-drone-icon')
export const xIcon = document.getElementById('x-drone-icon')
export const formatterButton = document.getElementById('formatter')
export const debugButt = document.getElementById('debug-button')
export const popupContainer = document.getElementById('popup-container')
export const canvasContainer = document.getElementById('canvas-container')

export const compositionContainer = document.getElementById(
  'composition-container'
)
export const editorResizerElement = document.getElementById('editor-resizer')
export const consoleResizerElement = document.getElementById('console-resizer')

export const consoleEditor = CodeMirror(popupContainer)

debugButt.addEventListener(
  'click',
  () => execute({ value: '_LOG' })
  // !State.settings.lint
  //   ? execute({ value: 'LINT ON' })
  //   : execute({ value: 'LINT OFF' })
)
droneButton.addEventListener('click', () => run())
appButton.addEventListener('click', () => {
  execute({ value: 'LINK ' + consoleElement.value })
  playSound(1)
})
formatterButton.addEventListener('click', () => {
  execute({ value: 'PRETTY' })
})
keyButton.addEventListener('click', () => execute({ value: 'LIST' }))
export const editor = CodeMirror(editorContainer, {})
editorContainer.addEventListener(
  'click',
  () => (State.activeWindow = editorContainer)
)
document.addEventListener('keydown', (e) => {
  const activeElement = document.activeElement
  if (e.key && e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
    e = e || window.event
    e.preventDefault()
    e.stopPropagation()
    popupContainer.style.display = 'none'
    run()
  } else if (e.key === 'Enter') {
    if (activeElement === consoleElement) {
      execute(consoleElement)
    }
  } else if (e.key === 'Escape') {
    e.preventDefault()
    e.stopPropagation()
    popupContainer.style.display = 'none'
    canvasContainer.style.display = 'none'
  }
})
State.activeWindow = editorContainer
editor.focus()
window.addEventListener('resize', () => {
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  editor.setSize(width - 10, height - 60)
  // editor.setSize(width, height - 70)
  if (popupContainer.style.display === 'block') {
    consoleEditor.setSize(width - 2, height / 3)
  }
  if (canvasContainer.style.display === 'block') {
    canvasContainer.style.display = 'none'
  }
})
const bounds = document.body.getBoundingClientRect()
editor.setSize(bounds.width - 10, bounds.height - 60)
consoleElement.setAttribute('placeholder', 'enter HELP')
