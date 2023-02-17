import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        energyList: {
            type: [Number],
            default: [],
        },
        fuelList: {
            type: Array,
            default: [],
        },
        unitList: {
            type: Array,
            default: [],
        },
        buildingList: {
            type: Array,
            default: [],
        },
        temp: {
            type: Number,
            default: 0,
        },
        round: {
            type: Number,
            default: 1,
        },
        turn: {
            type: Number,
            default: 0,
        },
        first: {
            type: Number,
            default: 0,
        },

    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Game', gameSchema);
