import express from 'express';
import { GetUserProfile, EditUserProfile } from '../Controllers/UserProfile.controller.js';

const router = express.Router();

router.post('/profile', GetUserProfile);
router.put('/:id', EditUserProfile);

export default router;