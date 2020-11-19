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
        task: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
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
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Answer", answerSchema)