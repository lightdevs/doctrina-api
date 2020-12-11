const mongoose = require("mongoose")

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
        answers: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false,
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
        },
        groups: {
            type: [mongoose.Schema.Types.ObjectId],
            required: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Person", personSchema)