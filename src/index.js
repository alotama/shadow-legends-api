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

var server = app.listen(PORT, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('running at http://' + host + ':' + port)
});

app.use(bodyParser.json());

app.use(compression());

const schemas = buildSchema(`
	type Query {
		champion(name: String!): Champion
		allChampion(name: [String!]):[Champion]
	}
	type Champion {
		id: ID!
		name: String!
		rarity: String
		faction: String
		rating: Int
		type: String
		element: String
		stats: Stats!
	}
	type Stats {
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

app.get('/', (req, res) => res.send('Hello World with Express'));

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;

!db ? console.log("Error connecting db") : console.log("Db connected successfully");

const getChampion = (query) => {
	console.log('getChampion Query ->', query)
	return Champion.findOne({ name: query.name }, function (err, response) {
		console.log('getChampion findOne ->', response)
		if(err) return err
		db.close()
		return response;
	})
}

const getAllChampions = (query) => {
	console.log('getAllChampions Query ->', query)
	var queryName = query.name && query.name.map(champion => {
		var obj = { name: "" };
		obj.name = champion;
		return obj;
	});
	
	let filter = queryName ? { $or: queryName } : null

	return Champion.find(filter, function (err, docs) {
		console.log('getAllChampions Find ->', docs)
		if (err) return err;
		const valueKey = myCache.get("allChampions");			
		if (valueKey) {
			const championCache = myCache.get("allChampions");

			db.close()
			return championCache
		} else {
			myCache.set("allChampions", docs, 10000);

			db.close()
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