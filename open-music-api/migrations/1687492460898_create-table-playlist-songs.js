
exports.up = pgm => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primayKey: true
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true
    }
  })

  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.id_primary.id', 'PRIMARY KEY(id)')

  pgm.addConstraint('playlists', 'fk_playlists.id_primary.id', 'PRIMARY KEY(id)')
  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlist_songs', 'fk_playlist_song.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE')
  pgm.addConstraint('playlist_songs', 'fk_playlist_song.song.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE')
}

exports.down = pgm => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_song.playlist.id')
  pgm.dropConstraint('playlist_songs', 'fk_playlist_song.song.id')

  pgm.dropTable('playlist_songs')
}
