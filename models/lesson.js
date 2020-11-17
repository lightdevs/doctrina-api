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
        links: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false
        },
        type: {
            type: String,
            required: false
        },
        mark: {
            type: String,
            required: false
        },
        dateStart: {
            type: Date,
            required: false,
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