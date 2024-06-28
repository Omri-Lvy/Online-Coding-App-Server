import mongoose, { Document, Schema } from "mongoose";

export interface ICodeBlock extends Document {
    title: string;
    code: string;
    instructions?: string;
}

const CodeBlockSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: false,
    },
});

const CodeBlock = mongoose.model<ICodeBlock>("CodeBlock", CodeBlockSchema);
export default CodeBlock;