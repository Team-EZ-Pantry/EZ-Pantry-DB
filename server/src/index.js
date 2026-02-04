const path = require('path');
require('dotenv').config({
  override: true,
  path: path.join(__dirname, '../.env')
});

// *************************************
// *      Server Configuration         *
// *************************************
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const PORT = process.env.APP_PORT || 3000;
const app = express();
app.use(cors());
   // Enable CORS for cross-origin requests
app.use(express.json());
   // Parse JSON bodies in incoming requests

// *************************************
// *   DB Connection Health Endpoint   *
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
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const pantryRoutes = require('./routes/pantry');
const productRoutes = require('./routes/product');
const shoppingListRoutes = require('./routes/shoppingList');
const recipeRoutes = require('./routes/recipe');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
app.use('/api/recipes', recipeRoutes);

// *************************************
// *         Start the Server         *
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

startServer();
