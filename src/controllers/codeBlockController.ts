import { Request, Response } from "express";
import CodeBlock, { ICodeBlock } from "../models/CodeBlockModel";

/*
* @desc Get all code blocks titles
* @route GET /code-blocks
* @access Public
* */
export const getCodeBlocksTitles = async (req: Request, res: Response): Promise<void> => {
    try {
        const codeBlocks: ICodeBlock[] = await CodeBlock.find({}, 'title _id');
        res.status(200).json(codeBlocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

/*
* @desc Get a code block by id
* @route GET /code-blocks/:id
* @access Public
 */
export const getCodeBlockById = async (req: Request, res: Response): Promise<void> => {
    try {
        const block: ICodeBlock | null = await CodeBlock.findById(req.params.id);
        const codeBlock = {
            _id: block?._id,
            title: block?.title,
            code: block?.code,
            instructions: block?.instructions,
            solution: block?.solution
        }
        if (!codeBlock) {
            res.status(404).json({ message: "Code Block not found" });
            return;
        }
        res.status(200).json(codeBlock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

/*
* @desc Get a code block by title
* @route GET /code-blocks/code-block/:title
* @access Public
 */
export const getCodeBlockByTitle = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.params.title) {
            res.status(400).json({message: "Title is required"});
            return;
        }
        const block: ICodeBlock | null = await CodeBlock.findOne({ title: req.params.title });
        const codeBlock = {
            _id: block?._id,
            title: block?.title,
            code: block?.code,
            instructions: block?.instructions,
            solution: block?.solution
        }
        if (!codeBlock) {
            res.status(404).json({ message: "Code Block not found" });
            return;
        }
        res.status(200).json(codeBlock);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}