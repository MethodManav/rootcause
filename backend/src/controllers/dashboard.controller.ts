import { Request, Response } from 'express';
import { mockTransactions } from '../data';
import { logger } from '../utils/logger';

export class DashboardController {
  // GET /api/dashboard/stats
  getStats(req: Request, res: Response) {
    try {
      const totalTransactions = mockTransactions.length;
      const failedTransactions = mockTransactions.filter(t => t.status === 'FAILED').length;
      
      const activeIncidents = failedTransactions; // Simplify: each failure is an incident
      const criticalIncidents = mockTransactions.filter(t => t.status === 'FAILED' && t.errorCategory === 'FRAUD_SUSPECTED').length;

      res.status(200).json({
        success: true,
        data: {
          totalTransactions,
          totalTransactionsChangePct: 2.4, // Mock change percentage
          failedTransactions,
          failedTransactionsPct: Number(((failedTransactions / totalTransactions) * 100).toFixed(1)),
          activeIncidents,
          activeIncidentsCreatedToday: Math.floor(activeIncidents * 0.2), // Mock recent
          criticalIncidents,
          criticalRequiringAttention: Math.floor(criticalIncidents * 0.5), // Mock requiring attention
        }
      });
    } catch (error) {
      logger.error('[DashboardController] Error fetching stats:', error);
      res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
  }

  // GET /api/dashboard/severity
  getSeverityBreakdown(req: Request, res: Response) {
    try {
      let critical = 0;
      let high = 0;
      let medium = 0;
      let low = 0;

      mockTransactions.filter(t => t.status === 'FAILED').forEach(t => {
        if (t.errorCategory === 'FRAUD_SUSPECTED') {
          critical++;
        } else if (t.errorCategory === 'NETWORK_ERROR') {
          high++;
        } else {
          if (t.amount > 2000) high++;
          else if (t.amount > 500) medium++;
          else low++;
        }
      });

      res.status(200).json({
        success: true,
        data: [
          { severity: "CRITICAL", count: critical },
          { severity: "HIGH", count: high },
          { severity: "MEDIUM", count: medium },
          { severity: "LOW", count: low },
        ]
      });
    } catch (error) {
      logger.error('[DashboardController] Error fetching severity:', error);
      res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
  }

  // GET /api/dashboard/activity
  getActivity(req: Request, res: Response) {
    try {
      const range = req.query.range as string || '24h';
      
      // Dynamic mock generation for chart to ensure it always has data
      const now = Date.now();
      const points = [];
      
      let stepMs, count, labelFormatter;
      
      if (range === '7d') {
        stepMs = 24 * 60 * 60 * 1000;
        count = 7;
        labelFormatter = (d: Date) => d.toLocaleDateString("en-US", { weekday: "short" });
      } else if (range === '30d') {
        stepMs = 24 * 60 * 60 * 1000;
        count = 30;
        labelFormatter = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } else { // 24h
        stepMs = 60 * 60 * 1000;
        count = 24;
        labelFormatter = (d: Date) => d.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
      }

      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now - i * stepMs);
        points.push({
          label: labelFormatter(d),
          timestamp: d.toISOString(),
          successful: Math.floor(Math.random() * 200) + 100,
          failed: Math.floor(Math.random() * 20) + 5,
          suspicious: Math.floor(Math.random() * 10) + 1,
        });
      }

      res.status(200).json({
        success: true,
        data: points
      });
    } catch (error) {
      logger.error('[DashboardController] Error fetching activity:', error);
      res.status(500).json({ success: false, error: { message: "Internal server error" } });
    }
  }
}

export const dashboardController = new DashboardController();
