require('dotenv').config()
const mongoUrl = process.env.MONGO_DB_URL || 'mongodb://127.0.0.1:27017/mongoose';
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require("express");
const Champion = require("./championModel")
const compression = require('compression')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 300 });
const app = express();
const PORT = process.env.PORT || 5000
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

app.use(bodyParser.json());

app.use(compression());

app.listen(PORT, function() {
	console.log(`Example app listening on port ${PORT}!`);
});

const schemas = buildSchema(`
	type Query {
		champion(name: String!): Champion
		allChampion: [Champion]
	}
	type Champion {
		name: String!
		health: Int!
		attack: Int!
		defense: Int!
		criticalRate: Int!
		criticalDamage: Int!
		speed: Int!
		resistance: Int!
		accuracy: Int!
	}
`)

const getChampion = (query) => {
	return Champion.findOne({ name: query.name }, function (err, response) {
		if(err) return err
		return response;
	})
}

const getAllChampions = () => {
	return Champion.find(null, function (err, docs) {
		if (err) return err;
		const valueKey = myCache.get("allChampions");
		if (valueKey) {
			const championCache = myCache.get("allChampions");
			return championCache
		} else {
			myCache.set("allChampions", docs, 10000);
			return docs
		}		
	})	
}

const root = {
	champion: getChampion,
	allChampion: getAllChampions
}

app.use('/graphql', graphqlHTTP({
	schema: schemas,
	rootValue: root,
	graphiql: true
}))

app.get('/', (req, res) => res.send('Hello World with Express'));

mongoose.connect(mongoUrl, { useNewUrlParser: true });
var db = mongoose.connection;

!db ? console.log("Error connecting db") : console.log("Db connected successfully");