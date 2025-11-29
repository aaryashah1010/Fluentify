/**
 * FIX: Standalone script to create otp_codes table if it doesn't exist
 * 
 * This script fixes the "relation 'otp_codes' does not exist" error by
 * running the migration SQL file directly.
 * 
 * Usage:
 *   node scripts/fix-otp-codes.js
 * 
 * Or with Docker:
 *   docker exec -i fluentify-postgres psql -U postgres -d fluentify < src/database/05-fix-otp-codes.sql
 */
// @ts-nocheck


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

async function fixOTPCodesTable() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking if otp_codes table exists...');
    
    // Check if table exists
    const checkResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'otp_codes'
      );
    `);
    
    if (checkResult.rows[0].exists) {
      console.log('✅ otp_codes table already exists. No action needed.');
      return;
    }
    
    console.log('❌ otp_codes table not found. Running migration...');
    
    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, '../src/database/05-fix-otp-codes.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the migration
    await client.query(sql);
    
    // Verify table was created
    const verifyResult = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'otp_codes'
      );
    `);
    
    if (verifyResult.rows[0].exists) {
      console.log('✅ otp_codes table created successfully!');
      console.log('\n📋 Table structure:');
      console.log('   - id: SERIAL PRIMARY KEY');
      console.log('   - email: VARCHAR(100)');
      console.log('   - otp_code: VARCHAR(6)');
      console.log('   - otp_type: VARCHAR(20)');
      console.log('   - user_type: VARCHAR(20)');
      console.log('   - is_used: BOOLEAN DEFAULT FALSE');
      console.log('   - expires_at: TIMESTAMP');
      console.log('   - created_at: TIMESTAMP DEFAULT NOW()');
    } else {
      throw new Error('Failed to create otp_codes table');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixOTPCodesTable().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

