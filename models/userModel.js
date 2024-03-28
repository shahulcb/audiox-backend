const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: [5, 'username must be at least 5 characters'],
        maxLength: [30, 'username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String
    }
})

module.exports = mongoose.model("User", userSchema)