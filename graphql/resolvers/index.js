const Course = require("../../models/course")

module.exports = {
    courses: async () => {
        try {
            const coursesFetched = await Course.find()
            return coursesFetched.map(course => {
                return {
                    ...course._doc,
                    _id: course.id,
                    createdAt: new Date(course._doc.createdAt).toISOString(),
                }
            })
        } catch (error) {
            throw error
        }
    },

    createCourse: async args => {
        try {
            const { title, description } = args.course
            const course = new Course({
                title,
                description,
            })
            const newcourse = await course.save()
            return { ...newcourse._doc, _id: newcourse.id }
        } catch (error) {
            throw error
        }
    },
}