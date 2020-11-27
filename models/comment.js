const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        person: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        parentInstance: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        timeAdded: {
            type: Date,
            required: false,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Comment", commentSchema)