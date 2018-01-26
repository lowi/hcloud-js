const snakeCase = require('snake-case')
const Action = require('../../actions/action')
const ServerActionList = require('./serverActionList')

class ServerActionsEndpoint {
  constructor (client) {
    this.client = client
  }

  list (id, params) {
    let snakeCaseParams = {}
    if (params) {
      Object.keys(params).forEach(key => {
        snakeCaseParams[snakeCase(key)] = params[key]
      })
    }

    return this.client.axios({
      url: '/servers/' + id + '/actions',
      method: 'GET',
      params: snakeCaseParams
    }).then(response => {
      // Make new Action objects
      let actions = []
      response.data.actions.forEach(action => {
        actions.push(new Action(action))
      })

      // Return a list
      return new ServerActionList(this, id, actions, response.data.meta)
    })
  }

  get (serverId, actionId) {
    return this.client.axios({
      url: '/servers/' + serverId + '/actions/' + actionId,
      method: 'GET'
    }).then(response => {
      // Return new Action instance
      return new Action(response.data.action)
    })
  }

  powerOn (id) {
    return this.client.axios({
      url: '/servers/' + id + '/actions/poweron',
      method: 'POST'
    }).then(response => {
      return new Action(response.data.action)
    })
  }
}

module.exports = ServerActionsEndpoint