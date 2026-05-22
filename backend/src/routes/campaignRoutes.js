import { Router } from 'express';
import campaignController from '../controllers/campaignController.js';

const router = Router();

router.get('/active', campaignController.getActiveCampaigns);
router.get('/discounted-products', campaignController.getDiscountedProducts);
router.get('/:id', campaignController.getCampaignById);

export default router;

