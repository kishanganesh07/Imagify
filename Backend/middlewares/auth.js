import jwt from "jsonwebtoken";
const userAuth=async(req,res,next)=>{
    const token=req.headers.token 
        if(!token){
            return res.status(401).json({success:false,message:"Not Authorized. Please Login Again"})
        }
    try{
        const tokenDecode=jwt.verify(token,process.env.JWT_SECRET);
        
        if(tokenDecode.id){
            if (!req.body) {
                req.body = {};
            }
            req.body.userId=tokenDecode.id;
            
        }
        else{
            return res.status(401).json({success:false,message:"Not Authorized. Login Again"})

        }
        next();
        
    }catch(error){
        console.log(error)
        res.status(401).json({success: false,message:"Not Authorized. Please Login Again"})

    }

}
export default userAuth;