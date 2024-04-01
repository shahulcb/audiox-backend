const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const { getToken } = require("../utils/jwtToken");
const asyncError = require('express-async-handler');
const cloudinary = require("../utils/cloudinary");


exports.signUp = asyncError(async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    const usernameExist = await userModel.findOne({ username })
    const emailExist = await userModel.findOne({ email })

    if (usernameExist) {
        return res.status(201).json({
            success: false,
            message: "username already taken"
        })
    }
    if (emailExist) {
        return res.status(201).json({
            success: false,
            message: "email already taken"
        })
    }

    if (password !== confirmPassword) {
        return res.status(201).json({
            success: false,
            message: "password desont match"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await userModel.create({ username, email, password: hashedPassword })
    if (!newUser) {
        return res.status(400).json({
            success: false,
            message: "Registration failed"
        })
    }
    res.status(201).json({
        success: true,
        message: "user created"
    })
})

exports.signIn = asyncError(async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username })
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "user not found"
        })
    }
    const isPassword = await bcrypt.compare(password, user.password)
    if (!isPassword) {
        return res.status(401).json({
            success: false,
            message: "password is incorrect"
        })
    }
    req.user = user
    getToken(req, res)
})

exports.updateProfile = asyncError(async (req, res) => {
    const { username, email } = req.body;
    const isUsernameExist = await userModel.findOne({ username, _id: { $ne: req.user_id } })
    if (isUsernameExist) {
        return res.status(400).json({
            success: false,
            message: "username is taken"
        })
    }
    const isEmailExist = await userModel.findOne({ email, _id: { $ne: req.user_id } })
    if (isEmailExist) {
        return res.status(400).json({
            success: false,
            message: "email is taken"
        })
    }
    const updatedUser = await userModel.findOneAndUpdate({ _id: req.user_id }, { username, email }, { new: true })
    if (!updatedUser) {
        return res.status(400).json({
            success: false,
            message: "user not updated"
        })
    }
    const user = {
        username: updatedUser.username,
        email: updatedUser.email
    }
    res.status(200).json({
        success: true,
        message: "user updated",
        user
    })
})

exports.updateAvatar = asyncError(async (req, res) => {
    const userResult = await cloudinary.uploader.upload(req.file.path, { folder: 'audiox/avatar', resource_type: 'auto' })
    const updatedUser = await userModel.findByIdAndUpdate(req.user_id, { avatar: userResult.secure_url }, { new: true })
    const user = {
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar
    }
    res.status(200).json({
        success: true,
        message: "Avatar updated",
        user
    })
})

exports.removeAvatar = asyncError(async (req, res) => {
    const updatedUser = await userModel.findByIdAndUpdate(req.user_id, { avatar: '' }, { new: true })
    const user = {
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: ''
    }
    res.status(200).json({
        success: true,
        message: "Avatar removed",
        user
    })
})

exports.logout = (req, res) => {
    res.cookie("token", '').json({ message: 'Logout success' })
}