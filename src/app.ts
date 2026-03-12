import express from 'express';

import { errorHandler } from './middlewares/errorHandler';

//Routes
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import caretakerRoutes from './routes/caretakerRoutes';
import caregiverRoutes from './routes/caregiverRoutes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your Next.js frontend
    credentials: true, // important for cookies
  }),
);

app.use(express.json());

app.use(errorHandler);

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

//user Registation CARETAKER , CAREGIVER ,ADMIN
app.use('/auth', authRoutes);

//Get User Admin
app.use('/admin', adminRoutes);

//Get CAREGIVER Users
app.use('/caregiver', caregiverRoutes);

//Get CARETAKER Users
app.use('/caretaker', caretakerRoutes);

// Global error handler (should be after routes)

export default app;
