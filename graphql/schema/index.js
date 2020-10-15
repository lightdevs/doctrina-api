const { buildSchema } = require("graphql")

module.exports = buildSchema(`
  type course {
    _id: ID!
    title: String!
    description: String!
    createdAt: String!
  }

  input courseInput {
    title: String!
    description: String!
  }

  type Query {
    courses:[course!]
  }

  type Mutation {
    createCourse(course:courseInput): course
  }

  schema {
    query: Query
    mutation: Mutation
  }
`)