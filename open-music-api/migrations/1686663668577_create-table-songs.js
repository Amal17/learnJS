exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    year: {
      type: 'VARCHAR(4)',
      notNull: true
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
      default: null
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      default: null
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
  pgm.dropTable('songs')
}
