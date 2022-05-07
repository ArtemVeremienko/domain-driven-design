const country = db('country');

({
  read(id) {
    console.log({ db })
    return country.read(id)
  },
  find(mask) {
    const sql = 'SELECT * FROM country WHERE name LIKE $1'
    return country.query(sql, [mask])
  },
})
