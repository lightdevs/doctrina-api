const mongoose = require("mongoose")

const {Course} = require("./course")
const {File} = require("./file")

const personSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        institution: {
            type: String,
            required: false,
        },
        description: {
            type: String,
            required: false,
        },
        photo: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        accountType: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: false
        },
        coursesTakesPart: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true
        },
        coursesConducts: {
            type: [mongoose.Schema.Types.ObjectId],
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Person", personSchema)