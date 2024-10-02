import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        requires: true,
        unique: true,
    },
    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required: true,
    },
}, {timestamps: true})

// Creating models 
const User = mongoose.model('User', userSchema);

export default User;