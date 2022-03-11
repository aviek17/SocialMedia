const express = require('express');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const UserRoutes = require("./router/user")
const AuthRoutes = require("./router/auth")
const PostRoutes = require("./router/posts")

dotenv.config({path:"./.env"})

const port = process.env.PORT 
require("./DB/connection")

// Middlewares
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use("/api/users", UserRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/posts",PostRoutes)


app.listen(port,()=>{
    console.log(`Server running at ${port}`)
})