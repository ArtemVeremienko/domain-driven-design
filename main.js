const http = require('http')
const receiveArgs = require('./body.js')
const db = require('./db.js')

const PORT = 8000

const routing = {
  user: require('./user.js'),
  country: db('country'),
  city: db('city'),
}

const crud = { get: 'read', post: 'create', put: 'update', delete: 'delete' }

http
  .createServer(async (req, res) => {
    const { method, url, socket } = req
    const [name, id] = url.slice(1).split('/')
    const entity = routing[name]
    if (!entity) return res.end('Not found')
    const procedure = crud[method.toLocaleLowerCase()]
    const handler = entity[procedure]
    if (!handler) return res.end('Not found')
    const src = handler.toString()
    const signature = src.slice(0, src.indexOf(')'))
    const args = []
    if (signature.includes('(id')) args.push(id)
    if (signature.includes('{')) args.push(await receiveArgs(req))
    console.log(`${socket.remoteAddress}: ${method} ${url}`)
    const result = await handler(...args)
    res.end(JSON.stringify(result.rows))
  })
  .listen(PORT)

console.log(`Server listening on port ${PORT}`)
