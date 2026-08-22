import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { isDatabaseConnected } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite frontend running on port 3000
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.APP_URL || '*'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Body parsers with support for base64 diagnostic image payloads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Mount all API routes under /api
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

// Start server only when executed directly as standalone script
const isDirectExecution =
  process.env.STANDALONE_SERVER === 'true' ||
  (typeof process.argv[1] === 'string' && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.js')));

if (isDirectExecution) {
  app.listen(PORT, async () => {
    console.log(`\n🚀 FixWise AI Express API server running on port ${PORT}`);
    console.log(`📡 Health Check endpoint: http://localhost:${PORT}/api/health`);
    const dbOk = await isDatabaseConnected();
    if (dbOk) {
      console.log(`🟢 PostgreSQL (Neon) Database connected successfully`);
    } else {
      console.log(`🟡 PostgreSQL connection pending (Check DATABASE_URL in .env)`);
    }
  });
}

export { app };
export default app;
