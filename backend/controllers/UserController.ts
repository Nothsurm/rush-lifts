import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import bcrypt from 'bcryptjs';
import User from "../models/userModel";
import createToken from "../utils/createToken";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'
import { generateOTP, sendEmail } from "../utils/email";
import VerifyToken from "../models/verifyTokenModel";
import { isValidObjectId } from "mongoose";


const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        throw new Error('Please fill in all the inputs.')
    }

    const userExists = await User.findOne({email})
    if (userExists) res.status(400).send('User already exists')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({ 
        username, 
        email, 
        password: hashedPassword 
    })

    const OTP = generateOTP()
    const verificationToken = new VerifyToken({
        owner: newUser._id,
        token: OTP
    })

    try {
        await verificationToken.save()
        await newUser.save()
        createToken(res, newUser._id);

        await sendEmail({
            email: newUser.email,
            subject: 'Verify your email account',
            message: `${OTP}`,
        })

        res.status(201)
            .json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email, 
                profilePicture: newUser.profilePicture
            });
    } catch (error) {
        res.status(400)
        throw new Error('Invalid user data')
    }
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)
    const { username, email, password, profilePicture } = req.body

    if (user) {
        if (username) {
            if (username.length <= 5 || username.length >= 20) {
                throw new Error('Username must be between 6 and 20 characters')
            }
        }
        user.username = username || user.username
        user.email = email || user.email
        user.profilePicture = profilePicture || user.profilePicture

        if (password) {
            if (password.length <= 5) {
                throw new Error('Password must be at least 6 characters long')
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword;
        }

        const userExists = await User.findOne({email})
        if (userExists) res.status(400).json({ message: 'Email already exists'})

        const updatedUser = await user.save()
        res.json ({
            _id: updatedUser._id,
            username: updatedUser.username,
            profilePicture: updatedUser.profilePicture,
            email: updatedUser.email,       
        })
    } else {
        res.status(404)
        throw new Error('User not found.')
    }
})

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)

    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error('Cannot delete admin user')
        }

        await User.deleteOne({_id: user._id})
        res.json({message: 'User removed'})
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new Error('Please fill in all the inputs.')
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        throw new Error("Email doesn't exist")
    }

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordValid) {
            throw new Error('Password is incorrect')
        } else {
            createToken(res, existingUser._id)

            res.status(201)
            .json({ 
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email, 
                profilePicture: existingUser.profilePicture
            });
            return;
        }
    }
})

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({message: 'logout successfull'})
})

const google = asyncHandler(async (req: Request, res: Response) => {
    const { email, googlePhotoUrl } = req.body
    try {
        const user  = await User.findOne({ email })
        if (user) {
            createToken(res, user._id);
            res.status(200).
            json({ 
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // e.g. 0.ghft65365... 16 letter password
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({ 
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), 
                email,
                password: hashedPassword, 
                profilePicture: googlePhotoUrl,
            })
            await newUser.save();
            createToken(res, newUser._id);
            res.status(200)
            .json({ 
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            })
        }
    } catch (error) {
        res.status(400)
        throw new Error('Invalid google data')
    }
});

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const {email} = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            throw new Error("User hasn't been registered")
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '10m'})

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.NODEMAILER_EMAIL,
              pass: process.env.NODEMAILER_PASS,
            },
          });

          let mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'Reset Password',
            text: 'Please clink the link below to reset your password, this link will expire in 10 minutes ' + `http://localhost:5173/resetPassword/${token}`
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                return res.json({ message: 'error sending Email'})
            } else {
                return res.json({ success: true, message: 'Email Sent'})
            }
        });
    } catch (error) {
        return res.json({ success: false, message: 'This Email has not been registered'})
    }
})

interface JwtPayload {
    id: string
  }

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const {token} = req.params;
    const {password} = req.body

    if (password === '') {
        return res.json({ success: false, message: 'Please enter a password'})
    }
    if (password) {
        if (password.length <= 5) {
            return res.json({ success: false, message: 'Password must be at least 6 characters long'})
        }
    }

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
        const id = decoded.id;
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate({_id: id}, {password: hashedPassword})
        return res.json({ status: true, message: "Updated Password Successfully"})
    } catch (error) {
        return res.json({ success: false, message: 'Your session has expired'})
    }
})

const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { otp, userId } = req.body

    if (!userId || !otp.trim()) {
        return res.json({ success: false, message: 'Please enter a valid email address'})
    }

    if(!isValidObjectId(userId)) {
        return res.json({ success: false, message: 'Invalid User'})
    }

    const user = await User.findById(userId)
    if (!user) {
        return res.json({ success: false, message: 'User not found'})
    }
    if (user.verified) {
        return res.json({ success: false, message: 'This User is already verified'})
    }

    const token = await VerifyToken.findOne({owner: user._id})
    if (!token) {
        return res.json({ success: false, message: 'User not found'})
    }

    const isMatched = await token.compareToken(otp)
    if (!isMatched) {
        return res.json({ success: false, message: 'Please provide a valid token'})
    }

    user.verified = true;
    
    try {
        await VerifyToken.findByIdAndDelete(token._id)
        await user.save()

        await sendEmail({
            from: 'emailverification@email.com',
            email: user.email,
            subject: 'Email verified successfully',
            message: `Your Email Verified Successfully`
        });

        res.status(200).json({ success: true, message: 'Email successfully verified'})
    } catch (error) {
        res.status(404)
        return res.json({ success: false, message: 'Something went wrong'})
    }
})

const resendEmail = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body
    
    const user = await User.findOne({email})
        if (!user) {
            return res.json({ success: false, message: "This Email hasn't been registered"})
        }

        if (user.verified) {
            return res.json({ success: false, message: 'This User is already verified'})
        }
    const token = await VerifyToken.findOne({owner: user._id})
    await VerifyToken.findByIdAndDelete(token?._id)

    try {
        const OTP = generateOTP()
        const verificationToken = new VerifyToken({
            owner: user._id,
            token: OTP
        })

        await verificationToken.save()
        await sendEmail({
            email: user.email,
            subject: 'Verify your email account',
            message: `${OTP}`,
        })

        res.status(200).json({ success: true, message: 'OTP password successfully sent'})
    } catch (error) {
        res.status(400)
        return res.json({ success: false, message: 'Invalid user data'})
    }
})


export default {
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    google,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendEmail
}