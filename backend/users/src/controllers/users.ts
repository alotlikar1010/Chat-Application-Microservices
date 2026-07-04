import { TryCatch } from "../utils/TryCatch.js";
import { redisClient } from "../../index.js";
import { publishToQueue } from "../config/rabbitmq.js";
export const LoginUser = TryCatch(async (req, res) => {

    const { email } = req.body;
    const ratelimitKey = `otp:ratelimit:${email}`;
    const ratelimit = await redisClient.get(ratelimitKey);

    if (ratelimit) {
        res.status(429).json({
            message: `Please wait ${ratelimit} seconds before requesting OTP again`
        });
        return;
    }

    const otp = Math.floor(10000 + Math.random() * 900000)

    const otpKey = `otp:${email}`;

    await redisClient.set(otpKey, otp, {
        EX: 300,
    });

    await redisClient.set(ratelimitKey, "true", {
        EX: 60,
    })

    const message = {
        to: email,
        subject: "OTP for Login",
        body: `Your OTP is ${otp}. It is valid for 5 minutes`
    }

    await publishToQueue("send-otp", message)

    res.status(200).json({
        success: true,
        message: "OTP sent successfully"
    })
})