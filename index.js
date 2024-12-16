const express = require("express")
require('dotenv').config()
const { OAuth2Client } = require('google-auth-library');
var cors = require('cors')  
const connect = require("./config/db")
const app = express()
const UserRouter = require("./Router/user.router")
app.use(express.json())

app.use(cors({
    origin : 3000
}))

app.use("/user",UserRouter)

app.get("/health",(req,res)=>{
    console.log("Hi OKKKK")
    res.send("OK")
})

app.listen(process.env.PORT,async(req,res)=>{
    await connect()
    console.log(`Listeninig on port : ${process.env.PORT}`)
})