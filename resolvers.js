import Course from './models/course'

export const resolvers = {
    Mutation: {
        createCourse: async (_,{title}) => {
            const course = new Course({title});
            await course.save();
            return course;
        }
    }
};