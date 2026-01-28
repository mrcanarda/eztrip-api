const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');

// Ortam değişkenlerini yükle
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));

// Ana route - API bilgisi
app.get('/', (req, res) => {
  res.json({ 
    message: 'EzTrip API is running...',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      trips: {
        getAll: 'GET /api/trips',
        create: 'POST /api/trips',
        getById: 'GET /api/trips/:id',
        update: 'PUT /api/trips/:id',
        delete: 'DELETE /api/trips/:id',
        addExpense: 'POST /api/trips/:id/expenses',
        deleteExpense: 'DELETE /api/trips/:id/expenses/:expenseId'
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı (non-blocking - server başlamadan önce beklenmez)
connectDB().catch(err => {
  console.error('MongoDB bağlantı hatası:', err.message);
  console.log('Server MongoDB olmadan çalışmaya devam ediyor...');
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}`);
});