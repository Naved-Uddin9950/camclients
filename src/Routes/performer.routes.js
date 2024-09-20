import express from 'express';
import { EditPerformerProfile, GetPerformerProfile } from '../Controllers/PerformerProfile.controller.js';
import { StartLiveStream } from '../Controllers/LiveStream.controller.js';
import { PostFeeds } from '../Controllers/Feeds.controller.js';

const router = express.Router();

router.post('/:id', GetPerformerProfile);
router.put('/:id', EditPerformerProfile);
router.post('/live', StartLiveStream);
router.post('/feeds', PostFeeds);

export default router;