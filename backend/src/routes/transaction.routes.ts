import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller';

const router = Router();

router.get('/list', (req, res) => transactionController.listTransactions(req, res));
router.get('/incident', (req, res) => transactionController.listIncidents(req, res));

export default router;
