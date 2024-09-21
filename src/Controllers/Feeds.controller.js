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
  try {
    // Extract the content and user ID from the request body
    const { content, performerId } = req.body;

    // Check if the content and user ID are provided
    if (!content || !performerId) {
      return res.status(400).json({ error: 'Content and user ID are required' });
    }

    // Create a new entry in the PerformerData table with the content and user ID
    const query = `INSERT INTO PerformerData (content, performerId) VALUES (?, ?)`;
    const values = [content, performerId];

    // Execute the query
    await db.query(query, values);

    // Return a success response
    res.status(201).json({ message: 'Content uploaded successfully' });
  } catch (error) {
    // Return an error response
    console.error(error);
    res.status(500).json({ error: 'Failed to upload content' });
  }
};
