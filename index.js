const express =  require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("Successfully connected to DB"))


// MIDDLEWARES
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.listen(8800, () => console.log("Backend server is running"))
