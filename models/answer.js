const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        timeAdded: {
            type: Date,
            required: false,
        },
        mark: {
            type: Number,
            required: false,
        },
        person: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        comments: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        materials: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        parentInstance: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Answer", answerSchema)