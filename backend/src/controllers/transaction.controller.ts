import { Request, Response } from 'express';
import { mockTransactions } from '../data';

export class TransactionController {
  // Returns all transactions
  listTransactions(req: Request, res: Response) {
    try {
      res.status(200).json({
        success: true,
        data: mockTransactions
      });
    } catch (error) {
      console.error('[TransactionController] Error fetching transactions:', error);
      res.status(500).json({
        success: false,
        error: { message: "Internal server error" }
      });
    }
  }

  // Returns only failed transactions (incidents)
  listIncidents(req: Request, res: Response) {
    try {
      const failedTransactions = mockTransactions.filter(t => t.status === 'FAILED');
      res.status(200).json({
        success: true,
        data: failedTransactions
      });
    } catch (error) {
      console.error('[TransactionController] Error fetching incidents:', error);
      res.status(500).json({
        success: false,
        error: { message: "Internal server error" }
      });
    }
  }
}

export const transactionController = new TransactionController();
