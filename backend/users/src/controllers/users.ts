import { TryCatch } from "../utils/TryCatch.js";
import { redisClient } from "../../index.js";
import { User } from '../model/index.js';
import { publishToQueue } from "../config/rabbitmq.js";
import { generateToken } from "../config/generateToken.js";
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
});

export const verifyOTP = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;

    if (!email || !enteredOtp) {
        res.status(400).json({
            message: "Email and OTP Required"
        });
        return;
    }

    const OtpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(OtpKey);

    if (!storedOtp) {
        res.status(404).json({
            message: "OTP Not Found or Expired"
        })
        return;
    }

    if (storedOtp != enteredOtp) {
        res.status(401).json({
            message: "Invalid OTP"
        })
        return;
    }
    await redisClient.del(OtpKey);

    let user = await User.findOne({ email });
    if (!user) {
        const name = email.slice(0, 8)
        user = await User.create({ name, email });
    }

    const token = generateToken(user);

    res.json({
        message: "User Verified",
        user, token
    })
});