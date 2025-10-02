const path = require('path');
require('dotenv').config({
  override: true,
  path: path.join(__dirname, '.env')
});

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// *************************************
// *    Database Connection Setup      *
// *************************************
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

// *************************************
// *      Server Configuration         *
// *************************************
const PORT = process.env.APP_PORT || 3000;
const app = express();
// Enable CORS for cross-origin requests
app.use(cors());
// Parse JSON bodies in incoming requests
app.use(express.json());

// *************************************
// *       Health Check Endpoint       *
// *************************************
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'healthy', timestamp: new Date() });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', error: err.message });
  }
});

// *************************************
// *           API Routes              *
// *************************************
// Contains register, 
const initializeAuthRoutes = require('./routes/auth');
app.use('/api/auth', initializeAuthRoutes(pool));

const pantryRoutes = require('./routes/pantry');
app.use('/', pantryRoutes);
// *************************************
// *     Application Startup Logic     *
// *************************************
async function startServer() {
  try {
    // Test database connection before starting server
    await pool.query('SELECT NOW()');
    console.log('Database connected successfully');

    // Start listening for incoming requests
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
}

// Start the server
startServer();
