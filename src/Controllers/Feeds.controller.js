import db from "../connection.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import useTableCheck from "../helpers/useTableCheck.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GetFeeds = async (req, res) => {
};


export const PostFeeds = async (req, res) => {
    const { content } = req.body;

    // Validate input
    if (!content) {
        return res.status(400).json({ error: "Content is required." });
    }

    // Constant values for other fields
    const performerId = 'e36ee2c9-7734-11ef-b7c0-a0481cde65a0'; // Replace with the actual performer ID as needed
    const feeds = "Default Feed"; // Set the default feeds value as required

    try {
        // Insert data into the PerformerData table
        const query = `
            INSERT INTO PerformerData (performerId, feeds, content)
            VALUES (?, ?, ?)
        `;
        
        const [result] = await db.execute(query, [performerId, feeds, content]);

        // Respond with the created post information
        return res.status(201).json({
            id: result.insertId, // Assuming you're using a driver that provides this
            performerId,
            feeds,
            content,
            likes: 0,
            dislikes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while creating the feed." });
    }
};
