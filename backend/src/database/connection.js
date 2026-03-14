import mysql from 'mysql2/promise';
import env from '../config/env.js';

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: env.database.host,
      port: env.database.port,
      user: env.database.user,
      password: env.database.password,
      database: env.database.name,
      waitForConnections: true,
      connectionLimit: 10,
    });

    const connection = await pool.getConnection();
    console.log('MySQL connected');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const getDB = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return pool;
};

export { connectDB, getDB };
