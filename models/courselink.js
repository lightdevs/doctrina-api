const mongoose = require("mongoose")

const courselinkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        course: {
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
            type: Number,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("CourseLink", courselinkSchema)