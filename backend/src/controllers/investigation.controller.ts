import { Request, Response } from 'express';
import { z } from 'zod';
import { investigationService } from '../services/investigation.service';

const StartInvestigationSchema = z.object({
  transactionId: z.string({ message: "transactionId is required" }).min(1, "transactionId cannot be empty"),
});

export class InvestigationController {
  async startInvestigation(req: Request, res: Response) {
    try {
      const validatedData = StartInvestigationSchema.parse(req.body);
      
      // Call the service (placeholder for now)
      await investigationService.startInvestigation(validatedData.transactionId);

      res.status(200).json({
        success: true,
        transactionId: validatedData.transactionId,
        message: "Investigation request received",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Return the first validation error message
        res.status(400).json({
          success: false,
          error: {
            message: error.issues[0]?.message || "Validation failed",
          },
        });
        return;
      }

      console.error('[InvestigationController] Error starting investigation:', error);
      res.status(500).json({
        success: false,
        error: {
          message: "Internal server error",
        },
      });
    }
  }
}

export const investigationController = new InvestigationController();
