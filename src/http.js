const http = require('http')
const console = require('./logger.js')

const receiveArgs = async (req) => {
  const buffers = []
  for await (const chunk of req) buffers.push(chunk)
  const data = Buffer.concat(buffers).toString()
  return JSON.parse(data)
}

module.exports = (routing, port) => {
  http
    .createServer(async (req, res) => {
      const { url, socket } = req
      const [name, method, id] = url.slice(1).split('/')
      const entity = routing[name]
      if (!entity) return res.end('Entity not found')
      const handler = entity[method]
      if (!handler) return res.end('Handler not found')
      const src = handler.toString()
      const signature = src.slice(0, src.indexOf(')'))
      const args = []
      if (signature.includes('(id')) args.push(id)
      if (signature.includes('{')) args.push(await receiveArgs(req))
      console.log(`${socket.remoteAddress}: ${method} ${url}`)
      const result = await handler(...args)
      res.end(JSON.stringify(result.rows))
    })
    .listen(port)

  console.log(`Server listening on port ${port}`)
}
