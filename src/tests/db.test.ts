import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';

describe('Database Connection', () => {
    beforeAll(async () => {
        await connectDB();
    });

    it('should be connected to the database', (done) => {
        expect(mongoose.connection.readyState).toBe(1);
        done();
    });

    afterAll(async () => {
        await disconnectDB();
    });
});
