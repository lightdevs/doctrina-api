const { gql } = require('apollo-server-express');

module.exports = gql`

scalar Date

type File {
    _id: ID!
    title:String!
    hash: String
    description:String
    mimetype: String
}


type Course {
    _id: ID!
    title:String!
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
    lessons: [ID!]
    materials: [ID!]
    links: [Link!]
    teacher: ID!
    students: [ID!]!
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

type Link {
    _id: ID!
    title: String
    link: String!
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

type CourseWithTeacher {
    course: Course!
    teacher: Person!
}
type ExtendedPerson {
    person: Person,
    courses: [CourseWithTeacher!]!,
    isEnd: Boolean!
}


type Query {
    files: [File]
    downloadMaterial(name: String!, id: String): String

    courses(sort: String, title: String, page: Int!, count: Int!): ExtendedPerson
    persons(sort: String, email: String, page: Int!, count: Int!): ExtendedCourse
    personsNotOnCourse(courseId: String, email: String, page: Int!, count: Int!): ExtendedCourse
    me: Person
    courseById(id: String!, sort: String, page: Int!, count: Int!): ExtendedCourse
    personById(id: String!, sort: String, page: Int!, count: Int!): ExtendedPerson
}

type Mutation {

    uploadCourseMaterial(file: Upload!): Boolean!

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