const jwt=require("jsonwebtoken")

const createToken=(data)=>{
    try {
        const token=jwt.sign(data,process.env.JWT_SECRET_KEY)
        return token 
    } catch (error) {
        console.log(error);
    }
}

function verifyToken(req,res,next){
    let token=req.header["authorization"]

    if(token){
        token=token.split(" ")[1]
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,valid)=>{
            if(err){
                res.status(401).send("enter valid token");
            }
            else{
                req.user=valid;
                next();
            }
        })
    }
    else{
        res.status(402).send("add token in header")
    }
}

function decodejwt(token){
    const decode=jwt.verify(token.split(" ")[1],process.env.JWT_SECRET_KEY)
    return decode
}

module.exports={createToken,verifyToken,decodejwt}