const users = db('users')

;;({
  async read(id) {
    return users.read(id, ['id', 'login'])
  },
  async create({ login, password }) {
    const passwordHash = await common.hash(password)
    return users.create({ login, password: passwordHash })
  },
  async update(id, { login, password }) {
    const passwordHash = await common.hash(password)
    return users.update(id, { login, password: passwordHash })
  },
  async delete(id) {
    return users.delete(id)
  },
  async find(mask) {
    const sql = 'SELECT * FROM users WHERE login LIKE $1'
    return users.query(sql, [mask])
  },
})
