const {
  PostPlaylistsPayloadSchema,
  PostSongToPlaylistPayloadSchema,
  DeleteSongFromPlaylistPayloadSchema
} = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const PlaylistsValidator = {
  validatePostPlaylistsPayloadSchema: (payload) => {
    const validationResult = PostPlaylistsPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validatePostSongToPlaylistPayloadSchema: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
  validateDeleteSongFromPlaylistPayloadSchema: (payload) => {
    const validationResult = DeleteSongFromPlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }

}

module.exports = PlaylistsValidator
