const routes = [].concat(
  require('../routes/public'),
  require('../routes/pdf'),
  require('../routes/clear-session')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
