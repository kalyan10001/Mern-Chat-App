import mongoose from "mongoose";
const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongodb");
    }
    catch(err)
    {
        console.log("error in db",err.message);
    }
};
export default connectToMongoDB;