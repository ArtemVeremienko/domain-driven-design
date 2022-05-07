const fsp = require('fs').promises
const vm = require('vm')

const RUN_OPTIONS = { timeout: 5000, displayErrors: false }

module.exports = async (filePath, sandbox) => {
  const src = await fsp.readFile(filePath, 'utf8')
  const code = `'use strict';\n${src}`
  const script = new vm.Script(code)
  const context = new vm.createContext(Object.freeze({ ...sandbox }))
  const exported = script.runInContext(context, RUN_OPTIONS)
  console.log({ exported })
  return exported
}
