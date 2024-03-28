const app = require("./app")
const dotenv = require("dotenv");
const dataBaseConnection = require("./config/dataBaseConnection");
const userRoutes = require("./routes/userRoutes")
const songRoutes = require("./routes/songRoutes")
const playlistRoutes = require("./routes/playlistRoutes")
const searchRoutes = require("./routes/searchRoutes")
const ratingRoutes = require("./routes/ratingRoutes")
const commentRoutes = require("./routes/commentRoutes")

dotenv.config();
dataBaseConnection()

app.use("/api/user", userRoutes)
app.use("/api/song", songRoutes)
app.use("/api/playlist", playlistRoutes)
app.use("/api/search", searchRoutes)
app.use("/api/rating", ratingRoutes)
app.use("/api/comment", commentRoutes)

app.listen(process.env.PORT, () => {
    console.log(`server running at port : ${process.env.PORT}`);
})