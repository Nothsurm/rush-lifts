import { Response } from 'express';
import jwt from 'jsonwebtoken';

const generateToken = (res: Response, userId: Object) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET as string, {expiresIn: '30d'});

    //Set JWT as an http-only cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'strict',
        maxAge: 30* 24 * 60 * 60 * 1000
    })

    return token
};

export default generateToken;