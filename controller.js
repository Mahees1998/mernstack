import { User } from "./module.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import sendMail from "./middleware/setmail.js"


export const registerUser= async (req,res)=>{
    try {
        const {name, email, password, contact}= req.body
        
        let user = await User.findOne({email});
        if(user){
            res.status(400).json({
                message:"User email is already registered"
            })
        }

        const hashpassword =await bcrypt.hash(password, 10)

        const otp = Math.floor(Math.random()*1000000)
         user= {name, email, hashpassword, contact}
        const activationToken = jwt.sign({user,otp}, process.env.ACTIVATION_SECRET,{
            expiresIn:"5m"
        })
         
        const message = `Please verify your otp ${otp}`
        await sendMail(email, "Welcome to our page", message);
         
        res.status(200).json({
           message:"Otp Sent  to your email",
           activationToken,
        });
           



    } catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}

// verify otp
export const verifyUser = async (req,res)=>{
      try {
        const {otp, activationToken}= req.body
        const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);

        if(!verify){
            return res.json({
                message: "Otp is expired"

            })
        }
        if(verify.otp !== otp){
           return res.json({
        message:"Otp is Wrong"
           })
        }

        await User.create({
            name:verify.user.name,
            email:verify.user.email,
            password:verify.user.hashpassword,
            contact:verify.user.conact,
        })

      return  res.status(200).json({
            message:"User is Registeredd succesfully"
        })
      } catch (error) {
       return  res.status(500).json({
            message:error.message,
        })
      }
} 

//login user

export  const loginUser =async  (req,res)=>{
     try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!User){
            return res.status(400).json({
                message:"Invalid Credentials"
            })
        }

        //check password
        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword){
            return res.status(400).json({
                message:"Invalid Credentials",
            });
        }

    //Generate signed token
        const token = jwt.sign({_id: user.id},process.env.JWT_SECRET,{ecpiresIn:"15d"})
        return res.status(200).json({
            message:"Welcome" +user.name,
            token,
            user,
        })
     } catch (error) {
        return res.status(500).json({
            message:error.message
        })
     }
}


