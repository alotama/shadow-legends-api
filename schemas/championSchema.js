const { buildSchema } = require('graphql')

module.exports = buildSchema(`
	type Query {
		champion(name: String!): Champion
		allChampion(name: [String!]):[Champion]
	}
	type Champion {
		id: ID!
		name: String!
		rarity: String
		faction: String
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