const mongoose = require("mongoose")

const dataBaseConnection = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then((data) => console.log(`data base running at ${data.connection.host}`))
        .catch((error) => console.log(error.message))
}
module.exports = dataBaseConnection