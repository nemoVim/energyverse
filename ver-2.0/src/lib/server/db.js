import { MONGO_URL } from '$env/static/private';
import mongoose from 'mongoose';

export async function connectDB () {
    console.log('mongo');
    return await mongoose.connect(MONGO_URL);
}

export async function disconnectDB() {
    return await mongoose.disconnect();
}