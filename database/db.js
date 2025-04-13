import mongoose from 'mongoose'

const ConnectDB =async ()=>{
    try {
        await mongoose.connect(process.env.DB)
        console.log("Database Connected");
        
    } catch (error) {
        console.log("Database not connected",error)
    }
}

export default ConnectDB