const {Kind} = require('graphql/language');
const {GraphQLScalarType} = require('graphql');
const utils = require('./utils');
const Course = require('./models/course');
const Person = require('./models/person');

function passCheck(info) {
  for(let field of info.operation.selectionSet.selections[0].selectionSet.selections) {
    if(field.name.value == "password") {
      throw new Error("Password must not be transmitted");
    }
  }
}

module.exports = {
    Query: {
      courses: () => Course.find(),
      persons: () => Person.find(),
      me: (parent, args, context, info) => {
        if (context.loggedIn) {
          passCheck(info);
          return context.payload.payload;
        } else {
            throw new Error("Please Login Again!");
      }
     },

     courseById: async (_, {id}, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        const currentUser = context.payload.payload._id;
        const course = await Course.findById(id);

        let isStudent = false;
        for(let student in course.students) {
          if(student._id == currentUser) {
            isStudent = true;
            break;
          }
        }
        if(currentUser == course.teacher || isStudent) {
        return course;
        } else {
          throw new Error("Unauthorized 401");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
     }
    },
    Mutation: {
        createCourse: async (_,{title, description, dateStart, dateEnd, maxMark, students = []}, context, info) => {
          if (context.loggedIn) {
            passCheck(info);
            const author = context.payload.payload._id;
            const course = new Course({title, description, dateStart, dateEnd, maxMark, teacher : author, students: students});
            await course.save();
            return course;
          } else {
            throw new Error("Unauthorized 401");
          }
        },
        deleteCourse: async (_, {id}, context,info) => {
          passCheck(info);
          const course = await Course.findById(id);
          if(course == null)  throw new Error("Course not found 404");
          if (context.loggedIn && course.teacher == context.payload.payload._id ) {
          const res = await Course.remove({ _id: id });
          return {affectedRows: res.deletedCount}; 
        } else {
            throw new Error("Unauthorized 401");
          }   
        },

        updateCourse: async (_, args, context, info) => {
          passCheck(info);
          const course = await Course.findById(args.id);
          if(course == null)  throw new Error("Course not found 404");
          if (context.loggedIn && course.teacher == context.payload.payload._id ) {
          const newCourse = await Course.findOneAndUpdate({_id : args.id}, args, {new : true});
          return newCourse; 
        } else {
            throw new Error("Unauthorized 401");
          }   
        },

        register: async (_, {email, name, surname, password, accountType},__,info) => {

          passCheck(info);
          const newPerson = { email: email, password: await utils.encryptPassword(password), name: name, surname: surname, accountType: accountType };
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

        login: async (_, {email, password},__,info) => {
        passCheck(info);
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
     }},

     addStudent: async (_, args, context, info) => {
      passCheck(info);
      const course = await Course.findById(args.idCourse);
      const student = await Person.findById(args.idPerson);
      if(course == null)  throw new Error("Course not found 404");
      if(student == null)  throw new Error("Student not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id ) {
        let studentArray = course.students;
        studentArray.push(student);
        let updatedCourse = await Course.findOneAndUpdate({_id: args.idCourse}, {students: studentArray}, {
          returnOriginal: false
        });
      return updatedCourse ? student : "520"; 
    } else {
        throw new Error("Unauthorized 401");
      }  
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