const { nanoid } = require('nanoid')
const { Pool } = require('pg')

class PlaylistsActivitiesService {
  constructor () {
    this._pool = new Pool()
  }

  async addActivities ({ playlistId, userId, action }) {
    const id = `activities-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, playlistId, userId, action, time]
    }

    const result = await this._pool.query(query)

    return result.rows[0].id
  }

  async getPlaylists (id) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
              LEFT JOIN users ON playlists.owner = users.id
              LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
              WHERE playlists.owner = $1 OR collaborations.user_id = $1
              GROUP BY playlists.id, users.username`,

      values: [id]
    }

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistsActivitiesService
