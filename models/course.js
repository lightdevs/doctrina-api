const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
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
            required: true,
        },
        dateEnd: {
            type: Date,
            required: false,
        },
        maxMark: {
            type: Number,
            required: true,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)