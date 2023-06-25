const { Pool } = require('pg')
 
class PlaylistService {
  constructor() {
    this._pool = new Pool()
  }

  async getPlaylistById (id) {
    const query = {
      text: `SELECT playlists.id, playlists.name 
              FROM playlists
              WHERE playlists.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    return result.rows[0]
  }

  async getSongsOnPlaylist (id) {
    const playlist = await this.getPlaylistById(id)

    if (!playlist){
      return []
    }
    
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
              FROM playlist_songs
              LEFT JOIN songs on songs.id = playlist_songs.song_id
              WHERE playlist_id = $1`,
      values: [id]
    }
    const songs = await this._pool.query(query)
    playlist.songs = songs.rows
    return playlist
  }
}

module.exports = PlaylistService
