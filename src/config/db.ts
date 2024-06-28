import mongoose, { ConnectOptions } from "mongoose";

const connectDB = async (): Promise<void> => {
    try {
        const mongoURI: string = process.env.MONGO_URI as string;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as ConnectOptions);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
    }
}

export default connectDB;