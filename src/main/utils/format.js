import { app } from 'electron'
import fs from 'fs'
import path from 'path'

export function getUniquePath(file) {
  let count = 1
  const baseFolder = path.dirname(file)
  const basename = path.basename(file, path.extname(file))
  while (fs.existsSync(file)) {
    file = path.join(
      baseFolder,
      basename + ' (' + count + ')',
      path.extname(file)
    )
    count++
  }
  return file
}

export function getExecPath() {
  const exePath = getUsableInstance(app, 'app').getPath('exe')
  let execPath
  if (process.env.NODE_ENV === 'development') {
    execPath = exePath.substr(0, exePath.indexOf('node_modules'))
  } else {
    execPath = path.dirname(exePath)
  }
  return execPath
}

function getUsableInstance(arg, argName) {
  return process.type === 'renderer' ? remote[argName] : arg
}
