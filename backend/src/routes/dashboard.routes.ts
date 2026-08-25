import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

router.get('/stats', (req, res) => dashboardController.getStats(req, res));
router.get('/severity', (req, res) => dashboardController.getSeverityBreakdown(req, res));
router.get('/activity', (req, res) => dashboardController.getActivity(req, res));

export default router;
