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
        // console.log(context.user)
        if (context.loggedIn) {
            return context.person
        } else {
            throw new AuthenticationError("Please Login Again!")
      }
     }
    },
    Mutation: {
        createCourse: async (_,{title, description, dateStart, dateEnd, maxMark, teacher}) => {
            const course = new Course({title, description, dateStart, dateEnd, maxMark, teacher});
            await course.save();
            return course;
        },

        register: async (parent, args, context, info) => {
  
          // Creating user Object from the arguments with password encryption
          const newPerson = { personemail: args.personemail, password: await utils.encryptPassword(args.password) }
           // Get user document from 'user' collection.
          const person = await mongoose.connection.getCollection('person').findOne({ email: args.personemail })
          // Check If User Exists Already Throw Error  
          if (person) {
            throw new AuthenticationError("User Already Exists!")
          }
          try {
          // Insert User Object to Database
            const regPerson = (await mongoose.connection.model.getCollection('person').insertOne(newPerson)).ops[0];
          // Creating a Token from User Payload obtained.
            const token = utils.getToken(regPerson);
          // Adding token to user object
            return { ...regPerson, token };
           } catch (e) {
            throw e
          }
        },

        login: async (parent, args, context, info) => {
          // Finding a user from user collection.
         const person = await mongoose.connection.model.getCollection('person').findOne({ email: args.personemail });
         // Checking For Encrypted Password Match with util func.
         const isMatch = await utils.comparePassword(args.password, person.password)
       if (isMatch) {
         // Creating a Token from User Payload obtained.
         const token = utils.getToken(person)
         return { ...person, token };
       } else {
         // Throwing Error on Match Status Failed.
         throw new AuthenticationError("Wrong Password!")
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