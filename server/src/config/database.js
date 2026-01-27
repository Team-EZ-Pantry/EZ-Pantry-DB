const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // This is the "magic" line for DigitalOcean
    rejectUnauthorized: false 
  }
});

module.exports = pool;