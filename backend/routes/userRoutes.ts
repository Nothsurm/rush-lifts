import express from 'express';
import UserController from '../controllers/UserController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router()

router.post('/createUser', UserController.createUser)
router.put('/updateUser/:id', authenticate, UserController.updateUser)
router.delete('/deleteUser/:id', authenticate, UserController.deleteUser)
router.post('/loginUser', UserController.loginUser)
router.post('/logoutUser', UserController.logoutUser)

export default router;