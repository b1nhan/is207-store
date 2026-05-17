import { Router } from 'express';
import campaignController from '../controllers/campaignController.js';

const router = Router();

router.get('/active', campaignController.getActiveCampaigns);

export default router;
