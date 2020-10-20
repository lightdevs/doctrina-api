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
            required: true,
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
            type: String,
            required: false,
        },
        accountType: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Person", personSchema)