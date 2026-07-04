import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { createClient } from "redis";
import userRoutes from "./src/routes/index.js"
import { connectRabbitMQ } from "./src/config/rabbitmq.js";
dotenv.config();
const app = express();
const port = 5000;

app.use(express.json())
app.use("api/v1", userRoutes);

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
// Redis Connection 
export const redisClient = createClient({
    url: process.env.REDIS_URL!,
});

redisClient.connect().catch((error) => {
    console.error("error while connecting to redis ", error);
    process.exit(1);
});
// RabbitMQ Connection
connectRabbitMQ();