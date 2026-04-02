import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
            
        })
        let mongodbURI = process.env.MONGO_URI
        const projectName = 'Quickai'
        if(!mongodbURI){
            throw new Error("MONGO_URI environment variable not set");
        }
        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0,-1)
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`)
    }
    catch(error){
        console.log('Error connecting to MongoDB:',error)
    }
}

export default connectDB;