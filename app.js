const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const bodyParser = require("body-parser")

app.use(cors({ credentials: true, origin: true }))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

module.exports = app