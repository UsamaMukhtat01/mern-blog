import express from 'express';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/').then(()=>{
    console.log('Database connected successfully')
}).catch(err =>{
    console.log(err)
})


const app = express();

app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})