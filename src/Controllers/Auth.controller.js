import db from "../connection.js";
import useRandom from "../helpers/useRandom.js";
import validator from 'validator';
import useTableCheck from "../helpers/useTableCheck.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import useHash, { useCompare } from "../helpers/useHash.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const Register = async (req, res) => {
    const { Username, Email, Password, ConfirmPassword, PhoneNumber, StageName, BirthDate, Type, Gender } = req.body;
    const error = [];
    const strongPass = { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }

    if (!validator.isEmail(Email)) error.push('Invalid email');
    if (!validator.isMobilePhone(PhoneNumber, 'any')) error.push('Invalid phone number');
    if (!Username || !validator.isLength(Username, { min: 3 })) error.push('Username must be at least 3 characters long');
    if (!validator.isStrongPassword(Password, strongPass)) error.push('Password have to be strong');
    if (!validator.equals(Password, ConfirmPassword)) error.push("Password doesn't match");

    if (error.length > 0) {
        return res.status(400).send({ error: error });
    }

    const isTableExists = await useTableCheck('users');

    if (isTableExists) {
        const createTableSQL = fs.readFileSync(path.resolve(__dirname, '../DB/users.table.sql'), 'utf-8');
        await db.execute(createTableSQL);
    }

    try {
        const [existingUsers] = await db.execute('SELECT * FROM users WHERE username = ? OR email = ? or stagename = ?', [Username, Email, StageName]);

        if (existingUsers.length > 0) {
            if (existingUsers.some(user => user.username === Username)) {
                error.push('Username already exists');
            }
            if (existingUsers.some(user => user.email === Email)) {
                error.push('Email already exists');
            }
            if (existingUsers.some(user => user.stagename === StageName)) {
                error.push('Stagename already exists');
            }
            return res.status(400).send({ error });
        }

        const insertSQL = `
            INSERT INTO users (username, email, passwordHash, phone, stageName, dateOfBirth, role, gender) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const passwordHash = await useHash(Password);
        await db.execute(insertSQL, [Username, Email, passwordHash, PhoneNumber, StageName, BirthDate, Type, Gender]);

        res.status(200).send({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error checking user existence: ', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};

export const Login = async (req, res) => {
    const { Email, Password } = req.body;
    const error = [];

    const isTableExists = await useTableCheck('users');
    if (isTableExists) return res.status(400).send({ error: 'Internal server error. Please try again later or contact the developers' });

    if (!validator.isEmail(Email)) error.push('Invalid email');
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [Email]);
    if (users.length === 0) error.push("User doesn't exist");
    const user = users[0];

    const passwordMatch = await useCompare(Password, user.passwordHash);

    if (!passwordMatch) error.push('Incorrect password')
    if (error.length > 0) return res.status(400).send({ error });

    const token = useRandom(user.username);

    const updateTokenSQL = `
        UPDATE users 
        SET token = ? 
        WHERE id = ?`;
    await db.execute(updateTokenSQL, [token, user.id]);

    res.status(200).send({
        message: 'Login successfully',
        data: {
            token,
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        }
    });
};