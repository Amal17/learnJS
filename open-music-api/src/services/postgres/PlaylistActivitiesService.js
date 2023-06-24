const { nanoid } = require('nanoid')
const { Pool } = require('pg')

class PlaylistActivitiesService {
  constructor () {
    this._pool = new Pool()
  }

  async addActivities ({ songId, playlistId, userId, action }) {
    const id = `activities-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, songId, playlistId, userId, action, time]
    }

    const result = await this._pool.query(query)

    return result.rows[0].id
  }

  async getActivities (id) {
    const query = {
      text: `SELECT users.username, songs.title, action, time 
              FROM playlist_song_activities 
              JOIN users ON users.id = user_id
              JOIN songs ON songs.id = song_id
              WHERE playlist_id = $1`,

      values: [id]
    }

    const result = await this._pool.query(query)
    return result.rows
  }
}

module.exports = PlaylistActivitiesService
