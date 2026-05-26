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
    }catch(err){
        console.error("Error connecting to DB", err.message);
        process.exit(1);
    }
}


//if (require.main === module) {
//    connectDB();
//}

module.exports = { pool, connectDB };
