const pg = require('pg')

const pool = new pg.Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'example',
  user: 'user',
  password: 'password',
})

module.exports = (table) => ({
  async query(sql, args) {
    return pool.query(sql, args)
  },
  async read(id, fields = ['*']) {
    const names = fields.join(', ')
    const sql = `SELECT ${names} FROM ${table}`
    if (!id) return pool.query(sql)
    return pool.query(`${sql} WHERE id = $1`, [id])
  },
  async create({ ...record }) {
    const keys = Object.keys(record)
    const nums = []
    const data = []
    keys.forEach((key, i) => {
      data.push(record[key])
      nums.push(`$${i + 1}`)
    })
    const fields = `"${keys.join('", "')}"`
    const params = nums.join(', ')
    const sql = `INSERT INTO "${table}" (${fields}) VALUES (${params})`
    return pool.query(sql, data)
  },
  async update(id, { ...record }) {
    const keys = Object.keys(record)
    const updates = new Array(keys.length)
    const data = new Array(keys.length)
    let i = 0
    for (const key of keys) {
      data[i] = record[key]
      updates[i] = `${key} = $${++i}`
    }
    data.push(id)
    const delta = updates.join(', ')
    const sql = `UPDATE "${table}" SET ${delta} WHERE id = $${++i}`
    return pool.query(sql, data)
  },
  async delete(id) {
    const sql = `DELETE FROM "${table}" WHERE id = $1`
    return pool.query(sql, [id])
  },
})
