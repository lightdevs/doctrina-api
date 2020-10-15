const { buildSchema } = require("graphql")

module.exports = buildSchema(`
  type Cource {
    _id: ID!
    title: String!
    description: String!
    createdAt: String!
  }

  input CourceInput {
    title: String!
    description: String!
  }

  type Query {
    cources:[Cource!]
  }

  type Mutation {
    createCource(cource:CourceInput): Cource
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)