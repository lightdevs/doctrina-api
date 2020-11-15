const mongoose = require("mongoose")

const lessonlinkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
       lesson: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        description: {
            type: String,
            required: false,
        },
        timeAdded: {
            type: Date,
            required: false,
        },
        link: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("LessonLink", lessonlinkSchema)