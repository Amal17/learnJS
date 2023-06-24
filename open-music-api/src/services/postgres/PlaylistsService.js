const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const AuthorizationError = require('../../exceptions/AuthorizationError')

class PlaylistsService {
  constructor (collaborationService) {
    this._pool = new Pool()
    this._collaborationService = collaborationService
  }

  async addPlaylist (userId, { name }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, userId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }
    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
              LEFT JOIN users ON playlists.owner = users.id
              LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
              WHERE playlists.owner = $1 OR collaborations.user_id = $1
              GROUP BY playlists.id, users.username`,

      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan')
    }
  }

  async addSongToPlaylist (id, { songId }) {
    const idPlaylistSong = `playlistSong-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [idPlaylistSong, id, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan dalam Playlist')
    }

    return result.rows[0].id
  }

  async getPlaylistById (id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
              FROM playlists
              LEFT JOIN users ON users.id = playlists.owner
              WHERE playlists.id = $1`,
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return result.rows[0]
  }

  async getSongsOnPlaylist (id) {
    const playlist = await this.getPlaylistById(id)

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

  async deleteSongFromPlaylist (id, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [id, songId]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus dari Playlist. Id tidak ditemukan')
    }
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    const playlist = result.rows[0]

    if (playlist.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini')
    }
  }

  async verifyPlaylistAccess (id, userId) {
    try {
      await this.verifyPlaylistOwner(id, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationService.verifyCollaborator(id, userId)
      } catch {
        throw error
      }
    }
  }
}

module.exports = PlaylistsService
