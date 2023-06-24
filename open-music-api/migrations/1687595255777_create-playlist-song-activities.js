exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    time: {
      type: 'VARCHAR(255)',
      notNull: true
    }
  })

  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('playlist_song_activities')
}
