import { Router } from 'express';
import { investigationController } from '../controllers/investigation.controller';

const router = Router();

router.post('/', (req, res) => investigationController.startInvestigation(req, res));

export default router;
