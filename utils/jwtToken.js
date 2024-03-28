const jwt = require("jsonwebtoken")

exports.getToken = async (req, res) => {
    const options = {
        id: req.user._id,
        time: Date.now(),
    }
    const user = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        avatar: req.user.avatar
    }
    try {
        const token = await jwt.sign(options, process.env.JWT_SECRET, { expiresIn: '100min' })
        if (!token) {
            return res.status(500).json({
                success: false,
                message: "failed to genarate token",
                isAuthenticatd: false
            })
        }
        res.status(200).cookie("token", token).json({
            success: true,
            message: "Login success",
            isAuthenticated: true,
            user,
            token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}