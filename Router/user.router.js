const express = require("express")
const routes = express.Router()
const {registerUser,loginUser,logoutUser,GoogleLogin} = require("../collections/user.collections")

routes.post("/register",registerUser)
routes.post("/login",loginUser)
routes.get("/logout",logoutUser)

//login with google
routes.post("/auth/google",GoogleLogin)

module.exports = routes