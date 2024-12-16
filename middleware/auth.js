var jwt = require("jsonwebtoken");

const auth = (req,res,next)=>{
 try {
    const token = req.headers.authorization.split(" ")[1]
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if(decoded){
      req.userId = decoded.userId;
      req.role = decoded.role
  
      next()
    }else{
      res.json({msg : "Unauthorized"})
    }
 } catch (error) {
    res.send("Error in Authentication")
 }
 } 

 module.exports = auth