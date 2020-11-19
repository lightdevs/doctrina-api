const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
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
        },
        parentInstance: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Task", taskSchema)