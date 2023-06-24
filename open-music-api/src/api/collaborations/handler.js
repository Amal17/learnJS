const autoBind = require('auto-bind')

class CollaborationsHandler {
  constructor (service, validator, usersService) {
    this._service = service
    this._validator = validator
    this._collaborationService = service._collaborationService
    this._usersService = usersService

    autoBind(this)
  }

  async postCollaborationHandler (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._service.verifyPlaylistOwner(playlistId, credentialId)
    await this._usersService.getUserById(userId)
    const collaborationId = await this._collaborationService.addCollaboration(playlistId, userId)

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId
      }
    })
    response.code(201)
    return response
  }

  async deleteCollaborationHandler (request) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._service.verifyPlaylistOwner(playlistId, credentialId)
    await this._collaborationService.deleteCollaboration(playlistId, userId)

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus'
    }
  }
}

module.exports = CollaborationsHandler
