import db from "../connection.js";
import useTableCheck from "../helpers/useTableCheck.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendMessage = async (req, res) => {
    const { senderId, receiverId, content, media } = req.body;

    const isTableExists = await useTableCheck('messages');
    if (isTableExists) {
        const createTableSQL = fs.readFileSync(path.resolve(__dirname, '../DB/messages.table.sql'), 'utf-8');
        await db.execute(createTableSQL);
    }

    const [sender] = await db.execute('SELECT * FROM users WHERE id = ?', [senderId]);
    if (!sender || sender.length === 0) {
        return res.status(400).send({ error: 'Sender not found' });
    }

    const role = sender[0].role;

    if (role === 'model') {
        try {
            let mediaJSON = null;
            if (media) {
                media.forEach(item => {
                    item.isUnlocked = false
                    item.price = item.price || 0;
                });
                mediaJSON = JSON.stringify(media);
            }
            const insertMessageSQL = `
                INSERT INTO messages (senderId, receiverId, content, media) 
                VALUES (?, ?, ?, ?)
            `;
            await db.execute(insertMessageSQL, [senderId, receiverId, content, mediaJSON]);

            res.status(200).send({ success: 'Message with media sent successfully' });
        } catch (error) {
            console.error('Error sending media message: ', error);
            res.status(500).send({ error: 'Internal server error' });
        }
    } else if (role === 'fan') {
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

export const getMessages = async (req, res) => {
    const { userId, chatPartnerId } = req.params;
    try {
        const [messages] = await db.execute(`
            SELECT * FROM messages 
            WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)
        `, [userId, chatPartnerId, chatPartnerId, userId]);

        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            media: JSON.parse(msg.media || '[]'),
            timestamp: msg.createdAt,
        }));

        res.status(200).send(formattedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to retrieve messages' });
    }
};

export const getRoom = async (req, res) => {
    const { senderId, receiverId } = req.body;

    try {
        const [existingRoom] = await db.execute('SELECT * FROM chat_rooms WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)', [senderId, receiverId, receiverId, senderId]);

        if (existingRoom.length > 0) {
            return res.status(200).send({ chatRoomId: existingRoom[0].id });
        }
        const insertChatRoomSQL = 'INSERT INTO chat_rooms (senderId, receiverId) VALUES (?, ?)';
        const [result] = await db.execute(insertChatRoomSQL, [senderId, receiverId]);
        res.status(201).send({ chatroom: result.insertId });

    } catch (error) {
        console.error('Error creating chat room:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { lastMessage } = req.body;

    try {
        const updateChatRoomSQL = 'UPDATE chat_rooms SET lastMessage = ?, lastUpdated = CURRENT_TIMESTAMP WHERE id = ?';
        await db.execute(updateChatRoomSQL, [lastMessage, id]);

        res.status(200).send({ success: 'Chat room updated successfully' });
    } catch (error) {
        console.error('Error updating chat room:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const getAllRooms = async (req, res) => {
    const { userId } = req.params;

    try {
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }

        const [chatRooms] = await db.execute(
            `SELECT * FROM chat_rooms WHERE senderId = ? OR receiverId = ?`,
            [userId, userId]
        );

        if (!chatRooms || chatRooms.length === 0) {
            return res.status(404).send({ message: 'No chat rooms found for this user' });
        }

        res.status(200).send(chatRooms);
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
};
