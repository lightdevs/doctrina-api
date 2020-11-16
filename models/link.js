const mongoose = require("mongoose")

const linkSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: false,
        },
        link: {
            type: String,
            required: true
        },
        parentInstance: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },
        parentType: {
            type: String,
            required: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Link", linkSchema)