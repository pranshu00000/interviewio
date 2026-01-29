import { Request, Response } from 'express';
import * as PollService from '../services/PollService';

export const getPolls = async (req: Request, res: Response) => {
    try {
        const polls = await PollService.getAllPolls();
        res.json(polls);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
