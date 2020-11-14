const mongoose = require("mongoose")

const linkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: false,
        },
        link: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Link", linkSchema)