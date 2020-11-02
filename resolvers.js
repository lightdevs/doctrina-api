const { Kind } = require('graphql/language');
const { GraphQLScalarType } = require('graphql');
const utils = require('./utils');
const Course = require('./models/course');
const Person = require('./models/person');
const { compare } = require('bcryptjs');

function passCheck(info) {
  function check(parentField) {
    if (parentField == undefined) return; // recursion base
    parentField = parentField.selections;
    for (let field of parentField) {
      if (field.name.value == "password" || field.name.value == "token") {
        throw new Error("Password or token must not be requested");
      }
      check(field.selectionSet);
    }
  }

  check(info.operation.selectionSet.selections[0].selectionSet);
}

Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

function paginator(page, count, array) {
  let skip = count * page;
  let limit = skip + count;

  if (array.length > limit) {
    array = array.slice(skip, limit);
  }
  else {
    array = array.slice(skip);
    Array.prototype.push.apply(array, ["END"]);
  }
  return array;
};

function stringComparator(a, b) {
};
function numberComparator(a, b) { return (a - b) };

function sortByFunc(sortString, array) {    //TODO: Strategy pattern
  let sortParams = JSON.parse(sortString);
  let stringFields = ["name", "title"];
  let numericalFields = ["maxMark"];
  for (let field in sortParams) {
    switch (true) {
      case stringFields.includes(field):
        array.sort(stringComparator());
        break;
      case numericalFields.includes(field):
        array.sort(numberComparator);
        break;
    }

  }
}

