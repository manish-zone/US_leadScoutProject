import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'root',
  database: process.env.DB_NAME || 'leadscout_db',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Create the connection pool
export const pool = mysql.createPool(dbConfig);

// Helper to test connectivity
export async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT 1 AS connected, NOW() AS serverTime');
    connection.release();
    return {
      success: true,
      serverTime: rows[0].serverTime,
      database: dbConfig.database,
      host: dbConfig.host
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      code: err.code
    };
  }
}

