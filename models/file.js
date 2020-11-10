const mongoose = require("mongoose")

const fileSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: false,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("File", fileSchema)