import mongoose from 'mongoose';

const connectDB = async () => {
  
    try {
        await mongoose.connect(process.env.MONGODB_STRING as string)
        console.log('Successfully connected to mongoDB');
    } catch (error: any) {
        console.error(`Error ${error.message}`)
        process.exit(1)
    }
}

export default connectDB;