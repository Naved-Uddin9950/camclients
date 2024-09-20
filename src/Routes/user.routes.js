import express from 'express';
import { GetFeeds } from '../Controllers/Feeds.controller.js';

const router = express.Router();

router.get('/feeds', GetFeeds);

export default router;