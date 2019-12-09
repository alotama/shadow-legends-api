const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const compression = require('compression')

const mongoUrl = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017/mongoose';
const PORT = process.env.PORT || 5000

module.exports = function () {
  let server = express();
  let create;
  let start;

  create = () => {
    let routes = require('../routes');
    // set all the server things
    server.set('port', PORT);

    // add middleware to parse the json
    server.use(bodyParser.json());
    server.use(compression())

    //connect the database
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    var db = mongoose.connection;

    !db ? console.log("Error connecting db") : console.log("Db connected successfully");
    
    // Set up routes
    routes.init(server);
  };


  start = () => {
    let port = server.get('port');

    server.listen(port, function () {
      console.log('Express server listening on - http://localhost' + ':' + port);
    });
  };
  
  return {
    create: create,
    start: start
  };
};