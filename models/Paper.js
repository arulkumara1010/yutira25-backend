import { Schema, model } from "mongoose";

const PaperSchema= new Schema({
    paperId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

export default model("Paper", PaperSchema, "yutira-2025-paper");
