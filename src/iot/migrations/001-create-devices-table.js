export let up = (db, callback) => {
  db.createTable('devices', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: 'string'
  }, callback)
}

export let down = (db, callback) => {
  db.dropTable('devices', callback)
}
