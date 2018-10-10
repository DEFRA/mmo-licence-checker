module.exports = {
  method: 'GET',
  path: '/clear-session',
  options: {
    handler: (request, h) => {
      request.yar.set('data', {})
      return h.redirect('/')
    }
  }
}
