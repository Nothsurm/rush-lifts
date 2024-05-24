import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import bcrypt from 'bcryptjs';
import User from "../models/userModel";
import createToken from "../utils/createToken";
import jwt from 'jsonwebtoken';


const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        throw new Error('Please fill in all the inputs.')
    }

    const userExists = await User.findOne({email})
    if (userExists) res.status(400).send('User already exists')

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({ username, email, password: hashedPassword })

    try {
        await newUser.save()
        createToken(res, newUser._id);

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
})


export default {
    createUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser,
    google
}