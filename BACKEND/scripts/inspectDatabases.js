require('dotenv').config({ path: __dirname + '/../.env' });
const { Sequelize } = require('sequelize');

// Production TiDB Connection (using current .env)
const prodUseSSL = process.env.DB_SSL === 'true';
const prodSslOptions = prodUseSSL ? {
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  }
} : {};

const prodSequelize = new Sequelize(
  process.env.DB_NAME || 'spinfyot',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    logging: false,
    dialectOptions: prodSslOptions
  }
);

// Local MySQL Connection (using defaults assuming standard local setup)
const localSequelize = new Sequelize(
  'spinfyot',
  'root',
  '', // Try empty password first, then common ones if it fails
  {
    host: '127.0.0.1',
    dialect: 'mysql',
    port: 3306,
    logging: false
  }
);

async function getCount(sequelize, table) {
  try {
    const [results] = await sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
    return results[0].count;
  } catch (error) {
    if (error.message.includes("doesn't exist")) {
      return 0; // Table doesn't exist
    }
    throw error;
  }
}

async function inspect() {
  try {
    console.log("Connecting to Local Database...");
    await localSequelize.authenticate();
    console.log("Connecting to Production Database...");
    await prodSequelize.authenticate();
    
    console.log("\n--- RECORD COUNTS ---");
    console.log("Table | Local | Production");
    console.log("---------------------------------");
    
    // Check tables.
    const actualTables = ['admins', 'appointments', 'blogs', 'contacts', 'questions', 'testimonials', 'EventLogs', 'event_logs'];
    
    for (const table of actualTables) {
      const localCount = await getCount(localSequelize, table);
      const prodCount = await getCount(prodSequelize, table);
      if (localCount > 0 || prodCount > 0) {
          console.log(`${table.padEnd(15)} | ${String(localCount).padEnd(5)} | ${prodCount}`);
      }
    }
    
    console.log("\nInspection complete.");
    process.exit(0);
  } catch (error) {
    console.error("Inspection failed:", error);
    process.exit(1);
  }
}

inspect();
