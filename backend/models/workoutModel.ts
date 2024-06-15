import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: false
    },
    comment: {
        type: String,
        required: false
    }
}, {timestamps: true})

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    exercise: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
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