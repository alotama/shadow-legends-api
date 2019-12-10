const graphqlHTTP = require('express-graphql')
const schemas = require('../schemas/championSchema')
const cors = require('cors')
const root = require('../services')

const corsOptions = {
  "origin": process.env.WHITELIST,
  "methods": "GET",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

const init = (server) => {
  server.use('/graphql', cors(corsOptions), graphqlHTTP({
    schema: schemas,
    rootValue: root,
    graphiql: true
  }))
}

module.exports = {
    init: init
};