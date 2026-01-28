/*const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' 
    ? {
        // DigitalOcean's CA cert can be passed as a string from an ENV var
        // or read from a file if you prefer.
        ca: process.env.DB_CA_CERT,
        rejectUnauthorized: true 
      }
    : { 
        // For local development, usually no SSL or skip validation
        rejectUnauthorized: false 
      }
}); 

module.exports = pool; */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: process.env.CA_CERT,
    rejectUnauthorized: true 
  }
});

module.exports = pool;