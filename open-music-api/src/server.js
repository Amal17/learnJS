require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')
const path = require('path')

// Albums
const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')

// Songs
const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')

// Users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// Authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// Playlists
const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')
const PlaylistActivitiesService = require('./services/postgres/PlaylistActivitiesService')

// Collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// Export
const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducesService')
const ExportsValidator = require('./validator/exports')

// Uplaod
const StorageService = require('./services/storage/StorageServices')

// Album Likes
const UserAlbumLikesService = require('./services/postgres/UserAlbumLikesService')

// Redis chacing
const CacheService = require('./services/redis/CacheService')

// Error
const ClientError = require('./exceptions/ClientError')

const init = async () => {
  const cacheService = new CacheService()
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService()
  const playlistActivitiesService = new PlaylistActivitiesService()
  const playlistsService = new PlaylistsService(collaborationsService, playlistActivitiesService)
  const storageService = new StorageService(path.resolve(__dirname, 'api/albums/file/images'))
  const userAlbumLikesService = new UserAlbumLikesService(cacheService)

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    debug: {
      request: ['error']
    },
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request
    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })
        newResponse.code(response.statusCode)
        return newResponse
      }
      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue
      }
      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami'
      })
      newResponse.code(500)
      return newResponse
    }
    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue
  })

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt
    },
    {
      plugin: Inert
    }
  ])

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

  await server.register([{
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
      storageService,
      userAlbumLikesService
    }
  }, {
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator
    }
  }, {
    plugin: users,
    options: {
      service: usersService,
      validator: UsersValidator
    }
  }, {
    plugin: authentications,
    options: {
      authenticationsService,
      usersService,
      tokenManager: TokenManager,
      validator: AuthenticationsValidator
    }
  }, {
    plugin: playlists,
    options: {
      service: playlistsService,
      validator: PlaylistsValidator,
      songsService,
      playlistActivitiesService
    }
  }, {
    plugin: collaborations,
    options: {
      service: playlistsService,
      validator: CollaborationsValidator,
      usersService
    }
  }, {
    plugin: _exports,
    options: {
      service: ProducerService,
      validator: ExportsValidator,
      playlistsService
    }
  }
  ])

  await server.start()

  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
