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
                email: newUser.email, 
            });
    } catch (error) {
        res.status(400)
        throw new Error('Invalid user data')
    }
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword;
        }

        const updatedUser = await user.save()
        res.json ({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,         
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
                email: existingUser.email, 
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
    try {
        const user  = await User.findOne({ email: req.body.email })
        if (user) {
            createToken(res, user._id);
            res.status(200).json({ email: user.email});
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // e.g. 0.ghft65365... 16 letter password
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User({ 
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, 
                password: hashedPassword, 
            })
            await newUser.save();
            createToken(res, newUser._id);
            res.status(200).json({ email: newUser.email })
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