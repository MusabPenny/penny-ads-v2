const sql = require("mssql");
require('dotenv').config();

const config = {
    server: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "test",
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 60000 
    },
    authentication: {
        type: "default",
        options: {
            userName: process.env.DB_USER || "musab.kozlic",
            password: process.env.DB_PASSWORD || "musab.kozlic",
        }
    },
    port: Number(process.env.DB_PORT) || 1433,
}

let connectionPromise;


async function getConnection() {
    if (!connectionPromise) {
        connectionPromise = sql.connect(config);
    } 

    try {
        const pool = await connectionPromise;
        console.log("Connected to the database successfully");
        if (!pool.connected) {
            connectionPromise = null;
            return await getConnection();
        }
        return pool;
    } catch (error) {
        console.error("Database connection error:", error.message);
        connectionPromise = null;
        throw error;
    }
}

module.exports = { sql, getConnection };