import express from 'express';
import dotenv from 'dotenv';
import { startSendOtpConsumer } from "./src/consumer.js";
dotenv.config();
const app = express();

startSendOtpConsumer();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Mail Service is running on port ${PORT}`);
});
