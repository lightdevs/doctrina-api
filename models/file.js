const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        mimetype: {
            type: String,
            required: false
        },
        hash: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: false,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("File", fileSchema)