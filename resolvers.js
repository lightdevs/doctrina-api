import { Kind } from 'graphql/language';
import { GraphQLScalarType } from 'graphql';

import Course from './models/course'

export const resolvers = {
    Query: {
        courses: () => Course.find()
    },
    Mutation: {
        createCourse: async (_,{title, description, dateStart, dateEnd, maxMark, teacher}) => {
            const course = new Course({title, description, dateStart, dateEnd, maxMark, teacher});
            await course.save();
            return course;
        }
    },

    Date: new GraphQLScalarType({
        name: 'Date',
        description: 'Date custom scalar type',
        parseValue(value) {
          return new Date(value); // value from the client
        },
        serialize(value) {
          return value.getTime(); // value sent to the client
        },
        parseLiteral(ast) {
          if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10); // ast value is always in string format
          }
          return null;
        }
      })

};