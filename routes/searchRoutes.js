const express = require("express")
const router = express.Router()
const { authToken } = require("../middleware/auth")
const { getSearchResult } = require("../controllers/searchControllers")


router.route("/:type/:query").get(authToken, getSearchResult)

module.exports = router