module.exports = {
  Query: {
    courses: async (parent, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        const person = await Person.findById(context.payload.payload._id);

        if (person) {
          if (person.accountType == "teacher") {
            let skip = args.count * args.page;
            let limit = args.count;
            let myCourses = await Course.find({ teacher: person._id }, null, { skip: skip, limit: limit, sort: args.sort });
            let allMyCoursesLength = await (await Course.find({ teacher: person._id })).length;
            return { person: person, courses: myCourses, isEnd: allMyCoursesLength > skip + limit ? false : true };
          }
          else if (person.accountType == "student") {
            let myCourses = [];
            let end = false;
            for (let courseId of paginator(args.page, args.count, person.coursesTakesPart)) {
              if (courseId == "END") {
                end = true;
                break;
              }
              myCourses.push(await Course.find({ _id: courseId }));
            }
            return { person: person, courses: myCourses, isEnd: end };
          } else throw new Error("Invalid account type");
        } else throw new Error("No such user 404");
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    persons: async (parent, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        const person = await Person.findById(context.payload.payload._id);
        if (person) {
          let skip = args.count * args.page;
          let limit = args.count;
          if (person.accountType == "teacher") {
            let studentsOfAnyCourse = await Person.find({ accountType: "student" }, null, { skip: skip, limit: limit });
            let allStudentsLength = await (await Person.find({ accountType: "student" })).length;
            if (args.email != null) {
              studentsOfAnyCourse = studentsOfAnyCourse.filter(student => student.email == args.email);
            }
            return { course: null, persons: studentsOfAnyCourse, isEnd: allStudentsLength > skip + limit ? false : true };
          }
          else if (person.accountType == "student") {
            let teachersOfMyCourses = [];
            for (let courseId of person.coursesTakesPart) {
              let currentCourse = await Course.findById(courseId);
              let currentTeacher = await Person.findById(currentCourse.teacher);
              if (currentTeacher) teachersOfMyCourses.push(currentTeacher);
            }
            let allTeachersLength = teachersOfMyCourses.length;
            if (args.email != null) {
              teachersOfMyCourses = teachersOfMyCourses.filter(teacher => teacher.email == args.email);
            }
            return { course: null, persons: studentsOfAnyCourse, isEnd: allTeachersLength > skip + limit ? false : true };
          }
        } else throw new Error("No such user 404");
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    me: (parent, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        return context.payload.payload;
      } else {
        throw new Error("Please Login Again!");
      }
    },

    courseById: async (_, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        const currentUser = context.payload.payload._id;
        const course = await Course.findById(args.id);

        let isStudent = false;
        for (let studentId of course.students) {
          if (studentId == currentUser) {
            isStudent = true;
            break;
          }
        }

        let students = [];
        let end = false;
        for (let studentId of paginator(args.page, args.count, course.students)) {
          if (studentId == "END") {
            end = true;
            break;
          }
          students.push(await Person.findById(studentId));
        }
        if (currentUser == course.teacher || isStudent) {
          return { course: course, persons: students, isEnd: end };
        } else {
          throw new Error("Unauthorized 401");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    personById: async (_, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        const currentUser = context.payload.payload._id;
        const person = await Person.findById(args.id);

        let courses = [];
        let end = false;

        if (person.accountType == "student") {
          for (let courseId of paginator(args.page, args.count, person.coursesTakesPart)) {
            if (courseId == "END") {
              end = true;
              break;
            }
            courses.push(await Course.findById(courseId));
          }
        }
        else {
          for (let courseId of paginator(args.page, args.count, person.coursesConducts)) {
            if (courseId == "END") {
              end = true;
              break;
            }
            courses.push(await Course.findById(courseId));
          }
        }
        return { person: person, courses: courses, isEnd: end };
      } else {
        throw new Error("Unauthorized 401");
      }
    }
  },
  Mutation: {
    createCourse: async (_, { title, description, dateStart, dateEnd, maxMark }, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        const authorId = context.payload.payload._id;
        const course = new Course({ title, description, dateStart, dateEnd, maxMark, teacher: authorId });
        const author = await Person.findById(authorId);

        let authorCourses = author.coursesConducts;
        authorCourses.push(course._id);
        let updatedAuthor = await Person.findOneAndUpdate({ _id: authorId }, { coursesConducts: authorCourses }, {
          returnOriginal: false
        });

        await course.save();
        return updatedAuthor ? course : "Can't create course 520";
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    deleteCourse: async (_, { id }, context, info) => {
      passCheck(info);
      const course = await Course.findById(id);
      const teacher = await Person.findById(course.teacher);
      if (course == null) throw new Error("Course not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {
        let authorCourses = teacher.coursesConducts;
        let students = course.students;
        const res = await Course.remove({ _id: id });
        authorCourses.remove(id);
        let updatedAuthor = await Person.findOneAndUpdate({ _id: teacher._id }, { coursesConducts: authorCourses }, {
          returnOriginal: false
        });


        let updatedStudent;

        for (let studentId of students) {
          const student = await Person.findById(studentId);
          let studentCourses = student.coursesTakesPart;
          studentCourses.remove(id);
          updatedStudent &&= await Person.findOneAndUpdate({ _id: studentId }, { coursesTakesPart: studentCourses }, {
            returnOriginal: false
          });
        }

        if (updatedAuthor && updatedStudent) {
          return { affectedRows: res.deletedCount };
        } else throw new Error("Can't delete course 520");
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    updateCourse: async (_, args, context, info) => {
      passCheck(info);
      const course = await Course.findById(args.id);
      if (course == null) throw new Error("Course not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {
        const newCourse = await Course.findOneAndUpdate({ _id: args.id }, args, { new: true });
        return newCourse;
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    register: async (_, { email, name, surname, password, accountType }, __, info) => {

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

    login: async (_, { email, password }, __, info) => {
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
        throw new Error("Wrong Login or Password!")
      }
    },

    addStudent: async (_, args, context, info) => {
      passCheck(info);
      const course = await Course.findById(args.idCourse);
      const student = await Person.findById(args.idPerson);
      if (course == null) throw new Error("Course not found 404");
      if (student == null) throw new Error("Student not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {
        let studentArray = course.students;
        studentArray.push(student._id);
        let updatedCourse = await Course.findOneAndUpdate({ _id: args.idCourse }, { students: studentArray }, {
          returnOriginal: false
        });

        let participatesArray = student.coursesTakesPart;
        participatesArray.push(course._id);
        let updatedStudent = await Person.findOneAndUpdate({ _id: args.idPerson }, { coursesTakesPart: participatesArray }, {
          returnOriginal: false
        });
        return updatedCourse && updatedStudent ? student : "Can't add student 520";
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