import mongoose from 'mongoose';
import connectDB from '../config/db';

describe('Database Connection', () => {
    beforeAll(async () => {
        await connectDB();
    });

    it('should be connected to the database', () => {
        expect(mongoose.connection.readyState).toBe(1);
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });
});
