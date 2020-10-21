const {gql} = require('apollo-server-express');

module.exports = gql`
scalar Date

type Course {
    id: ID!
    title:String!
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
    teacher: ID
}

type Person {
    id: ID!
    email: String!
    name: String!
    surname: String
    password: String!
    country: String
    city: String
    institution: String
    description: String
    photo:  String
    accountType: String!
    token: String
}

type Query {
    courses: [Course!]
    persons: [Person!]
    me: Person
}

type Mutation {
    createCourse(
    title:String!,
    description:String,
    dateStart: Date,
    dateEnd: Date,
    maxMark: Int,
    teacher: ID!,
    ) : Course!

    register(email: String!, name: String!, password: String!, accountType: String!): Person!
    login(email: String!, name: String!, password: String!, accountType: String!): Person
}
`;