import express from 'express';
import { sendMessage } from '../Controllers/Message.Controller.js';

const router = express.Router();

router.post('/', sendMessage);

export default router;