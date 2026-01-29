const { Pool } = require('pg');

// Create and export a single database pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  // add more pool settings later
});

// Log connection errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

module.exports = pool;