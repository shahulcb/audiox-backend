const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    title: String,
    genre: String,
    filePath: String,
    bgImage: String,
    uploadDate: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model("Song", songSchema)