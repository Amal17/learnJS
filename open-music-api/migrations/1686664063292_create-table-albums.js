exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    year: {
      type: 'VARCHAR(4)',
      notNull: true
    },
    created_at: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    updated_at: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('albums')
}
