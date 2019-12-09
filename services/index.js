const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 300 });
const Champion = require('../models/championModel')

const getChampion = (query) => {	
	return Champion.findOne({ name: query.name }, function (err, response) {
		if (err) return console.log(err)
		return response;
	})
}

const getAllChampions = (query) => {
	var queryName = query.name && query.name.map(champion => {
		var obj = { name: "" };
		obj.name = champion;
		return obj;
	});
	
	let filter = queryName ? { $or: queryName } : null

	return Champion.find(filter, function (err, docs) {
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

module.exports = {
	champion: getChampion,
	allChampion: getAllChampions
}