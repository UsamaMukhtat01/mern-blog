import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js'
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const mongoUrl = process.env.MONGO_URI
const run = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(mongoUrl === "mongodb://localhost:27017/" ? "connected to local MongoDB!": "connected to Atlas MongoDB!");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

const _dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

run().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

app.use(cors({
  origin: 'http://localhost:5173',  // Allow all origins (not recommended for production)
  // origin: '*',  // Allow all origins (not recommended for production)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)

app.use(express.static(path.join(_dirname, '/client/dist')));


app.get('*', (req, res) =>{
    res.sendFile(path.join(_dirname, 'client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
