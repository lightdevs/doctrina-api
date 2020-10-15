const mongoose = require("mongoose")

const courceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model("cource", courceSchema)