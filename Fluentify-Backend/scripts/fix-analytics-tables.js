/**
 * FIX: Standalone script to create learning_logs table if it doesn't exist
 * 
 * This script fixes the "Failed to load analytics data" error by
 * running the analytics migration SQL file directly.
 * 
 * Usage:
 *   node scripts/fix-analytics-tables.js
 * 
 * Or with Docker:
 *   docker exec -i fluentify-postgres psql -U postgres -d fluentify < src/database/06-fix-analytics-tables.sql
 */

import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fluentify',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function fixAnalyticsTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking if learning_logs table exists...');
    
    // Check if table exists
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'learning_logs'
      );
    `);
    
    if (checkResult.rows[0].exists) {
      console.log('✅ learning_logs table already exists. No action needed.');
      return;
    }
    
    console.log('❌ learning_logs table not found. Running migration...');
    
    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, '../src/database/06-fix-analytics-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the migration
    await client.query(sql);
    
    // Verify table was created
    const verifyResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'learning_logs'
      );
    `);
    
    if (verifyResult.rows[0].exists) {
      console.log('✅ learning_logs table created successfully!');
      console.log('\n📋 Table structure:');
      console.log('   - log_id: SERIAL PRIMARY KEY');
      console.log('   - user_id: INTEGER (FK to learners)');
      console.log('   - event_type: VARCHAR(50)');
      console.log('   - language_name: VARCHAR(100)');
      console.log('   - module_type: VARCHAR(20) CHECK (ADMIN or AI)');
      console.log('   - duration_seconds: INTEGER');
      console.log('   - created_at: TIMESTAMP DEFAULT NOW()');
      console.log('   - metadata: JSONB');
      console.log('\n📊 Analytics dashboard should now work correctly!');
    } else {
      throw new Error('Failed to create learning_logs table');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixAnalyticsTables().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

