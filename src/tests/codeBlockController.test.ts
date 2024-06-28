import request from 'supertest';
import {connectDB, disconnectDB} from "../config/db";
import CodeBlockModel from "../models/CodeBlockModel";
import app from "../app";

describe('CodeBlockModel Controller', () => {
    beforeAll(async () => {
        await connectDB();
    });


    it('should get all code blocks', async () => {
        const res = await request(app).get('/code-blocks');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(10);
        expect(res.body[0]).toHaveProperty('title', 'Hello World');
        expect(res.body[1]).toHaveProperty('title', 'Variables and Data Types');
    });

    it('should get a code block by ID', async () => {
        const codeBlock = await CodeBlockModel.findOne({ title: 'For Loop' });
        const res = await request(app).get(`/code-blocks/${codeBlock?._id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('For Loop');
        expect(res.body.code).toBe('for (let i = 0; i < 5; i++) {\n  console.log(i);\n}');
        expect(res.body.instructions).toBe('Write a for loop that prints numbers from 0 to 4 to the console.');
    });

    it('should return 404 for non-existent code block', async () => {
        const res = await request(app).get('/code-blocks/60c72b2f9b7e8e1d088b4571');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Code Block not found');
    });

    afterAll(async () => {
        await disconnectDB();
    });
});