const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
const { mapSongToModel } = require('../../utils')

class SongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, genre, performer, duration, albumId }) {
    const id = `song-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getSongs ({ title, performer }) {
    let query

    if (title && performer) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1  AND title ILIKE $2',
        values: ['%' + performer + '%', '%' + title + '%']
      }
    } else if (performer) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE performer ILIKE $1',
        values: ['%' + performer + '%']
      }
    } else if (title) {
      query = {
        text: 'SELECT id, title, performer FROM songs WHERE title ILIKE $1',
        values: ['%' + title + '%']
      }
    } else {
      query = 'SELECT id, title, performer FROM songs'
    }

    const result = await this._pool.query(query)

    return result.rows
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }
    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan')
    }

    return result.rows.map(mapSongToModel)[0]
  }

  async editSongById (id, { title, year, genre, performer, duration, albumId }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id =$6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan')
    }
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = SongsService
