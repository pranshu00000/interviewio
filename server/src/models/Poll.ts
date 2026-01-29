import mongoose, { Document, Schema } from 'mongoose';

export interface IPollOption {
    text: string;
    votes: number;
}

export interface IPoll extends Document {
    question: string;
    options: IPollOption[];
    startTime: Date | null;
    duration: number; // in seconds
    isActive: boolean;
    createdAt: Date;
}

const PollSchema: Schema = new Schema({
    question: { type: String, required: true },
    options: [
        {
            text: { type: String, required: true },
            votes: { type: Number, default: 0 },
        },
    ],
    startTime: { type: Date, default: null },
    duration: { type: Number, default: 60 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPoll>('Poll', PollSchema);
