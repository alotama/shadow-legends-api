const graphqlHTTP = require('express-graphql')
const schemas = require('../schemas/championSchema')
const root = require('../services')

const init = (server) => {
  server.use('/graphql', graphqlHTTP({
    schema: schemas,
    rootValue: root,
    graphiql: true
  }))
}

module.exports = {
    init: init
};