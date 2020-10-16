import { gql } from "apollo-server-express";

export const typeDefs = gql`
type Course {
    id: ID!
    title:String!
    description:String
}

type Query {
    title: String
}

type Mutation {
    createCourse(title: String!) : Course!
}
`;