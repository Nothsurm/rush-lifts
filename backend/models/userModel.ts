import mongoose from 'mongoose';

const userSchema = new mongoose.Schema ({
    username: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    profilePicture: {
        type: String,
        //if User doesn't have an image, use image below
        default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },

    verified: {
        type: Boolean,
        default: false,
        required: true,
    },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;