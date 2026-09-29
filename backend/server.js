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
const distPath = path.resolve(__dirname, '../frontend/dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Sakthimurugan Medical Agency</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #0f172a; color: #fff; text-align: center; padding: 20px; }
            .card { background: #1e293b; border: 1px solid #334155; padding: 32px; border-radius: 16px; max-width: 480px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
            h1 { font-size: 20px; margin-bottom: 8px; color: #38bdf8; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Sakthimurugan Medical Agency</h1>
            <p>B2B Wholesale Medicine Management API is active on port ${process.env.PORT || 5000}.</p>
            <p>Building production client assets...</p>
          </div>
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
