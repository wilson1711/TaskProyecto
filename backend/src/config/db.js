const {Pool} = require('pg');

require('dotenv').config();
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max:10,
    idleTimeout: 30000
});

const connectDB=async () => {
    try{
        const client = await pool.connect()
        console.log("Connected");
        client.release();

        // Migración de base de datos para categorías
        await pool.query(`
          CREATE TABLE IF NOT EXISTS categories (
            id          SERIAL PRIMARY KEY,
            name        VARCHAR(255) NOT NULL,
            description TEXT,
            user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE
          );
        `);

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
          console.log('Migration: category_id column added to tasks table.');
        }
    }catch(err){
        console.error("Error connecting to DB or running migration", err.message);
        process.exit(1);
    }
}


//if (require.main === module) {
//    connectDB();
//}

module.exports = { pool, connectDB };
