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
    lessons: [ID!]
    teacher: ID!
    students: [ID!]!
}

type CourseLink {
    _id: ID!
    title: String!
    course: ID!
    description: String
    timeAdded: Date
    link: String!
}

type CourseDoc {
    _id: ID!
    title: String!
    course: ID!
    description: String
    timeAdded: Date
    documentName: String
    documentLink: String!
}

type Lesson {
    _id: ID!
    course: ID!
    title:String!
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
}

type LessonLink {
    _id: ID!
    title: String!
    lesson: ID!
    description: String
    timeAdded: Date
    link: String!
}

type LessonDoc {
    _id: ID!
    title: String!
    lesson: ID!
    description: String
    timeAdded: Date
    documentName: String
    documentLink: String!
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
    courses(sort: String, title: String, page: Int!, count: Int!): ExtendedPerson
    persons(sort: String, email: String, page: Int!, count: Int!): ExtendedCourse
    personsNotOnCourse(courseId: String, email: String, page: Int!, count: Int!): ExtendedCourse
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

    deletePerson(
        id: ID!
    ) : MutationResult!

    updatePerson(
        id: ID!
        email: String,
        name: String,
        surname: String,
        country: String,
        city: String,
        institution: String,
        description: String,
        photo:  String
    ) : Person!

    addStudent(
        idCourse: ID!,
        idPerson: ID!
    ) : Person

    removeStudent(
        idCourse: ID!,
        idPerson: ID!
    ) : Person

    addLesson(
        idCourse: ID!,
        title: String
    ) : Lesson!

    register(email: String!, name: String!, surname: String!, password: String!, accountType: String!): Person!
    login(email: String!, password: String!): Person
}
`;