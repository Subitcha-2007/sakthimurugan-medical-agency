require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const connectDB = require('./config/db');
const seedAllData = require('./seedData');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const businessApplicationRoutes = require('./routes/businessApplication.routes');
const categoryRoutes = require('./routes/category.routes');
const medicineRoutes = require('./routes/medicine.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const deliveryAreaRoutes = require('./routes/deliveryArea.routes');
const pincodeRoutes = require('./routes/pincode.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check & Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Sakthimurugan Medical Agency B2B Wholesale API',
    location: '50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu',
    phone: ['9994446994', '9865730150'],
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/business-applications', businessApplicationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/delivery-areas', deliveryAreaRoutes);
app.use('/api/pincodes', pincodeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/admin', adminRoutes);

// Serve Frontend in Production with SPA Catch-All
const distPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Sakthimurugan Medical Agency API</title></head>
        <body style="font-family: sans-serif; padding: 40px; text-align: center;">
          <h2>SAKTHIMURUGAN MEDICAL AGENCY</h2>
          <p>B2B Wholesale Medicine Management API is Running on Port ${process.env.PORT || 5000}.</p>
          <p>Frontend client building in progress or accessible on Vite dev server (Port 5173).</p>
        </body>
        </html>
      `);
    }
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedAllData();

    const server = app.listen(PORT, () => {
      console.log(`
==========================================================
🏥 SAKTHIMURUGAN MEDICAL AGENCY - B2B BACKEND API ONLINE
📍 50, 1st Floor, Kamaraj Street, Erode, Tamil Nadu
📞 Phones: 9994446994 | 9865730150
🚀 Server Port: ${PORT}
🌐 API Endpoint: http://localhost:${PORT}/api/health
==========================================================
      `);
    });
  } catch (error) {
    console.error('Fatal Server Error:', error);
    process.exit(1);
  }
};

startServer();
