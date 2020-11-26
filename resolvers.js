const { Kind } = require('graphql/language');
const { GraphQLScalarType } = require('graphql');
const utils = require('./utils');
const md5 = require('md5');
const config = require('./config');
const Course = require('./models/course');
const Person = require('./models/person');
const Lesson = require('./models/lesson');
const File = require('./models/file');
const Link = require('./models/link');
const Task = require('./models/task');


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
            if (args.title != null) {
              myCourses = myCourses.filter(course => !!course.title.toString().match(new RegExp(args.title, 'i')));
            }
            let allMyCourses = await Course.find({ teacher: person._id });
            if (args.title != null) {
              allMyCourses = allMyCourses.filter(course => !!course.title.toString().match(new RegExp(args.title, 'i')));
            }
            let allMyCoursesLength = allMyCourses.length;
            myCourses = myCourses.map(function (el) {
              return {
                course: el,
                teacher: Person.findById(el.teacher)
              }
            });
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
              let currentCourse = await Course.findById(courseId);
              if (currentCourse) myCourses.push(currentCourse);
            }
            if (args.title != null) {
              myCourses = myCourses.filter(course => !!course.title.toString().match(new RegExp(args.title, 'i')));
            }
            myCourses = myCourses.map(function (el) {
              return {
                course: el,
                teacher: Person.findById(el.teacher)
              }
            });
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
              studentsOfAnyCourse = studentsOfAnyCourse.filter(student => !!student.email.toString().match(new RegExp(args.email, 'i')));
            }
            return { course: null, persons: studentsOfAnyCourse, isEnd: allStudentsLength > skip + limit ? false : true };
          }
          else if (person.accountType == "student") {
            let teachersOfMyCourses = [];
            for (let courseId of person.coursesTakesPart) {
              let currentCourse = await Course.findById(courseId);
              let currentTeacher = currentCourse ? await Person.findById(currentCourse.teacher) : null;
              if (currentTeacher) teachersOfMyCourses.push(currentTeacher);
            }
            let allTeachersLength = teachersOfMyCourses.length;
            if (args.email != null) {
              teachersOfMyCourses = teachersOfMyCourses.filter(teacher => !!teacher.email.toString().match(new RegExp(args.email, 'i')));
            }
            return { course: null, persons: teachersOfMyCourses, isEnd: allTeachersLength > skip + limit ? false : true };
          }
        } else throw new Error("No such user 404");
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    filesByCourse: async (parent, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let files = [];
        let course = await Course.findById(args.courseId);
        if (course) {
          for (let fileId of course.materials) {
            files.push(await File.findById(fileId));
          }
          return files;
        } else {
          throw new Error("Course not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    filesByLesson: async (parent, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let files = [];
        let lesson = await Lesson.findById(args.lessonId);
        if (lesson) {
          for (let fileId of lesson.materials) {
            files.push(await File.findById(fileId));
          }
          return files;
        } else {
          throw new Error("Lesson not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    lessonsByCourse: async (parent, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let course = await Course.findById(args.courseId);
        if (course) {
          return Lesson.find({ course: course._id });
        } else {
          throw new Error("Course not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    linksByCourse: async (_, args, context, info) => {
      passCheck(info);
      let course = await Course.findById(args.id);
      if (course) {
        let links = [];
        for (let linkId of course.links) {
          links.push(await Link.findById(linkId));
        }
        return links;
      } else {
        throw new Error("Course not found");
      }
    },
    linksByLesson: async (_, args, context, info) => {
      passCheck(info);
      let lesson = await Lesson.findById(args.id);
      if (lesson) {
        let links = [];
        for (let linkId of lesson.links) {
          links.push(await Link.findById(linkId));
        }
        return links;
      } else {
        throw new Error("Lesson not found");
      }
    },

    downloadFile: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let url = `http://localhost:${config.PORT}/download?id=${args.id}`;
        return url;
      }
      else {
        throw new Error("Unauthorized 401");
      }
    },

    personsNotOnCourse: async (parent, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        const person = await Person.findById(context.payload.payload._id);
        const course = await Course.findById(args.courseId);
        if (course) {
          if (person.accountType == "teacher") {
            let difference = (await Person.find()).filter(x => !course.students.includes(x._id) && x.accountType == "student");
            if (args.email) difference = difference.filter(student => !!student.email.toString().match(new RegExp(args.email, 'i')));
            let persons = [];
            let end = false;
            for (let student of paginator(args.page, args.count, difference)) {
              if (student == "END") {
                end = true;
                break;
              }
              persons.push(student);
            }
            return { course: course, persons: persons, isEnd: end };
          }
          else if (person.accountType == "student") {
            throw new Error("Students are not permitted 403")
          }
        } else throw new Error("No such course 404");
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    me: (parent, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        return Person.findById(context.payload.payload._id);
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
        if (!person) throw new Error("No such person");
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
        courses = courses.map(function (el) {
          return {
            course: el,
            teacher: Person.findById(el.teacher)
          }
        });
        return { person: person, courses: courses, isEnd: end };
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    lessonById: async (_, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        let lesson = await Lesson.findById(args.id);
        if (lesson) {
          return lesson;
        } else {
          throw new Error("Not found 404");
        }

      } else {
        throw new Error("Unauthorized 401");
      }
    },
    linkById: async (_, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        let link = Link.findById(args.id);
        if (link) {
          return link;
        } else {
          throw new Error("Not found 404");
        }

      } else {
        throw new Error("Unauthorized 401");
      }
    },
    taskById: async (_, args, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        let task = Task.findById(args.id);
        if (task) {
          return task;
        } else {
          throw new Error("Not found 404");
        }

      } else {
        throw new Error("Unauthorized 401");
      }
    },

    studentStatisticsByCourse: async (_, args, context, info) => {
      passCheck(info);
      let studentId = args.studentId;
      let courseId = args.courseId;
      let course = await Course.findById(courseId);
      if (course) {
        if (course.teacher == context.payload.payload._id && context.loggedIn) {
          let student = await Person.findById(studentId);
          if (student) {
            if (student.accountType != "teacher") {
              if (course.students.includes(studentId)) {
                let res = [];
                for (let lessonId of course.lessons) {
                  let lesson = await Lesson.findById(lessonId);
                  let stMark = lesson.marks.filter(el => el.student == studentId);
                  res.push({
                    lesson: lesson._id,
                    mark: [{
                      student: stMark[0].student,
                      mark: stMark[0].mark
                    }]
                  });
                }
                return res;
              } else {
                throw new Error("Course does not contains this student");
              }
            } else {
              throw new Error("Not a student ");
            }
          } else {
            throw new Error("Person not found 404");
          }
        }
      } else {
        throw new Error("Course not found 404");
      }
    },
    statisticsByCourse: async (_, args, context, info) => {
      passCheck(info);
      let courseId = args.courseId;
      let course = await Course.findById(courseId);
      if (course) {
        if (course.teacher == context.payload.payload._id && context.loggedIn) {
          let res = [];
          for (let lessonId of course.lessons) {
            let lesson = await Lesson.findById(lessonId);
            res.push({
              lesson: lesson._id,
              mark: lesson.marks
            });
          }
          return res;
        } else {
          throw new Error("Unauthorized 401");
        }

      } else {
        throw new Error("Course not found 404");
      }
    }
  },
  Mutation: {
    register: async (_, { email, name, surname, password, accountType }, __, info) => {

      const newPerson = { email: email, password: await utils.encryptPassword(password), name: name, surname: surname, accountType: accountType };
      const person = await Person.find({ email: email });
      if (person.length != 0) {
        throw new Error("User Already Exists!");
      }
      try {
        const regPerson = await Person.create(newPerson);
        const token = utils.getToken(regPerson);  // todo: minimize token({id})
        regPerson.token = token;
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

    uploadCourseMaterial: async (_, { courseId, file }, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let teacher = await Person.findById(context.payload.payload._id);
        if (teacher.accountType == "teacher") {
          let course = await Course.findById(courseId);
          if (course) {
            const { createReadStream, filename, mimetype } = await file;
            const { courseMaterialsBucket } = require("./buckets");
            let hash = md5(filename.concat(teacher.email, course.title));
            const writeStream = courseMaterialsBucket.openUploadStream(hash);

            await new Promise(res => {
              createReadStream()
                .pipe(writeStream)
                .on('error', function (error) {
                  console.error(error);
                  throw new Error("Can't upload file ");
                })
                .on('finish', res);
            }
            );

            const newFile = new File(
              {
                title: filename,
                searchTitle: hash,
                bucket: "course",
                userId: teacher._id,
                parentInstance: courseId,
                fileId: writeStream.id,
                mimetype: mimetype,
                size: writeStream.length
              });
            newFile.save();

            let materials = course.materials;
            materials.push(newFile._id);
            let updatedCourse = await Course.findByIdAndUpdate({ _id: courseId }, { materials: materials }, {
              returnOriginal: false
            });

            if (newFile && updatedCourse) {
              return !!updatedCourse;
            } else {
              throw new Error("File or course ain`t saved 500")
            }
          } else {
            throw new Error("Course not found 404");
          }
        } else {
          throw new Error("Students are not permitted to modify the course 403");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    uploadLessonMaterial: async (_, { lessonId, file }, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let teacher = await Person.findById(context.payload.payload._id);
        if (teacher.accountType == "teacher") {
          let lesson = await Lesson.findById(lessonId);
          if (lesson) {
            const { createReadStream, filename, mimetype } = await file;
            const { lessonMaterialsBucket } = require("./buckets");
            let hash = md5(filename.concat(teacher.email, lesson.title));
            const writeStream = lessonMaterialsBucket.openUploadStream(hash);

            await new Promise(res => {
              createReadStream()
                .pipe(writeStream)
                .on('error', function (error) {
                  console.error(error);
                  throw new Error("Can't upload file ");
                })
                .on('finish', res);
            }
            );
            const newFile = new File(
              {
                title: filename,
                searchTitle: hash,
                bucket: "lesson",
                userId: teacher._id,
                parentInstance: lessonId,
                fileId: writeStream.id,
                mimetype: mimetype,
                size: writeStream.length
              });
            newFile.save();

            let materials = lesson.materials;
            materials.push(newFile._id);
            let updatedLesson = await Lesson.findByIdAndUpdate({ _id: lessonId }, { materials: materials }, {
              returnOriginal: false
            });

            if (newFile && updatedLesson) {
              return !!updatedLesson;
            } else {
              throw new Error("File or lesson ain`t saved 500")
            }
          } else {
            throw new Error("Lesson not found 404");
          }
        } else {
          throw new Error("Students are not permitted to modify the lesson 403");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    uploadProfilePic: async (_, { personId, file }, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        if (context.payload.payload._id == personId) {
          let person = await Person.findById(personId);
          if (person) {
            const { createReadStream, filename, mimetype } = await file;

            if (!(mimetype.indexOf('image') + 1)) throw new Error("It must be an image 406");

            const { profilePicsBucket } = require("./buckets");
            let hash = md5(filename.concat(person.email, person.name));
            const writeStream = profilePicsBucket.openUploadStream(hash);

            await new Promise(res => {
              createReadStream()
                .pipe(writeStream)
                .on('error', function (error) {
                  console.error(error);
                  throw new Error("Can't upload file ");
                })
                .on('finish', res);
            }
            );
            const newFile = new File(
              {
                title: filename,
                searchTitle: hash,
                bucket: "pic",
                userId: person._id,
                parentInstance: person._id,
                fileId: writeStream.id,
                mimetype: mimetype,
                size: writeStream.length
              });
            newFile.save();

            if (person.photo != null) {
              ы
              let file = await File.findById(person.photo);
              profilePicsBucket.delete(file.fileId, function (error) {
                console.log(error);
              });
              const res = await File.deleteOne({ _id: person.photo })
            }

            let updatedPerson = await Person.findByIdAndUpdate({ _id: personId }, { photo: newFile._id }, {
              returnOriginal: false
            });

            if (newFile && updatedPerson) {
              return !!updatedPerson;
            } else {
              throw new Error("File or profile ain`t saved 500")
            }
          } else {
            throw new Error("Person not found 404");
          }
        } else {
          throw new Error("Not your profile 403");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    deleteFile: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let file = await File.findById(args.id);
        if (file) {
          if (file.userId == context.payload.payload._id) {

            let bucket;
            let updated;
            let arr;
            try {
              switch (file.bucket) {
                case "course":
                  const { courseMaterialsBucket } = require("./buckets");
                  bucket = courseMaterialsBucket;
                  let course = await Course.findById(file.parentInstance);
                  arr = course.materials;
                  arr.remove(args.id);
                  updated = await Course.findByIdAndUpdate({ _id: course._id }, { materials: arr }, {
                    returnOriginal: false
                  });
                  break;
                case "lesson":
                  const { lessonMaterialsBucket } = require("./buckets");
                  bucket = lessonMaterialsBucket;
                  let lesson = await Lesson.findById(file.parentInstance);
                  arr = lesson.materials;
                  arr.remove(args.id);
                  updated = await Lesson.findByIdAndUpdate({ _id: lesson._id }, { materials: arr }, {
                    returnOriginal: false
                  });
                  break;
                case "pic":
                  const { profilePicsBucket } = require("./buckets");
                  bucket = profilePicsBucket;
                  updated = await Person.findByIdAndUpdate({ _id: file.parentInstance }, { photo: null }, {
                    returnOriginal: false
                  });
                  break;

              }
            } catch (err) {
              throw err;
            }

            bucket.delete(file.fileId, function (error) {
            });
            const res = await File.remove({ _id: file._id });
            return { affectedRows: 1 };

          } else {
            throw new Error("Not permitted to modify 403");
          }
        }
        else {
          throw new Error("File not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    createCourse: async (_, { title, description, dateStart, dateEnd, maxMark }, context, info) => {
      if (context.loggedIn) {
        passCheck(info);
        const authorId = context.payload.payload._id;
        const author = await Person.findById(authorId);
        const course = new Course({ title, description, dateStart, dateEnd, maxMark, teacher: author._id });

        let authorCourses = author.coursesConducts;
        authorCourses.push(course._id);
        let updatedAuthor = await Person.findOneAndUpdate({ _id: authorId }, { coursesConducts: authorCourses }, {
          returnOriginal: false
        });

        await course.save();
        return updatedAuthor ? course : "Can't modify subscribers 520";
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    deleteCourse: async (_, { id }, context, info) => {
      passCheck(info);
      const course = await Course.findById(id);
      if (course == null) throw new Error("Course not found 404");
      const teacher = await Person.findById(course.teacher);
      if (context.loggedIn && course.teacher == context.payload.payload._id) {
        let authorCourses = teacher.coursesConducts;
        let students = course.students;
        let lessons = course.lessons;
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
          updatedStudent = await Person.findOneAndUpdate({ _id: studentId }, { coursesTakesPart: studentCourses }, {
            returnOriginal: false
          });
        }

        for (let lessonId of lessons) {
          await Lesson.remove({ _id: lessonId });
        }

        if (updatedAuthor && updatedStudent) {
          return { affectedRows: res.deletedCount };
        } else throw new Error("Can't modify subscribers 520");
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

    deletePerson: async (_, { id }, context, info) => {
      passCheck(info);
      const person = await Person.findById(id);
      if (person == null) throw new Error("Student not found 404");
      if (context.loggedIn && person._id == context.payload.payload._id) {
        let coursesUpdated = true;
        if (person.accountType == "student") {
          let studentCourses = person.coursesTakesPart;
          for (let courseId of studentCourses) {
            let course = await Course.findById(courseId);
            let courseStudents = course.students;
            courseStudents.remove(id);
            let updSt = await Course.findOneAndUpdate({ _id: courseId }, { students: courseStudents }, {
              returnOriginal: false
            });
            coursesUpdated = !!updSt && coursesUpdated;
          }
        } else {
          for (let courseId of person.coursesConducts) {
            let course = await Course.findById(courseId);
            for (let studentId of course.students) {
              let student = await Person.findById(studentId);
              let updTakesPart = student.coursesTakesPart;
              updTakesPart.remove(courseId);
              let updSt = await Person.findOneAndUpdate({ _id: studentId }, { coursesTakesPart: updTakesPart }, {
                returnOriginal: false
              });
              coursesUpdated = !!updSt && coursesUpdated;
            }
            let delCourseResult = await Course.remove({ _id: courseId });
            if (!delCourseResult) throw new Error("Course of the teacher can't be deleted")
          }
        }

        let res = await Person.remove({ _id: id });

        if (coursesUpdated && res) {
          return { affectedRows: res.deletedCount };
        } else throw new Error("Can't modify courses 520");
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    updatePerson: async (_, args, context, info) => {
      passCheck(info);
      const person = await Person.findById(args.id);
      if (person == null) throw new Error("Person not found 404");
      if (!!args.accountType && !!args.password) throw new Error("You are not permitted to modify these fields 403");
      if (context.loggedIn && person._id == context.payload.payload._id) {
        const newPerson = await Person.findOneAndUpdate({ _id: args.id }, args, { new: true });
        return newPerson;
      } else {
        throw new Error("Unauthorized 401");
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
    },
    removeStudent: async (_, args, context, info) => {
      passCheck(info);
      const course = await Course.findById(args.idCourse);
      const student = await Person.findById(args.idPerson);
      if (course == null) throw new Error("Course not found 404");
      if (student == null) throw new Error("Student not found 404");
      if (context.loggedIn && (course.teacher == context.payload.payload._id || student._id == context.payload.payload._id)) {
        let studentArray = course.students;
        studentArray.remove(student._id);
        let updatedCourse = await Course.findOneAndUpdate({ _id: args.idCourse }, { students: studentArray }, {
          returnOriginal: false
        });

        let participatesArray = student.coursesTakesPart;
        participatesArray.remove(course._id);
        let updatedStudent = await Person.findOneAndUpdate({ _id: args.idPerson }, { coursesTakesPart: participatesArray }, {
          returnOriginal: false
        });
        return updatedCourse && updatedStudent ? student : "Can't remove student 520";
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    addLesson: async (_, args, context, info) => {
      passCheck(info);
      const course = await Course.findById(args.idCourse);
      const teacher = await Person.findById(context.payload.payload._id);
      if (course == null) throw new Error("Course not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {
        const lesson = new Lesson({ course: course._id, title: args.title, type: args.type });
        let lessons = course.lessons;
        lessons.push(lesson._id);
        let updatedCourse = await Course.findOneAndUpdate({ _id: args.idCourse }, { lessons: lessons }, {
          returnOriginal: false
        });


        lesson.save();

        return updatedCourse ? lesson : "Cant modify course";

      } else {
        throw new Error("Unauthorized 401");
      }
    },
    deleteLesson: async (_, args, context, info) => {
      passCheck(info);
      const lesson = await Lesson.findById(args.id);
      if (lesson == null) throw new Error("Lesson not found 404");
      const course = await Course.findById(lesson.course);
      if (context.loggedIn && course.teacher == context.payload.payload._id) {

        let lessons = course.lessons;
        lessons.remove(args.id);

        let updCourse = await Course.findOneAndUpdate({ _id: lesson.course }, { lessons: lessons }, {
          returnOriginal: false
        });

        if (!updCourse) throw new Error("Course can`t be updated")

        let res = await Lesson.remove({ _id: args.id });
        if (!res) throw new Error("Lesson can't be deleted");
        return { affectedRows: res.deletedCount };

      } else {
        throw new Error("Unauthorized 401");
      }
    },

    updateLesson: async (_, args, context, info) => {
      passCheck(info);
      const lesson = await Lesson.findById(args.id);
      if (lesson == null) throw new Error("Lesson not found 404");
      const course = await Course.findById(lesson.course);
      if (context.loggedIn && course.teacher == context.payload.payload._id) {

        let updLes = await Lesson.findOneAndUpdate({ _id: lesson._id }, args, {
          returnOriginal: false
        });

        if (!updLes) throw new Error("Lesson can`t be updated")

        return updLes;

      } else {
        throw new Error("Unauthorized 401");
      }
    },

    addCourseLink: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let course = await Course.findById(args.idCourse);
        if (course) {
          let link = new Link(
            {
              link: args.link,
              description: args.description,
              parentInstance: args.idCourse,
              parentType: "course"
            }
          );

          let links = course.links;
          links.push(link._id);
          let updatedCourse = await Course.findOneAndUpdate({ _id: args.idCourse }, { links: links }, {
            returnOriginal: false
          });

          await link.save();
          return updatedCourse ? link : "Can't modify course 520";;
        } else {
          throw new Error("Course not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    deleteCourseLink: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let link = await Link.findById(args.id);
        if (link) {
          let course = await Course.findById(link.parentInstance);
          if (course) {
            let links = course.links;
            links.remove(link._id);
            let updatedCourse = await Course.findOneAndUpdate({ _id: course._id }, { links: links }, {
              returnOriginal: false
            });

            let delLinkResult = await Link.remove({ _id: args.id });

            return { affectedRows: delLinkResult.deletedCount };
          } else {
            throw new Error("Course not found 404");
          }
        } else {
          throw new Error("Link not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    updateLink: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let link = await Link.findById(args.id);
        if (link) {
          let updatedLink = await Link.findOneAndUpdate({ _id: link._id }, args, {
            new: true
          });
          if (!updatedLink) throw new Error("Can't update link");

          return updatedLink;
        } else {
          throw new Error("Link not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    addLessonLink: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let lesson = await Lesson.findById(args.idLesson);
        if (lesson) {
          let link = new Link(
            {
              link: args.link,
              description: args.description,
              parentInstance: args.idLesson,
              parentType: "lesson"
            }
          );

          let links = lesson.links;
          links.push(link._id);
          let updatedLesson = await Lesson.findOneAndUpdate({ _id: args.idLesson }, { links: links }, {
            returnOriginal: false
          });

          await link.save();
          return updatedLesson ? link : "Can't modify lesson 520";;
        } else {
          throw new Error("Lesson not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },
    deleteLessonLink: async (_, args, context, info) => {
      passCheck(info);
      if (context.loggedIn) {
        let link = await Link.findById(args.id);
        if (link) {
          let lesson = await Lesson.findById(link.parentInstance);
          if (lesson) {
            let links = lesson.links;
            links.remove(link._id);
            let updatedLesson = await Lesson.findOneAndUpdate({ _id: lesson._id }, { links: links }, {
              returnOriginal: false
            });

            let delLinkResult = await Link.remove({ _id: args.id });

            return { affectedRows: delLinkResult.deletedCount };
          } else {
            throw new Error("Lesson not found 404");
          }
        } else {
          throw new Error("Link not found 404");
        }
      } else {
        throw new Error("Unauthorized 401");
      }
    },

    addTask: async (_, args, context, info) => {
      passCheck(info);
      const lesson = await Lesson.findById(args.parentInstance);
      if (!lesson) throw new Error("Lesson not found 404");
      const teacher = await Person.findById(context.payload.payload._id);
      if (!teacher) throw new Error("Person not found 404");
      const course = await Course.findById(lesson.course);
      if (!course) throw new Error("Course not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {
        const task = new Task({
          title: args.title,
          description: args.description,
          dateStart: args.dateStart,
          dateEnd: args.dateEnd,
          maxMark: args.maxMark,
          parentInstance: args.parentInstance
        });
        task.save();

        let tasks = lesson.tasks;
        tasks.push(task._id);
        let updatedLesson = await Lesson.findOneAndUpdate({ _id: args.parentInstance }, { tasks: tasks }, {
          returnOriginal: false
        });

        return updatedLesson ? task : "Cant modify lesson";

      } else {
        throw new Error("Unauthorized 401");
      }
    },
    updateTask: async (_, args, context, info) => {
      passCheck(info);
      const task = await Task.findById(args.id);
      if (task == null) throw new Error("Task not found 404");
      const lesson = await Lesson.findById(task.parentInstance);
      if(!lesson) throw new Error("Lesson not found 404");
      const course = await Course.findById(lesson.course);
      if(!course) throw new Error("Course not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {

        let updTask = await Task.findOneAndUpdate({ _id: task._id }, args, {
          returnOriginal: false
        });

        if (!updTask) throw new Error("Task can`t be updated")

        return updTask;

      } else {
        throw new Error("Unauthorized 401");
      }
    },
    deleteTask: async (_, args, context, info) => {
      passCheck(info);
      const task = await Task.findById(args.id);
      if (task == null) throw new Error("Task not found 404");
      const lesson = await Lesson.findById(task.parentInstance);
      if(!lesson) throw new Error("Lesson not found 404");
      const course = await Course.findById(lesson.course);
      if(!course) throw new Error("Course not found 404");
      if (context.loggedIn && course.teacher == context.payload.payload._id) {

        let tasks = lesson.tasks;
        tasks.remove(args.id);

        let updLesson = await Lesson.findOneAndUpdate({ _id: task.parentInstance }, { tasks: tasks }, {
          returnOriginal: false
        });

        if (!updLesson) throw new Error("Lesson can`t be updated")

        let res = await Task.remove({ _id: args.id });
        if (!res) throw new Error("Task can't be deleted");
        return { affectedRows: res.deletedCount };

      } else {
        throw new Error("Unauthorized 401");
      }
    },

    setLessonMark: async (_, args, context, info) => {
      passCheck(info);
      let student = await Person.findById(args.idStudent);
      if (student && student.accountType == "student") {
        let lesson = await Lesson.findById(args.idLesson);
        if (lesson) {
          let course = await Course.findById(lesson.course);
          if (course) {
            if (course.students.includes(student._id)) {
              if (context.loggedIn && course.teacher == context.payload.payload._id) {
                let marks = lesson.marks;
                marks.push({
                  student: student._id,
                  mark: args.mark
                });
                let updatedLesson = await Lesson.findOneAndUpdate({ _id: lesson._id }, { marks: marks }, {
                  new: true
                });
                if (updatedLesson) {
                  return updatedLesson;
                } else {
                  throw new Error("Can't update lesson")
                }
              } else {
                throw new Error("Unauthorized 401");
              }
            } else {
              throw new Error("Course does not contain this student");
            }
          } else {
            throw new Error("Course not found 404");
          }
        } else {
          throw new Error("Lesson not found 404");
        }
      } else {
        throw new Error("Incorrect student");
      }
    },
    setCourseMark: async (_, args, context, info) => {
      passCheck(info);
      let student = await Person.findById(args.idStudent);
      if (student && student.accountType == "student") {
        let course = await Course.findById(args.idCourse);
        if (course) {
          if (course.students.includes((student)._id)) {
            if (context.loggedIn && course.teacher == context.payload.payload._id) {
              let marks = course.marks;
              marks.push({
                student: student._id,
                mark: args.mark
              });
              let updatedCourse = await Course.findOneAndUpdate({ _id: course._id }, { marks: marks }, {
                new: true
              });
              if (updatedCourse) {
                return updatedCourse;
              } else {
                throw new Error("Can't update lesson")
              }
            } else {
              throw new Error("Unauthorized 401");
            }
          } else {
            throw new Error("Course does not contain this student");
          }
        } else {
          throw new Error("Course not found 404");
        }
      } else {
        throw new Error("Incorrect student");
      }
    },


    dropCourses: async () => {
      for (let course of await Course.find()) {
        const teacher = await Person.findById(course.teacher);

        let authorCourses = teacher.coursesConducts;
        let students = course.students;
        let lessons = course.lessons;
        const res = await Course.remove({ _id: course.id });
        authorCourses.remove(course.id);
        let updatedAuthor = await Person.findOneAndUpdate({ _id: teacher._id }, { coursesConducts: authorCourses }, {
          returnOriginal: false
        });


        let updatedStudent;

        for (let studentId of students) {
          const student = await Person.findById(studentId);
          let studentCourses = student.coursesTakesPart;
          studentCourses.remove(course.id);
          updatedStudent = await Person.findOneAndUpdate({ _id: studentId }, { coursesTakesPart: studentCourses }, {
            returnOriginal: false
          });
        }

        for (let lessonId of lessons) {
          await Lesson.remove({ _id: lessonId });
        }

        if (updatedAuthor && updatedStudent) {

        }
      }
      return true;
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
