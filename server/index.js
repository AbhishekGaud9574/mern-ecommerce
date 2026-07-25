import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
// import bodyParser from 'body-parser';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Configure environment variables
dotenv.config();

// Connect to Database
connectDB();

// Create Express App
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mern-ecommerce-1jy4-theta.vercel.app",
    ],
    credentials: true,
  })
);

// Allow frontend connection
if (process.env.DEV_MODE === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json());

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/product', productRoutes);

// Default API Route
app.get('/', (req, res) => {
  res.send("<h1>Welcome to E-commerce App</h1>");
});

// Handle Undefined Routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "API route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} in ${process.env.DEV_MODE} mode`.bgCyan.white);
});
