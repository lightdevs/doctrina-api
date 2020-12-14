const mongoose = require("mongoose")

const groupSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        courses: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        lessons: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        tasks: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Group", groupSchema)