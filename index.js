const mysql2 = require('mysql2/promise');
const cors = require('cors');
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

let pool;

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

async function main() {
    try {
        connection = await mysql2.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'defaultdb',
        port: process.env.DB_PORT,
        ssl: { rejectUnauthorized: false }
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
    });

        await connection.query('USE ipfav');

        console.log('>> MySQL connection established');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
    }
}

app.get('/events', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM eventos');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching events:', error);
    }
});

app.post('/eventsCreate', async (req, res) => {
    try {
        const { titulo, data_evento, hora_evento, descricao, local_evento, linkVideo, publicOrMember } = req.body;
        const [result] = await pool.query('INSERT INTO eventos (titulo, data_evento, hora_evento, descricao, local_evento, linkVideo, publicOrMember) VALUES (?, ?, ?, ?, ?, ?, ?)', [titulo, data_evento, hora_evento, descricao, local_evento, linkVideo, publicOrMember]);

        res.json({ message: 'Evento criado com sucesso!' });
    } catch (error) {
        console.error('Error creating event:', error);
    }
});

app.get('/events/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM eventos WHERE titulo = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching event:', error);
    }
});


app.get('/posts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM posts');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});

app.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM posts WHERE titulo = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching post:', error);
    }
});

app.post('/postsCreate', async (req, res) => {
    try {
        const { slugId, titulo, conteudo, autorPost, dataPost } = req.body;
        const [result] = await pool.query('INSERT INTO posts (slugId, titulo, conteudo, autorPost, dataPost) VALUES (?, ?, ?, ?, ?)', [slugId, titulo, conteudo, autorPost, dataPost]);

    } catch (error) {
        console.error('Error creating post:', error);
    }
});

app.post('/postsDelete', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query('DELETE FROM posts WHERE titulo = ?', [id]);
        console.log(id);

        res.json({ message: 'Post deletado com sucesso!' });
    } catch (error) {
        console.error('Error deleting post:', error);
    }
});

app.post('/eventsDelete', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query('DELETE FROM eventos WHERE titulo = ?', [id]);

        res.json({ message: 'Evento deletado com sucesso!' });
    } catch (error) {
        console.error('Error deleting event:', error);
    }
});

app.get('/members', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM members');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching members:', error);
    }
});

app.post('/membersCreate', async (req, res) => {
    try {
        const { nome, funcao } = req.body;
        const [result] = await pool.query('INSERT INTO members (memberName, memberFunction) VALUES (?, ?)', [nome, funcao]);

        res.json({ message: 'Membro criado com sucesso!' });
    } catch (error) {
        console.error('Error creating member:', error);
    }
});

app.get('/membersDelete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM members WHERE id = ?', [id]);

        res.json({ message: 'Membro deletado com sucesso!' });
    } catch (error) {
        console.error('Error deleting member:', error);
    }
});

app.post('/claude', async (req, res) => {
    try {
        const { pergunta } = req.body;
        const response = await anthropic.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 800,
            system: 'Você é um assistente gentil de uma igreja. Responda de forma bíblica e acolhedora.',
            messages: [{ role: 'user', content: pergunta }],
        });
        res.json({ message: response.content[0].text });
    } catch (error) {
        console.log('Error:', error);
    }
});

app.get('/ping', (req, res) => {
    res.json({ status: 'alive' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    main();
});








