const mongoose = require("mongoose")
const {Person} = require("./person")

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
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
         },
        students: {
            type: [Person],
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)