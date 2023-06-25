const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/InvariantError')
const ClientError = require('../../exceptions/ClientError')

class UserAlbumLikesService {
  constructor (cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async getId (idUser, idAlbum) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [idUser, idAlbum]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return null
    }
    return result.rows[0].id
  }

  async addLikes (idUser, idAlbum) {
    const idLikes = await this.getId(idUser, idAlbum)

    if (idLikes) {
      throw new ClientError('Anda telah menyukai album ini')
    }

    const id = `albumLikes-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, idUser, idAlbum]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal menyukai albums')
    }

    return result.rows[0].id
  }

  async deleteLikes (idUser, idAlbum) {
    const idLikes = await this.getId(idUser, idAlbum)

    if (!idLikes) {
      throw new ClientError('Anda belum menyukai album ini')
    }

    const query = {
      text: 'DELETE FROM user_album_likes WHERE id = $1 RETURNING id',
      values: [idLikes]
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new InvariantError('Gagal batal menyukai albums')
    }

    return result.rows[0].id
  }

  async getAlbumLikes (idAlbum) {
    try {
      const result = await this._cacheService.get(`albumLikes:${idAlbum}`)
      const total = JSON.parse(result)
      return { fromCache: true, total }
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) AS total FROM user_album_likes WHERE album_id = $1',
        values: [idAlbum]
      }

      const result = await this._pool.query(query)

      const total = parseInt(result.rows[0].total)
      await this._cacheService.set(`albumLikes:${idAlbum}`, JSON.stringify(total))
      return { fromCache: false, total }
    }
  }
}

module.exports = UserAlbumLikesService
