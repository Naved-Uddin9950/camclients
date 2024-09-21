import express from 'express';
import { sendMessage, getMessages, getRoom, updateRoom, getAllRooms } from '../Controllers/Message.Controller.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:userId/:chatPartnerId', getMessages);
router.post('/chatroom', getRoom);
router.get('/chatrooms/:userId', updateRoom);
router.post('/rooms/:userId', getAllRooms);

export default router;