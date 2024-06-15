import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Workout from "../models/workoutModel";

const createWorkout = asyncHandler(async (req: Request, res: Response) => {
    try {
        const workout = new Workout({
            userId: req.user,
            exercise: req.body.exercise,
            weight: req.body.weight,
            sets: req.body.sets,
            reps: req.body.reps,
            restTime: req?.body?.restTime
        })
        await workout.save()
        return res.status(201).json({ success: true, message: 'Workout successfully added' })
    } catch (error) {
        res.status(400)
        return res.json({ success: false, message: 'Invalid workout data'})
    }
});

const updateWorkout = asyncHandler(async (req: Request, res: Response) => {
    const workout = await Workout.findById(req.params.id)

    if (workout) {
        workout.exercise = req.body.name || workout.exercise
        workout.weight = req.body.name || workout.weight
        workout.sets = req.body.sets || workout.sets
        workout.reps = req.body.reps || workout.reps
        workout.restTime = req.body.restTime || workout.restTime

        const updateWorkout = await workout?.save()
    res.json({
        exercise: updateWorkout?.exercise,
        weight: updateWorkout?.weight,
        sets: updateWorkout?.sets,
        reps: updateWorkout?.reps,
        restTime: updateWorkout?.restTime
    })
    } else {
        res.status(404)
        throw new Error('Workout not found.')
    }
});

const deleteWorkout = asyncHandler(async (req: Request, res: Response) => {
    const workout = await Workout.findById(req.params.id)

    if (workout) {
        await Workout.deleteOne({ _id: workout._id })
        res.json({ message: 'Workout Deleted' })
    } else {
        res.status(404)
        throw new Error('Workout not found')
    }
});

const getMyWorkouts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const workouts = await Workout.find({userId: req.user})
        res.json(workouts)
    } catch (error) {
        res.status(500).json({ success: false, message: "This User has not saved any workouts yet"})
    }
});



export default {
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getMyWorkouts
}