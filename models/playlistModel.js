const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    title: {
        type: String
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Playlist", playlistSchema)
