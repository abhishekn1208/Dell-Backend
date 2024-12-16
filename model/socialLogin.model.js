const mongoose = require("mongoose")

const GoogleLoginSchema = new mongoose.Schema({
   name:{
    type : String
   },
    email :{
        type : String,
        required : true,
        unique : true
    },
    profilePicture :{
        type : String
    },
    role :{
        type : String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

const socialUser = mongoose.model("socialUser", GoogleLoginSchema)
module.exports = socialUser