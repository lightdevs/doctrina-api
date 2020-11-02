const { gql } = require('apollo-server-express');

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
type ExtendedCourse {
    course: Course,
    persons: [Person!]!
    isEnd: Boolean!
}
type ExtendedPerson {
    person: Person,
    courses: [Course!]!,
    isEnd: Boolean!
}


type Query {
    courses(sort: String, page: Int!, count: Int!): ExtendedPerson
    persons(sort: String, email: String, page: Int!, count: Int!): ExtendedCourse
    me: Person
    courseById(id: String!, sort: String, page: Int!, count: Int!): ExtendedCourse
    personById(id: String!, sort: String, page: Int!, count: Int!): ExtendedPerson
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