const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser")

app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

module.exports = app