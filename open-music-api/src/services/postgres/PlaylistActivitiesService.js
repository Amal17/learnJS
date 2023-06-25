const { nanoid } = require('nanoid')
const { Pool } = require('pg')

class PlaylistActivitiesService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addActivities ({ songId, playlistId, userId, action }) {
    const id = `activities-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, songId, playlistId, userId, action, time]
    }

    const result = await this._pool.query(query)

    await this._cacheService.delete(`activities:${playlistId}`)

    return result.rows[0].id
  }

  async getActivities (id) {
    try {
      const result = await this._cacheService.get(`activities:${id}`)
      const response = JSON.parse(result)
      return { fromCache: true, response }
    } catch (error) {
      const query = {
        text: `SELECT users.username, songs.title, action, time 
                FROM playlist_song_activities 
                JOIN users ON users.id = user_id
                JOIN songs ON songs.id = song_id
                WHERE playlist_id = $1`,

        values: [id]
      }

      const result = await this._pool.query(query)

      const response = result.rows
      await this._cacheService.set(`activities:${id}`, JSON.stringify(response))

      return { fromCache: false, response }
    }
  }
}

module.exports = PlaylistActivitiesService
