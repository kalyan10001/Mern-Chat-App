import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetcookie from "../utils/generateToken.js";
export const signup=async(req,res)=>{
    try{
        const {fullname,username,password,confirmpassword,gender}=req.body;

        if(password!==confirmpassword)
            {
                return res.status(400).json({error:"password not match"});
            }

        const user=await User.findOne({username});

        if(user)
            {
                return res.status(400).json({error:"user already exists"});
            }

            const salt=await bcryptjs.genSalt(10);
            const hashedpassword=await bcryptjs.hash(password,salt);

            const boyprofilepic='https://avatar.iran.liara.run/public/boy?username=${username}'
            const girlprofilepic='https://avatar.iran.liara.run/public/girl?username=${username}'

            const newUser= new User({
                fullname:fullname,
                username:username,
                password:hashedpassword,
                gender:gender,
                profilepic:gender==="male"?boyprofilepic:girlprofilepic,
            });

        if(newUser)
        {
            await newUser.save();

            generateTokenAndSetcookie(newUser._id,res);
            res.status(201).json({
                _id:newUser._id,
                fullname:newUser.fullname,
                username:newUser.username,
                profilepic:newUser.profilepic
            });
        }
        else
        {
            res.status(400).json({error:"invalid user data"});
        }

    }catch(error){
        console.log("error in signup controller",error.message)
        res.status(500).json({error:"internal server error"})
    }
}

export const login=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        const IspassCorrect=await bcryptjs.compare(password,user?.password||"");
        if(!user || !IspassCorrect)
            {
                return res.status(400).json({error:"invalid username or password"});
            }

            generateTokenAndSetcookie(user._id,res);

            res.status(201).json({
                _id:user._id,
                fullname:user.fullname,
                username:user.username,
                profilepic:user.profilepic
            });

    }
    catch(error){
        console.log("error in login controller",error.message);
        res.status(500).json({error:"internal server error"});
    }
}

export const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:"0"});
        res.status(500).json({message:"logged out successfully"});
    }
    catch(error)
    {
        console.log("error in logout controller");
        res.status(500).json({error:"internal server error"});
    }
}