const {gql} = require('apollo-server-express');

module.exports = gql`

scalar Date

type Course {
    _id: ID!
    title:String!
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
    teacher: ID
    students: [ID!]!
}

type Person {
    _id: ID!
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
    coursesTakesPart: [ID!]!
    coursesConducts: [ID!]! 
    token: String
}

type MutationResult {
    affectedRows: Int!
}

type Query {
    courses: [Course!]
    persons(accountType: String, email: String): [Person!]
    me: Person
    courseById(id: String!): Course
    personById(id: String!): Person
}

type Mutation {
    createCourse(
    title:String!,
    description:String,
    dateStart: Date,
    dateEnd: Date,
    maxMark: Int
    ) : Course!

    deleteCourse(
    id: ID!
    ) : MutationResult!

    updateCourse(
    id: ID!
    title:String
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
    teacher: ID) : Course!

    addStudent(
        idCourse: ID!
        idPerson: ID!
    ) : Person

    register(email: String!, name: String!, surname: String!, password: String!, accountType: String!): Person!
    login(email: String!, password: String!): Person
}
`;