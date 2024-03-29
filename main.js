const fsp = require('fs').promises
const path = require('path')

const server = require('./src/ws.js')
const staticServer = require('./src/static.js')
const db = require('./src/db.js')
const hash = require('./src/hash.js')
const load = require('./src/load.js')
const logger = require('./src/logger.js')

const sandbox = {
  console: Object.freeze(logger),
  db: Object.freeze(db),
  common: { hash },
}

const apiPath = path.join(process.cwd(), './api')
const routing = {}

;(async () => {
  const files = await fsp.readdir(apiPath)
  for (const fileName of files) {
    if (!fileName.endsWith('.js')) continue
    const filePath = path.join(apiPath, fileName)
    const serviceName = path.basename(fileName, '.js')
    routing[serviceName] = await load(filePath, sandbox)
  }

  staticServer('./static', 8000)
  server(routing, 8001)
})()
