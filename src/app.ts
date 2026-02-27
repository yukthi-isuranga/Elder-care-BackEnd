import express from 'express';

import { errorHandler } from './middlewares/errorHandler';

//Routes
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import caretakerRoutes from './routes/caretakerRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

//user Registation CARETAKER , CAREGIVER ,ADMIN
app.use('/auth', authRoutes);

//Get User Admin
app.use('/admin', adminRoutes);

//Get CARETAKER Users
app.use('/caretaker', caretakerRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
