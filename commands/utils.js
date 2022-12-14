import {
  droneButton,
  editor,
  formatterIcon,
  consoleElement,
  // alertIcon,
  errorIcon,
  popupContainer,
  consoleEditor,
  canvasContainer,
} from '../main.js'
export const print = function (...values) {
  values.forEach(
    (x) => (consoleElement.value += `${JSON.stringify(x) ?? undefined}`)
  )
  return values
}

export const createCanvas = () => {
  canvasContainer.innerHTML = ''
  canvasContainer.style.display = 'block'
  const canvas = document.createElement('canvas')
  canvasContainer.appendChild(canvas)
  return canvas
}
export const printErrors = (errors) => {
  consoleElement.classList.remove('info_line')
  consoleElement.classList.add('error_line')
  consoleElement.value = errors
}

export const correctFilePath = (filename) => {
  if (!filename) return ''
  return '/' + filename.split('/').filter(Boolean).join('/')
}
export const State = {
  sounds: [],
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
      indent_empty_lines: false,
    },
  },
}

export const extractTopLevel = (source, tag) => {
  const regex = new RegExp(`\\<${tag}\\>([\\s\\S]+?)\\<\\/${tag}>`, 'g')
  let result = [],
    matches
  while ((matches = regex.exec(source))) result.push(matches[1])
  return result
}

export const droneIntel = (icon) => {
  icon.style.visibility = 'visible'
  setTimeout(() => (icon.style.visibility = 'hidden'), 500)
}

export const playSound = (index) => {
  if (!State.mute) {
    if (!State.sounds.length) {
      for (let i = 0; i < 7; i++) {
        const sound = new Audio(`./assets/sounds/sound${i}.wav`)
        sound.volume = sound.volume * 0.1
        State.sounds.push(sound)
      }
    }
    State.sounds.forEach((sound, i) => {
      if (i === index) sound.currentTime = 0
      else {
        sound.pause()
        sound.currentTime = 0
      }
    })
    State.sounds[index].play()
  }
}
const AsyncFunction = async function () {}.constructor
export const exe = async (source, params) => {
  try {
    const result = await new AsyncFunction(`${params.topLevel};${source}`)()
    droneButton.classList.remove('shake')
    droneIntel(formatterIcon)
    playSound(6)
    return result
  } catch (err) {
    consoleElement.classList.remove('info_line')
    consoleElement.classList.add('error_line')
    consoleElement.value = consoleElement.value.trim() || err + ' '
    droneButton.classList.remove('shake')
    droneButton.classList.add('shake')
    droneIntel(errorIcon)
    playSound(0)
  }
}
globalThis._logger = (disable = 0) => {
  if (disable) return (msg, count) => {}
  popupContainer.style.display = 'block'
  const popup = consoleEditor
  popup.setValue('')
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  popup.setSize(width - 2, height / 3)
  // let count = 0
  return (msg, comment = '', space) => {
    const current = popup.getValue()
    popup.setValue(
      `${current ? current + '\n' : ''}// ${comment}
${msg !== undefined ? JSON.stringify(msg, null, space) : undefined}`
    )
    popup.setCursor(
      popup.posToOffset({ ch: 0, line: popup.lineCount() - 1 }),
      true
    )
    return msg
  }
}
globalThis._print = (disable = 0) => {
  if (disable) return () => {}
  popupContainer.style.display = 'block'
  const popup = consoleEditor
  popup.setValue('')
  const bouds = document.body.getBoundingClientRect()
  const width = bouds.width
  const height = bouds.height
  popup.setSize(width - 2, height / 3)
  return (msg) => {
    const current = popup.getValue()
    popup.setValue(
      `${current ? current + '\n' : ''}${msg
        .toString()
        .replace('"', '')
        .replace("'", '')
        .trim()}`
    )
    popup.setCursor(
      popup.posToOffset({ ch: 0, line: popup.lineCount() - 1 }),
      true
    )
    return msg
  }
}
globalThis._canvas = (w, h) => {
  const canvas = createCanvas()
  if (!(w ?? h)) {
    const bounds = document.body.getBoundingClientRect()
    canvas.width = (w ?? bounds.width) / 2
    canvas.height = (h ?? bounds.height) - 65
  }
  return canvas
}
export const run = async () => {
  consoleElement.classList.add('info_line')
  consoleElement.classList.remove('error_line')
  consoleElement.value = ''
  popupContainer.style.display = 'none'
  const source = (State.source = editor.getValue())
  const out = await exe(source.trim(), { topLevel: State.topLevel })
  if (out !== undefined) print(out)
  return source
}
