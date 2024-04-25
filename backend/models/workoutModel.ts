import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
}, {timestamps: true})

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    workoutType: {
        type: String,
        required: true
    },
    workout: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    restTime: {
        type: String,
        required: false
    },
    comment: [commentSchema]
}, {timestamps: true})

const Workout = mongoose.model('Workout', workoutSchema)

export default Workout;