import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'

const MONGO_URI =process.env.MONGO_URI

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("MongoDB connected")
    } catch (error) {
        console.error('MongoDb connection Error', error)
        process.exit(1)
    }
}

export default connectDb