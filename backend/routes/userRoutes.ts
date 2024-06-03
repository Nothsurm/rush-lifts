import express from 'express';
import UserController from '../controllers/UserController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router()

router.post('/createUser', UserController.createUser)
router.put('/updateUser/:id', authenticate, UserController.updateUser)
router.delete('/deleteUser/:id', authenticate, UserController.deleteUser)
router.post('/loginUser', UserController.loginUser)
router.post('/logoutUser', UserController.logoutUser)
router.post('/forgotPassword', UserController.forgotPassword)
router.post('/resetPassword/:token', UserController.resetPassword)
router.post('/verify-email', UserController.verifyEmail)
router.post('/resend-email', UserController.resendEmail)


router.post('/google', UserController.google)

export default router;