import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import Workout from "../models/workoutModel";

const createWorkout = asyncHandler(async (req: Request, res: Response) => {
    try {
        await Workout.create(req.body)
        return res.status(201).json({ message: 'Workout successfully added' })
    } catch (error) {
        res.status(400)
        throw new Error('Invalid workout data')
    }
});

const updateWorkout = asyncHandler(async (req: Request, res: Response) => {
    const workout = await Workout.findById(req.params.id)

    if (workout) {
        workout.name = req.body.name || workout.name
        workout.workoutType = req.body.workoutType || workout.workoutType
        workout.workout = req.body.workout || workout.workout
        workout.sets = req.body.sets || workout.sets
        workout.reps = req.body.reps || workout.reps
        workout.restTime = req.body.restTime || workout.restTime

        const updateWorkout = await workout?.save()
    res.json({
        name: updateWorkout?.name,
        workoutType: updateWorkout?.workoutType,
        workout: updateWorkout?.workout,
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

export default {
    createWorkout,
    updateWorkout,
    deleteWorkout
}