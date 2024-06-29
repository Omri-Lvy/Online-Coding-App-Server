import {connectDB, disconnectDB} from "../config/db";
import CodeBlockModel from '../models/CodeBlockModel';


describe('CodeBlockModel', () => {
    beforeAll(async () => {
        await connectDB();
    });

    it('should create a new codeBlock', async () => {
        const codeBlock = new CodeBlockModel({
            title: 'Test CodeBlockModel',
            code: 'console.log("Hello World")',
        });
        const savedCodeBlock = await codeBlock.save();
        expect(savedCodeBlock._id).toBeDefined();
        expect(savedCodeBlock.title).toBe('Test CodeBlockModel');
        expect(savedCodeBlock.code).toBeDefined();
        expect(savedCodeBlock.code).toBe('console.log("Hello World")');
    });

    it('should not create a CodeBlockModel without required fields', async () => {
        const codeBlock = new CodeBlockModel({});
        let error: Error | undefined;
        try {
            await codeBlock.save();
        } catch (err) {
            error = err as Error;
        }
        expect(error).toBeDefined();
        expect(error).toBeInstanceOf(Error);
    });

    afterAll(async () => {
        await CodeBlockModel.deleteOne({ title: 'Test CodeBlockModel' });
        await disconnectDB();
    });
});