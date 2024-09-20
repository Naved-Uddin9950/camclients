import db from "../connection.js";
import useRandom from '../helpers/useRandom.js';

export const StartLiveStream = async (req, res) => {
    // const bearer = req.headers.authorization.split(' ');
    // const token = bearer[bearer.length - 1];
    const { username, price, title, categories, startTime, thumbnail, status, model } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const key = useRandom(username);
    const data = { key, price, title, categories, startTime, thumbnail, status, model }

    res.status(200).json({ data });
};