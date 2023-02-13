import { MONGO_URL } from '$env/static/private';
import mongoose from 'mongoose';

export async function connectDB () {
    return await mongoose.connect(MONGO_URL);
}

export async function disconnectDB() {
    return await mongoose.disconnect();
}

export async function interactDB(func) {
    await connectDB();
    const value = await func();
    await disconnectDB();
    return value;
}
