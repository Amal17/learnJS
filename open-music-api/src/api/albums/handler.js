const autoBind = require('auto-bind')

class AlbumsHandler {
  constructor (service, validator, storageService, userAlbumLikesService) {
    this._service = service
    this._validator = validator
    this._storageService = storageService
    this._userAlbumLikesService = userAlbumLikesService

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const albumId = await this._service.addAlbum(request.payload)
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId
      }
    })
    response.code(201)
    return response
  }

  async getAlbumsHandler () {
    const albums = await this._service.getAlbums()
    return {
      status: 'success',
      data: {
        albums
      }
    }
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params

    const album = await this._service.getAlbumById(id)

    return {
      status: 'success',
      data: {
        album
      }
    }
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._service.editAlbumById(id, request.payload)
    return {
      status: 'success',
      message: 'Album berhasil diperbarui'
    }
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)
    return {
      status: 'success',
      message: 'Album berhasil dihapus'
    }
  }

  async postUploadCoverHandler (request, h) {
    const { cover } = request.payload
    const { albumId } = request.params

    this._validator.validateImageHeaders(cover.hapi.headers)

    const filename = await this._storageService.writeFile(cover, cover.hapi)
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`

    await this._service.editCoverAlbumById(albumId, fileLocation)

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah'
    })

    response.code(201)
    return response
  }

  async postAlbumLikesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.getAlbumById(id)
    await this._userAlbumLikesService.addLikes(credentialId, id)

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album'
    })

    response.code(201)
    return response
  }

  async deleteAlbumLikesHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.getAlbumById(id)
    await this._userAlbumLikesService.deleteLikes(credentialId, id)

    return {
      status: 'success',
      message: 'Berhasil batal menyukai album'
    }
  }

  async getAlbumLikesHandler (request) {
    const { id } = request.params

    await this._service.getAlbumById(id)
    const likes = await this._userAlbumLikesService.getAlbumLikes(id)

    return {
      status: 'success',
      data: {
        likes
      }
    }
  }
}

module.exports = AlbumsHandler
