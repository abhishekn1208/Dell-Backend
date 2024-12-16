const User = require("../model/user.model")
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { OAuth2Client } = require('google-auth-library');
var jwt = require('jsonwebtoken');
const blackList_token = require("../blackList token/blackList");
const socialUser = require("../model/socialLogin.model");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const registerUser=async(req,res)=>{
   try {
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(user) return res.status(401).json({msg : "User already exists"})
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const newUser = new User({...req.body,password : hashedPassword})
    await newUser.save()
    res.status(201).json(newUser)
   } catch (error) {
    res.status(501).json({msg : "Internal Server Error"})
   }
}

const loginUser=async(req,res)=>{
 try {
    const {email, password} = req.body
    const user = await User.findOne({email})
    if(!user) return res.status(401).json({msg : "User not found, Register first"})
    const storedPassword = user.password;
    const username = user.firstname
    const isPasswordMatched = bcrypt.compareSync(password,storedPassword)
    if(isPasswordMatched){
        const token = jwt.sign({userId : user._id, role : user.role},process.env.SECRET_KEY)
        return res.status(201).json({msg : "LoggedIn successfully",token,username})
    }else{
        res.status(401).json({msg : "Incorrect Password"})
    }
 } catch (error) {
    res.status(501).json({msg : "Internal Server Error"})
 }
}

const logoutUser=async(req,res)=>{
    const token = req.headers.authorization.split(" ")[1]
    blackList_token.push(token)
    res.send("Logged out successfully")

}

const GoogleLogin=async(req,res)=>{
    try {
        const {id_token} = req.body;
        console.log(id_token)
    // Verify the ID token with Google
    const ticket = await client.verifyIdToken({
        idToken : id_token,
        audience : process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const profilePicture = payload.picture

    let user = await socialUser.findOne({email});

    if(!user){
        user = new socialUser({
            email,
            name,
            profilePicture
        });
        await user.save()
    }

    res.json({
        message : "User logged in successfully", user
    })
    } catch (error) {
        console.error('Error verifying ID token:', error);
    res.status(400).json({ error: 'Invalid ID token' });
    }

}

module.exports = {registerUser,loginUser,logoutUser,GoogleLogin}