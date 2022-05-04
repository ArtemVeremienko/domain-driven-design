const db = require('./db.js')
const server = require('./http.js')

const PORT = 8000

const routing = {
  user: require('./user.js'),
  country: db('country'),
  city: db('city'),
}

server(routing, PORT)
