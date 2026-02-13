const mysql2 = require('mysql2/promise');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors({ origin: '*' }));

let connection;

async function conectarMySQL() {
    try {
        connection = await mysql2.createConnection({
            host: 'mysql-3ba3c391-eujogominecraftpaulo99-728e.k.aivencloud.com',
            user: 'avnadmin',
            port: 20969,
            password: process.env.DB_PASSWORD,           
            database: 'defaultdb',
            ssl: {
                rejectUnauthorized: false
            }
        });

        // await connection.connect();
        console.log('>> [MySQL] Conectado com sucesso!');

        await connection.query('USE biblioteca');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                turma VARCHAR(255) NOT NULL,
                livroID VARCHAR(255) NOT NULL
            )
        `);
        console.log('>> [MySQL] Tabela de usuários criada com sucesso!');

    } catch (error) {
        console.log('>> [MySQL] Erro ao conectar:', error);
        return;
    }
}

app.get('/livros', async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM livros');
        res.json(rows);
    } catch (error) {
        console.log('>> [MySQL] Erro ao buscar livros:', error);
    }
});

app.get('/livros/:id', async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM livros WHERE slugID = ?', [req.params.id]);
        
        if(rows.length > 0) {
            res.json(rows[0]);
            // console.log('>> [MySQL] Livro encontrado com sucesso!');
        }
    } catch (error) {
        console.log('>> [MySQL] Erro ao buscar livro:', error);
    }
});



app.post('/usuarios', async (req, res) => {
    const { nome, turma, livroName } = req.body;
    
    try {
        await connection.query(`
            INSERT INTO usuarios (nome, turma, livroID) VALUES (?, ?, ?)
        `, [nome, turma, livroName]);
        // console.log(`>> [MySQL] O usuário ${nome} pegou o livro "${livroName}" emprestado!`);
        res.send({status: "ok200"});
    } catch (error) {
        console.log(`>> [MySQL] Erro ao registrar empréstimo: ${error}`);
    }
});

app.get('/carregarAlunos', async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM usuarios');
        res.json(rows);
        // console.log('>> [MySQL] Usuários carregados com sucesso!');
    } catch (error) {
        console.log('>> [MySQL] Erro ao buscar usuários:', error);
    }
});

app.post('/adicionarLivro', async (req, res) => {
    const {slugID, nomeLivro, autor, sinopse, descricao, capa} = req.body;
    
    try {
        await connection.query(`
            INSERT INTO livros (slugID, nomeLivro, autor, status, descricao, sinopse, capa) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [slugID, nomeLivro, autor, 'disponível', descricao, sinopse, capa]);
        // console.log(`>> [MySQL] O livro "${nomeLivro}" foi adicionado com sucesso!`);
        res.send({status: "ok200"});
    } catch (error) {
        console.log(`>> [MySQL] Erro ao adicionar livro: ${error}`);
    }
});

app.post('/emprestarLivro', async (req, res) => {
    const { slugID } = req.body;
    
    try {
        await connection.query('UPDATE livros SET status = ? WHERE slugID = ?', ['emprestado', slugID]);
        // console.log(`>> [MySQL] O livro ${slugID} foi emprestado com sucesso!`);
        res.send({status: "ok200"});
    } catch (error) {
        console.log(`>> [MySQL] Erro ao emprestar livro: ${error}`);
    }
});

app.post('/disponivelLivro', async (req, res) => {
    const { slugID } = req.body;
    
    try {
        await connection.query('UPDATE livros SET status = ? WHERE slugID = ?', ['disponível', slugID]);
        // console.log(`>> [MySQL] O livro ${slugID} foi devolvido com sucesso!`);
        res.send({status: "ok200"});
    } catch (error) {
        console.log(`>> [MySQL] Erro ao devolver livro: ${error}`);
    }
});

app.post('/teste', async (req, res) => {
    const { alunoNome } = req.body;
    try {
        await connection.query('DELETE FROM usuarios WHERE nome = ?', [alunoNome]);
        res.send({status: "ok200"});
    } catch (error) {
        console.log(`>> [MySQL] Erro ao deletar aluno: ${error}`);
    }
});

app.listen(3001, (error) => {
    if (error) {
        console.log('>> [Express] Erro ao rodar o servidor:', error);
        return;
    }
    console.log('>> [Express] Servidor rodando na porta 3001');
    conectarMySQL();
});