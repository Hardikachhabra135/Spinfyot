require('dotenv').config({ path: __dirname + '/../.env' });
const { Sequelize } = require('sequelize');

// ============================================================================
// ENVIRONMENT VARIABLES EXPECTED:
// LOCAL (MySQL): DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT
// PROD (TiDB):   PROD_DB_NAME, PROD_DB_USER, PROD_DB_PASS, PROD_DB_HOST, PROD_DB_PORT, PROD_DB_SSL
// ============================================================================

const isExecute = process.argv.includes('--execute');

// Production TiDB Connection
const prodUseSSL = process.env.PROD_DB_SSL === 'true';
const prodSslOptions = prodUseSSL ? {
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: process.env.PROD_DB_SSL_REJECT_UNAUTHORIZED !== 'false'
  }
} : {};

const prodSequelize = new Sequelize(
  process.env.PROD_DB_NAME || 'spinfyot',
  process.env.PROD_DB_USER || 'root',
  process.env.PROD_DB_PASS || '',
  {
    host: process.env.PROD_DB_HOST || 'localhost',
    dialect: 'mysql',
    port: parseInt(process.env.PROD_DB_PORT, 10) || 4000,
    logging: false,
    dialectOptions: prodSslOptions
  }
);

// Local MySQL Connection
const localSequelize = new Sequelize(
  process.env.DB_NAME || 'spinfyot',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    logging: false
  }
);

async function inspectTable(tableName) {
  let localCount = 0;
  let prodCount = 0;
  let willInsert = 0;
  let willSkip = 0;

  try {
    const [localRecords] = await localSequelize.query(`SELECT * FROM ${tableName}`);
    localCount = localRecords.length;

    try {
      const [prodRecords] = await prodSequelize.query(`SELECT id FROM ${tableName}`);
      prodCount = prodRecords.length;
      const prodIds = new Set(prodRecords.map(r => r.id));
      
      for (const record of localRecords) {
        if (prodIds.has(record.id)) {
          willSkip++;
        } else {
          willInsert++;
        }
      }
    } catch (e) {
      if (e.message.includes("doesn't exist")) {
        willInsert = localCount; // Prod table doesn't exist yet, all will be inserted
      } else {
        throw e;
      }
    }

  } catch (err) {
    if (err.message.includes("doesn't exist")) {
      // Local table doesn't exist
    } else {
      console.error(`Error reading ${tableName}: ${err.message}`);
    }
  }

  return { localCount, prodCount, willInsert, willSkip };
}

async function migrateTable(tableName) {
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  try {
    const [localRecords] = await localSequelize.query(`SELECT * FROM ${tableName}`);
    if (localRecords.length === 0) return { inserted, skipped, errors };

    for (const record of localRecords) {
      try {
        const [prodCheck] = await prodSequelize.query(`SELECT id FROM ${tableName} WHERE id = ?`, {
          replacements: [record.id]
        });

        if (prodCheck.length > 0) {
          skipped++;
          continue;
        }

        const keys = Object.keys(record);
        const placeholders = keys.map(() => '?').join(', ');
        const values = Object.values(record);

        await prodSequelize.query(
          `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
          { replacements: values }
        );
        inserted++;
      } catch (err) {
        console.error(`  - Error migrating ID ${record.id} in ${tableName}:`, err.message);
        errors++;
      }
    }
  } catch (err) {
    if (!err.message.includes("doesn't exist")) {
      console.error(`Error processing ${tableName}:`, err.message);
      errors++;
    }
  }

  return { inserted, skipped, errors };
}

async function run() {
  try {
    console.log("Authenticating databases...");
    await localSequelize.authenticate();
    console.log("✓ Connected to LOCAL MySQL");
    
    await prodSequelize.authenticate();
    console.log("✓ Connected to PRODUCTION TiDB\n");

    const tablesToMigrate = [
      'appointments', 
      'blogs', 
      'contacts', 
      'event_logs', 
      'questions', 
      'testimonials'
    ];

    if (!isExecute) {
      console.log("======================================================");
      console.log(" READ-ONLY INSPECTION MODE (No data will be changed) ");
      console.log("======================================================\n");
      console.log("Table".padEnd(15) | "Local Cnt".padEnd(10) | "Prod Cnt".padEnd(10) | "Will Insert".padEnd(12) | "Will Skip");
      console.log("-".repeat(60));

      for (const table of tablesToMigrate) {
        let tableName = table;
        if (table === 'event_logs') {
          try {
            await localSequelize.query(`SELECT 1 FROM EventLogs LIMIT 1`);
            tableName = 'EventLogs';
          } catch(e) {
            tableName = 'event_logs';
          }
        }

        const stats = await inspectTable(tableName);
        console.log(`${tableName.padEnd(15)} | ${String(stats.localCount).padEnd(10)} | ${String(stats.prodCount).padEnd(10)} | ${String(stats.willInsert).padEnd(12)} | ${String(stats.willSkip)}`);
      }

      console.log("\nInspection complete.");
      console.log("To execute the actual migration, run: node scripts/migrateData.js --execute");
    } else {
      console.log("======================================================");
      console.log(" EXECUTING DATABASE MIGRATION ");
      console.log("======================================================\n");
      console.log("Table".padEnd(15) | "Inserted".padEnd(10) | "Skipped".padEnd(10) | "Errors");
      console.log("-".repeat(50));

      for (const table of tablesToMigrate) {
        let tableName = table;
        if (table === 'event_logs') {
          try {
            await localSequelize.query(`SELECT 1 FROM EventLogs LIMIT 1`);
            tableName = 'EventLogs';
          } catch(e) {
            tableName = 'event_logs';
          }
        }

        const stats = await migrateTable(tableName);
        console.log(`${tableName.padEnd(15)} | ${String(stats.inserted).padEnd(10)} | ${String(stats.skipped).padEnd(10)} | ${stats.errors}`);
      }

      console.log("\nMigration completed successfully.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("\nFailed to connect or migrate:", error.message);
    process.exit(1);
  }
}

run();
