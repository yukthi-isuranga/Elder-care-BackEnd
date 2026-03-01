import express from 'express';

import { errorHandler } from './middlewares/errorHandler';

//Routes
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import caretakerRoutes from './routes/caretakerRoutes';
import caregiverRoutes from './routes/caregiverRoutes';

const app = express();

app.use(express.json());

app.use(errorHandler);

// Routes
app.use('/api/items', itemRoutes);

//user Registation CARETAKER , CAREGIVER ,ADMIN
app.use('/auth', authRoutes);

//Get User Admin
app.use('/admin', adminRoutes);

//Get CARETAKER Users
app.use('/caretaker', caretakerRoutes);

//Get CAREGIVER Users
app.use('/caregiver', caregiverRoutes);

// Global error handler (should be after routes)

export default app;
