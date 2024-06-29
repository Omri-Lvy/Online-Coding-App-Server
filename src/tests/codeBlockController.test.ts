import request from 'supertest';
import {connectDB, disconnectDB} from "../config/db";
import CodeBlockModel from "../models/CodeBlockModel";
import server from "../server";

describe('CodeBlockModel Controller', () => {
    beforeAll(async () => {
        await connectDB();
    });

    it('should get all code blocks', async () => {
        const res = await request(server).get('/code-blocks');
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(8);
        expect(res.body[0]).toHaveProperty('title', 'JavaScript Data Types');
        expect(res.body[1]).toHaveProperty('title', 'JavaScript Arithmetic Operators');
    });

    it('should get a code block by ID', async () => {
        const codeBlock = await CodeBlockModel.findOne({ title: 'For Loop' });
        const res = await request(server).get(`/code-blocks/${codeBlock?._id}`);
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('For Loop');
        expect(res.body.code).toBe('// Your code here');
        expect(res.body.instructions).toBe('Write a for loop that iterates from 0 to 4. Inside the loop, use console.log to print each number.');
        expect(res.body.solution).toBe('// Your code here\nfor (let i = 0; i < 5; i++) {\nconsole.log(i)\n}');
    });

    it('should return 404 for non-existent code block', async () => {
        const res = await request(server).get('/code-blocks/60c72b2f9b7e8e1d088b4571');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Code Block not found');
    });
});