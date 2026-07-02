import amqp from "amqplib";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();




let channel: any;
export const startSendOtpConsumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST!,
            port: 5672,
            username: process.env.RABBITMQ_USERNAME!,
            password: process.env.RABBITMQ_PASSWORD!,
        })

        channel = await connection.createChannel();

        const queueName = "send-otp"

        await channel.assertQueue(queueName, { durable: true });
        channel.consume(queueName, async (msg: any) => {

            if (msg) {

                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString())

                    const transporter = nodemailer.createTransport({
                        host: "smtp-gmail.com",
                        port: 465,
                        auth: {
                            user: process.env.USER!,
                            pass: process.env.PASS!
                        }
                    });
                    await transporter.sendMail({
                        from: process.env.USER!,
                        to,
                        subject,
                        html: body
                    })
                    channel.ack(msg);
                    console.log("Email sent successfully")
                }
                catch (error) {
                    console.log("Failed to send OTP", error);

                }
            }


        })

        console.log("connected to mail services...");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

export const publishToQueue = async (queueName: string, message: any) => {
    if (!channel) {
        console.log("Channel is not initialised")
    }
    await channel.assertQueue(queueName, {
        durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
}
