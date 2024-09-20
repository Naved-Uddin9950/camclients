import db from "../connection.js";
import useTableCheck from "../helpers/useTableCheck.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMessage = async (req, res) => {
    const { senderId, receiverId, content, media, price } = req.body;

    // Check if the 'messages' table exists, and create it if not
    const isTableExists = await useTableCheck('messages');
    if (isTableExists) {
        const createTableSQL = fs.readFileSync(path.resolve(__dirname, '../DB/messages.table.sql'), 'utf-8');
        await db.execute(createTableSQL);
    }

    // Check if the sender exists
    const [sender] = await db.execute('SELECT * FROM users WHERE id = ?', [senderId]);
    if (!sender || sender.length === 0) {
        return res.status(400).send({ error: 'Sender not found' });
    }

    const role = sender[0].role;

    if (role === 'model') {
        // Handle message from a model (with or without media)
        try {
            const mediaJSON = media ? JSON.stringify(media) : null;
            const insertMessageSQL = `
                INSERT INTO messages (senderId, receiverId, content, media, price) 
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.execute(insertMessageSQL, [senderId, receiverId, content, mediaJSON, price || 0]);

            res.status(200).send({ success: 'Message with media sent successfully' });
        } catch (error) {
            console.error('Error sending media message: ', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    } else if (role === 'user') {
        // Handle text message from a user
        if (media || price) {
            return res.status(400).send({ error: 'Fans cannot send media or set price' });
        }
        try {
            const insertMessageSQL = `
                INSERT INTO messages (senderId, receiverId, content) 
                VALUES (?, ?, ?)
            `;
            await db.execute(insertMessageSQL, [senderId, receiverId, content]);

            res.status(200).send({ success: 'Text message sent successfully' });
        } catch (error) {
            console.error('Error sending text message: ', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    } else {
        return res.status(400).send({ error: 'Invalid user role' });
    }
};
