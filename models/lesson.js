const mongoose = require("mongoose")

const lessonSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        materials: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false
        },
        tasks: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        links: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false
        },
        type: {
            type: String,
            required: false
        },
        marks: {
            type: [{
                student: mongoose.Schema.Types.ObjectId,
                mark: String
            }],
            required: false
        },
        dateStart: {
            type: Date,
            required: false,
        },
        visitors: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false
        },
        dateEnd: {
            type: Date,
            required: false,
        },
        maxMark: {
            type: Number,
            required: false,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Lesson", lessonSchema)