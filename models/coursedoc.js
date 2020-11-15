const mongoose = require("mongoose")

const coursedocSchema = new mongoose.Schema(
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
        documentName: {
            type: String,
            required: false,
        },
        documentLink: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("CourseDoc", coursedocSchema)