import { gql } from "apollo-server-express";

export const typeDefs = gql`

scalar Date

type MyType {
   created: Date
}

type Course {
    id: ID!
    title:String!
    description:String
    dateStart: Date
    dateEnd: Date
    maxMark: Int
    teacher: ID
}

type Query {
    courses: [Course!]
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
}
`;