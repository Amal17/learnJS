const routes = require('./routes')
const CollaborationsHandler = require('./handler')

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, {
    service,
    validator,
    usersService
  }) => {
    const collaborationsHandler = new CollaborationsHandler(
      service,
      validator,
      usersService
    )
    server.route(routes(collaborationsHandler))
  }
}
