const AlbumsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    storageService,
    userAlbumLikesService
  }) => {
    const albumsHandler = new AlbumsHandler(
      service,
      validator,
      storageService,
      userAlbumLikesService
    )
    server.route(routes(albumsHandler))
  }
}
