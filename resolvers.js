import { Kind } from 'graphql/language';
import { GraphQLScalarType } from 'graphql';
import mongoose from 'mongoose';
import utils from './utils';

import Course from './models/course'
import Person from './models/person'

export const resolvers = {
    Query: {
      courses: () => Course.find(),
      persons: () => Person.find(),
      me: (parent, args, context, info) => {
        if (context.loggedIn) {
            return context.payload.payload;
        } else {
            throw new Error("Please Login Again!");
      }
     }
    },
    Mutation: {
        createCourse: async (_,{title, description, dateStart, dateEnd, maxMark, teacher}) => {
            const course = new Course({title, description, dateStart, dateEnd, maxMark, teacher});
            await course.save();
            return course;
        },
        deleteCourse: async (_, {title, teacher}) => {
          const res = await Course.remove({ title: title });
          return {affectedRows: res.deletedCount}; 
        },

        register: async (_, {email, name, password, accountType}) => {
  
          // Creating user Object from the arguments with password encryption
          const newPerson = { email: email, password: await utils.encryptPassword(password), name: name, accountType: accountType };
           // Get user document from 'user' collection.
          const person = await Person.find({ email: email });
          if (person.length != 0) {
           throw new Error("User Already Exists!");
          }
          try {
          // Insert User Object to Database
            const regPerson = await Person.create(newPerson);
          // Creating a Token from User Payload obtained.
            const token = utils.getToken(regPerson);
            regPerson.token = token;
          // Adding token to user object
            return regPerson;
           } catch (e) {
            throw e
          }
        },

        login: async (_, {email, password},__,___,info) => {
          // Finding a user from user collection.
         const person = await Person.find({ email: email });
         // Checking For Encrypted Password Match with util func.
         const isMatch = await utils.comparePassword(password, person[0].password)
       if (isMatch) {
         // Creating a Token from User Payload obtained.
         const token = utils.getToken(person[0])
         person[0].token = token;
         return person[0];
       } else {
         // Throwing Error on Match Status Failed.
         throw new Error("Wrong Password!")
     }}
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