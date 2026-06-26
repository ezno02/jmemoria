const DATABASE_URL = "postgresql://neondb_owner:npg_ABiGwmFr1U8c@ep-twilight-sound-ac8b61fo-pooler.sa-east-1.aws.neon.tech/prova_ezequiel_jogo_memoria?sslmode=require&channel_binding=require";

const host = new URL(DATABASE_URL).host;
const neonHttpEndpoint = `https://${host}/sql`;


async function executarQueryNeon(querySQL, parametros = []) {
    try {
        const resposta = await fetch(neonHttpEndpoint, {
            method: 'POST',
            headers: {
                'Neon-Connection-String': DATABASE_URL,
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                query: querySQL,
                params: parametros
            })
        });

        if (!resposta.ok) {
            const erroTexto = await resposta.text();
            throw new Error(`Erro HTTP ${resposta.status}: ${erroTexto}`);
        }

        const dados = await resposta.json();
        return dados.rows;

    } catch (erro) {
        console.error("Falha ao comunicar com o banco de dados:", erro);
        return null;
    }
}
// read
export async function buscarLeaderboard() {
    console.log("get pontuacao");
    const query = 'SELECT * FROM ranking ORDER BY pontuacao DESC LIMIT 10';

    const linhas = await executarQueryNeon(query);
    return linhas || [];
}

// create
export async function salvarPontuacao(nome_jogador, pontuacao, tempo_segundos) {
    console.log("Cadastrando usuário no banco:", { nome_jogador, pontuacao, tempo_segundos });
    const query = 'INSERT INTO ranking (nome_jogador, pontuacao, tempo_segundos) VALUES ($1, $2, $3) RETURNING *';
    const params = [nome_jogador, pontuacao, tempo_segundos];

    const linhas = await executarQueryNeon(query, params);
    return linhas !== null;
}