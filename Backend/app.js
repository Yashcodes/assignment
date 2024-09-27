import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import mongoConnect from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

dotenv.config();

//! Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

//! Connecting to MongoDB Database
mongoConnect();

//! Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employee", employeeRoutes);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size is too large. Max size is 1MB.",
      });
    }
  } else if (err.message === "Only PNG, JPG files are allowed") {
    return res.status(400).json({
      success: false,
      message: "Invalid file format. Only PNG, JPG are allowed.",
    });
  } else if (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "An unknown error occurred.",
    });
  }

  next();
});

//! Routes
app.get("/", (req, res) => {
  console.log(process.env.PORT);
  res.send("Hello express");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is listening on port 5000");
});
