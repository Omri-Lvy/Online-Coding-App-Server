import mongoose from "mongoose";

export const connectDB = async (dbName: string = 'test'): Promise<void> => {
    try {
        const mongoURI: string = (process.env.MONGO_URI as string).replace('<dbName>', dbName);
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(mongoURI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
    }
}

export const disconnectDB = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log("MongoDB Disconnected");
    } catch (error) {
        console.error((error as Error).message);
        process.exit(1);
    }
}
