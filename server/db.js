const hoek = require('hoek')

async function getState (request) {
  return Promise.resolve(request.yar.get('data') || {})
}

async function mergeState (request, value) {
  const state = request.yar.get('data') || {}
  hoek.merge(state, value, true, false)
  request.yar.set('data', state)
  return Promise.resolve(state)
}

module.exports = { getState, mergeState }
