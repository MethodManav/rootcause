import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import investigationRoutes from './routes/investigation.routes';
import transactionRoutes from './routes/transaction.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'ok',
  });
});

app.use('/api/investigations', investigationRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler for unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
    },
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Global Error Handler]:', err);
  res.status(500).json({
    success: false,
    error: {
      message: 'Internal server error',
    },
  });
});

export default app;
