const { Pool } = require('pg');

// We use a simple configuration that works with DigitalOcean's default setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // This allows the self-signed cert from DigitalOcean to pass
    rejectUnauthorized: false 
  }
});

module.exports = pool;