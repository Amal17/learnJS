exports.up = (pgm) => {
  // membuat table collaborations
  pgm.createTable('collaborations', {
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
    }
  })

  /*
        Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan user_id.
        Guna menghindari duplikasi data antara nilai keduanya.
      */
  pgm.addConstraint('collaborations', 'unique_playlist_id_and_user_id', 'UNIQUE(playlist_id, user_id)')

  // add constraint unique for playlist_songs to avoid duplicate
  pgm.addConstraint('playlist_songs', 'unique_playlist_songs_id_and_user_id', 'UNIQUE(playlist_id, song_id)')

  // memberikan constraint foreign key pada kolom playlist_id dan user_id terhadap notes.id dan users.id
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('collaborations', 'fk_collaborations.users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = (pgm) => {
  // menghapus tabel collaborations
  pgm.dropTable('collaborations')
}
