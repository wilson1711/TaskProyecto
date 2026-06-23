const { pool } = require('./src/config/db');

async function runMigration() {
  try {
    console.log('Starting category schema migration...');
    
    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        description TEXT,
        user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('Categories table verified/created.');
    
    // Add category_id column to tasks table if it doesn't exist
    const colCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'tasks' AND column_name = 'category_id'
    `);
    
    if (colCheck.rows.length === 0) {
      await pool.query(`
        ALTER TABLE tasks 
        ADD COLUMN category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL;
      `);
      console.log('category_id column added to tasks table.');
    } else {
      console.log('category_id column already exists in tasks table.');
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
