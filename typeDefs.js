const { gql } = require('apollo-server-express');

module.exports = gql`

scalar Date

type File {
    _id: ID!
    title:String!
    searchTitle: String
    bucket: String
    fileId: ID!
    userId: ID!
    parentInstance: ID
    description: String
    size: Int
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
    marks: [Tuple]
    materials: [ID!]
    links: [ID!]
    teacher: ID!
    students: [ID!]!
}

type Lesson {
    _id: ID!
    course: ID!
    title:String!
    description:String
    materials: [ID!]
    marks: [Tuple]
    links: [ID!]
    tasks: [ID!]
    type: String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
}

type Task {
    _id: ID!
    title:String!
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
    answers: [ID!]
    links: [ID!]
    parentInstance: ID!
}

type Answer {
    _id: ID!
    title: String
    person: ID!
    parentInstance: ID!
    timeAdded: Date
    mark: Int
    comments: [ID!]
    materials: [ID!]
}

type Comment {
    _id:ID!
    text: String
    person: ID!
    parentInstance: ID!
    timeAdded: Date
}

type Link {
    _id: ID!
    description: String
    link: String!
    parentInstance: ID
    parentType: String
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
    answers: [ID!]
    photo: ID
    accountType: String!
    coursesTakesPart: [ID!]!
    coursesConducts: [ID!]! 
    token: String
}

type Tuple {
    student: ID!
    mark: String
}
type Stat {
    lesson: ID!
    mark: [Tuple!]
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
    downloadFile(id: String!): String

    filesByCourse(courseId: String!, mimetype: String): [File!]
    filesByLesson(lessonId: String!, mimetype: String): [File!]
    lessonsByCourse(courseId: String!): [Lesson!]

    linksByCourse(id: String!) : [Link!]
    linksByLesson(id: String!) : [Link!]

    courses(sort: String, title: String, page: Int!, count: Int!): ExtendedPerson
    persons(sort: String, email: String, page: Int!, count: Int!): ExtendedCourse
    personsNotOnCourse(courseId: String, email: String, page: Int!, count: Int!): ExtendedCourse
    me: Person
    courseById(id: String!, sort: String, page: Int!, count: Int!): ExtendedCourse
    personById(id: String!, sort: String, page: Int!, count: Int!): ExtendedPerson
    lessonById(id: String!): Lesson
    linkById(id: String!): Link

    taskById(id: String!): Task!
    answerById(id: String!): Answer!
    commentById(id: String!): Comment!

    tasksByLesson(id: String!): [Task!]
    answersByTask(id: String!): [Answer!]
    answersByPerson: [Answer!]
    tasksByPerson: [Task!]
    commentsOfAnswer(id: String!): [Comment!]

    studentStatisticsByCourse(studentId: String!, courseId: String!): [Stat!]
    statisticsByCourse(courseId: String!): [Stat!]
}

type Mutation {
    dropCourses: Boolean

    uploadCourseMaterial(file: Upload!, courseId: String!): Boolean
    uploadLessonMaterial(file: Upload!, lessonId: String!): Boolean
    uploadProfilePic(file: Upload!, personId: String!): Boolean

    setCourseMark(idCourse: String!,idStudent: String!, mark: String!) : Course  #?
    setLessonMark(idLesson: String!,idStudent: String!, mark: String!) : Lesson   #?

    deleteFile(id: String!): MutationResult

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

    deleteLesson(
    id: ID!
    ) : MutationResult!

    updateLesson(
    id: ID!
    title:String
    description:String
    dateStart: Date
    dateEnd: Date
    type: String
    maxMark: Int): Lesson!

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
        type: String
    ) : Lesson!

    addCourseLink(
        idCourse: ID!,
        link: String!,
        description: String
      ) : Link!
    deleteCourseLink(id: ID!) : MutationResult
    updateLink(
        id: ID!,
        link: String,
        description: String
        ) : Link!
    addLessonLink(
        idLesson: ID!,
        link: String!,
        description: String
      ) : Link!
    deleteLessonLink(id: ID!) : MutationResult
    addTaskLink(
        idTask: ID!,
        link: String!,
        description: String
      ) : Link!
    deleteTaskLink(id: ID!) : MutationResult

    addTask(
        title:String!,
        description:String,
        dateStart: Date,
        dateEnd: Date,
        maxMark: Int,
        parentInstance: String!
    ): Task!
    updateTask(
        id: String!
        title:String,
        description:String,
        dateStart: Date,
        dateEnd: Date,
        maxMark: Int,
    ): Task!
    deleteTask(id: String!): MutationResult!

    addAnswer(
        title: String,
        taskId: ID!
    ): Answer!
    updateAnswer(
        id: String!,
        title: String
    ): Answer!
    deleteAnswer(id: String!): MutationResult!
    uploadAnswerMaterial(file: Upload!, answerId: String!): Boolean
    setAnswerMark(answerId: String!, mark: Int): Answer!
    


    addComment(
        text: String
        parentInstance: String!
    ): Comment!
    updateComment(
        text: String
    ): Comment!
    deleteComment(id: String!): MutationResult!


    register(email: String!, name: String!, surname: String!, password: String!, accountType: String!): Person!
    login(email: String!, password: String!): Person
}
`;