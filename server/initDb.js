import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { INITIAL_LEADS } from '../src/data/initialLeads.js';

dotenv.config();

const baseConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root'
};

const DB_NAME = process.env.DB_NAME || 'leadscout_db';

export async function initializeDatabase() {
  let conn;
  try {
    console.log(`[MySQL] Connecting to MySQL server on ${baseConfig.host}:${baseConfig.port}...`);
    conn = await mysql.createConnection(baseConfig);

    // 1. Create database if not exists
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`[MySQL] Database "${DB_NAME}" confirmed.`);

    // 2. Select database
    await conn.changeUser({ database: DB_NAME });

    // 3. Create leads table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS leads (
        id VARCHAR(64) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        sub_category VARCHAR(128) NULL,
        city VARCHAR(128) NULL,
        state VARCHAR(32) NULL,
        address VARCHAR(255) NULL,
        phone VARCHAR(64) NULL,
        owner_name VARCHAR(128) NULL,
        rating DECIMAL(3, 1) DEFAULT 0.0,
        reviews_count INT DEFAULT 0,
        website_status VARCHAR(128) DEFAULT 'No Website Found',
        opportunity_score INT DEFAULT 90,
        estimated_revenue VARCHAR(64) NULL,
        pitch_angle TEXT NULL,
        status VARCHAR(64) DEFAULT 'new',
        followup_date VARCHAR(64) NULL,
        tags JSON NULL,
        notes JSON NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_state (state),
        INDEX idx_opp_score (opportunity_score)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await conn.query(createTableQuery);
    console.log(`[MySQL] Table "leads" ready.`);

    // 4. Check if table is empty
    const [rows] = await conn.query('SELECT COUNT(*) AS total FROM leads');
    const totalCount = rows[0].total;

    if (totalCount === 0) {
      console.log(`[MySQL] Table "leads" is empty. Seeding ${INITIAL_LEADS.length} curated US businesses...`);
      await seedLeads(conn, INITIAL_LEADS);
      console.log(`[MySQL] Successfully seeded ${INITIAL_LEADS.length} leads into MySQL!`);
    } else {
      console.log(`[MySQL] Table "leads" already contains ${totalCount} records.`);
    }

    return { success: true, count: totalCount || INITIAL_LEADS.length };
  } catch (err) {
    console.error('[MySQL Error] Database initialization failed:', err.message);
    throw err;
  } finally {
    if (conn) await conn.end();
  }
}

export async function seedLeads(connection, leadsList) {
  const insertSql = `
    INSERT INTO leads (
      id, name, category, sub_category, city, state, address, phone, owner_name,
      rating, reviews_count, website_status, opportunity_score, estimated_revenue,
      pitch_angle, status, followup_date, tags, notes
    ) VALUES ?
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      category = VALUES(category),
      sub_category = VALUES(sub_category),
      city = VALUES(city),
      state = VALUES(state),
      address = VALUES(address),
      phone = VALUES(phone),
      owner_name = VALUES(owner_name),
      rating = VALUES(rating),
      reviews_count = VALUES(reviews_count),
      website_status = VALUES(website_status),
      opportunity_score = VALUES(opportunity_score),
      estimated_revenue = VALUES(estimated_revenue),
      pitch_angle = VALUES(pitch_angle),
      status = VALUES(status),
      followup_date = VALUES(followup_date),
      tags = VALUES(tags),
      notes = VALUES(notes);
  `;

  const values = leadsList.map(l => [
    l.id || `lead-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    l.name,
    l.category,
    l.subCategory || l.sub_category || '',
    l.city || '',
    l.state || '',
    l.address || '',
    l.phone || '',
    l.ownerName || l.owner_name || '',
    Number(l.rating) || 0,
    Number(l.reviewsCount || l.reviews_count) || 0,
    l.websiteStatus || l.website_status || 'No Website Found',
    Number(l.opportunityScore || l.opportunity_score) || 90,
    l.estimatedRevenue || l.estimated_revenue || '',
    l.pitchAngle || l.pitch_angle || '',
    l.status || 'new',
    l.followupDate || l.followup_date || null,
    JSON.stringify(l.tags || []),
    JSON.stringify(l.notes || [])
  ]);

  // Insert in batches of 50
  for (let i = 0; i < values.length; i += 50) {
    const chunk = values.slice(i, i + 50);
    await connection.query(insertSql, [chunk]);
  }
}

// Allow running directly via "node server/initDb.js"
if (process.argv[1]?.endsWith('initDb.js')) {
  initializeDatabase()
    .then(() => {
      console.log('[MySQL] Setup complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[MySQL] Setup failed:', err);
      process.exit(1);
    });
}

