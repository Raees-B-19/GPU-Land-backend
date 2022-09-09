const jwt = require("jsonwebtoken");
require ("dotenv").config();
module.exports = function (req,res,next){
// get token from header
const token = req.header("x-auth-token");
//check if not token
if (!token ) {
    return res.status(401).json ({ msg:"no token , authorisation denied"});
}
try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    req.user = decoded.user;
    next();
} catch (err){
    res.status(401).json ({msg:"token is not valid"});
}
};