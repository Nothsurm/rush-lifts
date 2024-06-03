import mongoose, { Document } from "mongoose";
import bcrypt from 'bcrypt'

export interface Token extends Document {
    owner: mongoose.Schema.Types.ObjectId,
    token: string,
    createdAt: Date,
    compareToken: any,
}

const verifyTokenSchema = new mongoose.Schema<Token>({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
});

verifyTokenSchema.pre('save', async function (next) {
    if (this.isModified('token')) {
        const hash = await bcrypt.hash(this.token, 8)
        this.token = hash
    }
    next()
})

verifyTokenSchema.methods.compareToken = async function (token: any) {
    const result = await bcrypt.compareSync(token, this.token)
    return result;
}

const VerifyToken = mongoose.model('VerifyToken', verifyTokenSchema)

export default VerifyToken;