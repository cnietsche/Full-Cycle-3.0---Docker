const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

const dbConfig = {
    host: process.env.MYSQL_HOST || 'db',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'rootpassword',
    database: process.env.MYSQL_DATABASE || 'fullcycle'
};

let pool;

async function initDb(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            pool = await mysql.createPool(dbConfig);
            await pool.query(`
                CREATE TABLE IF NOT EXISTS people (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL
                )
            `);
            return;
        } catch (error) {
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }
}

app.get('/', async (req, res) => {
    try {
        await pool.query(`INSERT INTO people (name) VALUES (?)`, ['Full Cycle']);

        const [rows] = await pool.query(`SELECT name FROM people`);

        let html = `<h1>Full Cycle Rocks!</h1><ul>`;
        rows.forEach(row => {
            html += `<li>${row.name}</li>`;
        });
        html += '</ul>';

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

initDb().then(() => {
    app.listen(PORT, () => {
        console.log(`App rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error('Erro ao inicializar DB:', err);
    process.exit(1);
});
