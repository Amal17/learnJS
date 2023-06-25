
exports.up = pgm => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(50)',
      primayKey: true
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  pgm.addConstraint('users', 'fk_users.id_primary.id', 'PRIMARY KEY(id)')

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlist.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropTable('playlists')
}
