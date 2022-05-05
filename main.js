const db = require('./src/db.js')
const server = require('./src/ws.js')
const staticServer = require('./src/static.js')

const routing = {
  user: require('./src/user.js'),
  country: db('country'),
  city: db('city'),
}

staticServer('./static', 8000)
server(routing, 8001)
