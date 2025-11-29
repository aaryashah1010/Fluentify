// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateChatTables() {
  try {
    console.log('🔄 Running chat tables migration...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../src/database/04-chat-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL
    await pool.query(sql);
    
    console.log('✅ Chat tables migration completed successfully!');
    console.log('📋 Created tables:');
    console.log('   - chat_messages');
    console.log('   - chat_sessions');
    console.log('   - Related indexes and triggers');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migration
migrateChatTables();
