const Pool = require("pg").Pool;
const dotenv = require('dotenv');
dotenv.config()

const pool = new Pool ({
    host: 'localhost',
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: 'captionQuest',
});

module.exports = pool