const mongoose = require("mongoose")
const Link = require("./link.js");

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
        lessons: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        materials: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        mark: {
            type: String,
            required: false
        },
        links: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
         },
        students: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)