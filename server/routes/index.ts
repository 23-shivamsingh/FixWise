import { Router } from 'express';
import healthRoutes from './healthRoutes';
import repairerRoutes from './repairerRoutes';
import diagnosisRoutes from './diagnosisRoutes';
import quoteRoutes from './quoteRoutes';
import bookingRoutes from './bookingRoutes';
import deviceRoutes from './deviceRoutes';
import impactRoutes from './impactRoutes';
import userRoutes from './userRoutes';

const apiRouter = Router();

apiRouter.use(healthRoutes);
apiRouter.use(repairerRoutes);
apiRouter.use(diagnosisRoutes);
apiRouter.use(quoteRoutes);
apiRouter.use(bookingRoutes);
apiRouter.use(deviceRoutes);
apiRouter.use(impactRoutes);
apiRouter.use(userRoutes);

export default apiRouter;
