import mongoose from "mongoose";
const connectDB = async () => {
    const url = process.env.MONGO_URI;
    if (!url) {
        throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(url);
    console.log("MongoDB connected");
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("error while connecting to mongoDB ", error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map