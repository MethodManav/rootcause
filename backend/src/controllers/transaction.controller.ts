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

  // Returns a transaction by its ID
  getTransactionById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const transaction = mockTransactions.find(t => t.id === id);

      if (!transaction) {
        res.status(404).json({
          success: false,
          error: { message: `Transaction with ID ${id} not found` }
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: transaction
      });
    } catch (error) {
      console.error('[TransactionController] Error fetching transaction by ID:', error);
      res.status(500).json({
        success: false,
        error: { message: "Internal server error" }
      });
    }
  }

  // Investigate a transaction via AI
  async investigate(req: Request, res: Response) {
    const { id } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      // Use the TrueFoundry Gateway SDK
      const { TrueFoundryGateway } = require('truefoundry-gateway-sdk');
      const client = new TrueFoundryGateway({
        baseUrl: process.env.TRUEFOUNDRY_GATEWAY_URL,
        apiKey: process.env.TRUEFOUNDRY_API_KEY
      });

      // 1. Create a session for the agent
      const session = await client.private.agents.sessions.create({
        agentName: "agent-root"
      });

      // 2. Stream the response using that session
      const stream = await client.private.agents.sessions.createTurnStream(session.id, {
        input: [{ type: "user.message", content: `Investigate transaction ID: ${id}` }]
      });

      for await (const chunk of stream) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();

    } catch (error: any) {
      console.error('[TransactionController] Error during investigation:', error);
      res.write(`data: ${JSON.stringify({ error: error?.message || "Internal server error" })}\n\n`);
      res.end();
    }
  }
}

export const transactionController = new TransactionController();
