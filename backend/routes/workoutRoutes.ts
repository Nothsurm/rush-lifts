import express from 'express';
import { authenticate } from '../middleware/authenticate';
import WorkoutController from '../controllers/WorkoutController';

const router = express.Router()

router.post('/createWorkout', authenticate, WorkoutController.createWorkout)
router.put('/updateWorkout/:id', authenticate, WorkoutController.updateWorkout)
router.delete('/deleteWorkout/:id', authenticate, WorkoutController.deleteWorkout)


export default router;