const autoBind = require('auto-bind')

class PlaylistsHandler {
  constructor (service, validator, songsService) {
    this._service = service
    this._validator = validator

    this._songsService = songsService

    autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePostPlaylistsPayloadSchema(request.payload)
    const { id: userId } = request.auth.credentials

    const playlistId = await this._service.addPlaylist(userId, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId
      }
    })
    response.code(201)
    return response
  }

  async getPlaylistsHandler (request) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._service.getPlaylists(credentialId)
    return {
      status: 'success',
      data: {
        playlists
      }
    }
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deletePlaylistById(id)
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus'
    }
  }

  async postSongToPlaylistHandler (request, h) {
    this._validator.validatePostSongToPlaylistPayloadSchema(request.payload)

    const { songId } = request.payload
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._songsService.getSongById(songId)
    await this._service.verifyPlaylistOwner(id, credentialId)

    const idPlaylistSong = await this._service.addSongToPlaylist(id, request.payload)
    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlists',
      data: {
        idPlaylistSong
      }
    })
    response.code(201)
    return response
  }

  async getSongsOnPlaylistHandler (request) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.verifyPlaylistOwner(id, credentialId)
    const playlist = await this._service.getSongsOnPlaylist(id)

    return {
      status: 'success',
      data: {
        playlist
      }
    }
  }

  async deleteSongFromPlaylistHandler (request) {
    this._validator.validateDeleteSongFromPlaylistPayloadSchema(request.payload)

    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    const { songId } = request.payload

    await this._service.verifyPlaylistOwner(id, credentialId)
    await this._service.deleteSongFromPlaylist(id, songId)

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari Playlist'
    }
  }
}

module.exports = PlaylistsHandler
