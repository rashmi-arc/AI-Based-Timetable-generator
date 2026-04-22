const jwt = require("jsonwebtoken");

exports.auth = (req,res,next)=>{

try{

const authHeader = req.headers.authorization;

if(!authHeader){
return res.status(401).json({message:"No token provided"});
}

const token = authHeader.split(" ")[1];

if(!token){
return res.status(401).json({message:"Invalid token"});
}

const decoded = jwt.verify(token,"secretkey");

req.user = decoded;

next();

}catch(err){

console.error("AUTH ERROR:",err);

return res.status(401).json({message:"Unauthorized"});
}

};


/* ROLE CHECK */
exports.role = (...roles)=>{

return (req,res,next)=>{

if(!roles.includes(req.user.role)){
return res.status(403).json({message:"Forbidden"});
}

next();

};

};