CREATE TABLE ranking (
  id_ranking SERIAL PRIMARY KEY,
  nome_jogador VARCHAR(25) NOT NULL,
  pontuacao INT NOT NULL,
  tempo_segundos INT NOT NULL,
  jogado_em TIMESTAMP DEFAULT NOW()
);
