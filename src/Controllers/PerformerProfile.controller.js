import db from "../connection.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import useTableCheck from "../helpers/useTableCheck.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GetPerformerProfile = async (req, res) => {
    try {
        const isTableExists = await useTableCheck('users');
        if (!isTableExists) return res.status(400).send({ error: 'Internal server error. Please try again later or contact the developers' });
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);

        if (rows.length === 0) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: rows[0] });

    } catch (error) {
        console.error('Error fetching performer profile: ', error);
        res.status(500).send({ error: 'Internal Server Error. Please try again later or contact the developers.' });
    }
};

export const EditPerformerProfile = async (req, res) => {
    try {
        const isTableExists = await useTableCheck('users');
        if (!isTableExists) return res.status(400).send({ error: 'Internal server error. Please try again later or contact the developers' });

        const { id } = req.params;
        const { name, email, bio, profilePicture, contactInfo, username, stageName } = req.body;

        // Check if user exists
        const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (userRows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if username, stageName, or email already exist in the database
        const validationErrors = [];
        if (username) {
            const [usernameRows] = await db.execute('SELECT * FROM users WHERE username = ? AND id != ?', [username, id]);
            if (usernameRows.length > 0) {
                validationErrors.push('Username already exists');
            }
        }

        if (stageName) {
            const [stageNameRows] = await db.execute('SELECT * FROM users WHERE stage_name = ? AND id != ?', [stageName, id]);
            if (stageNameRows.length > 0) {
                validationErrors.push('Stage name already exists');
            }
        }

        if (email) {
            const [emailRows] = await db.execute('SELECT * FROM users WHERE email = ? AND id != ?', [email, id]);
            if (emailRows.length > 0) {
                validationErrors.push('Email already exists');
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({ success: false, message: validationErrors.join(', ') });
        }

        // Build update query dynamically based on provided fields
        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (email) {
            updates.push('email = ?');
            values.push(email);
        }
        if (bio) {
            updates.push('bio = ?');
            values.push(bio);
        }
        if (profilePicture) {
            updates.push('profile_picture = ?');
            values.push(profilePicture);
        }
        if (contactInfo) {
            updates.push('contact_info = ?');
            values.push(contactInfo);
        }
        if (username) {
            updates.push('username = ?');
            values.push(username);
        }
        if (stageName) {
            updates.push('stage_name = ?');
            values.push(stageName);
        }

        if (updates.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }

        values.push(id);

        // Update user information
        const sqlQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
        await db.execute(sqlQuery, values);

        // Retrieve the updated user data
        const [updatedUser] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);

        res.json({ success: true, message: 'Profile updated successfully', data: updatedUser[0] });
    } catch (error) {
        console.error('Error updating performer profile: ', error);
        res.status(500).send({ error: 'Internal Server Error. Please try again later or contact the developers.' });
    }
};
