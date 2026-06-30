import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
dotenv.config();
const app = express();
const port = 5000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error("error while connecting to mongoDB ", error);
        process.exit(1);
    });
