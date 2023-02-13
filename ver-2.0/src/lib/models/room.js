import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        dealer: {
            type: String,
            required: true,
        },
        playerList: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Room', roomSchema);
