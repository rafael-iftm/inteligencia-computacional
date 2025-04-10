const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Etapa 1: Dados base
const periodos = ['1º', '2º', '3º', '4º', '5º'];
const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const horarios = [1, 2, 3, 4];

// Disciplinas vinculadas a períodos (5 para cada período)
const disciplinasPorPeriodo = {
  '1º': Array.from({ length: 5 }, (_, i) => ({
    id: `D${i + 1}`,
    nome: `Disciplina ${i + 1}`,
  })),
  '2º': Array.from({ length: 5 }, (_, i) => ({
    id: `D${i + 6}`,
    nome: `Disciplina ${i + 6}`,
  })),
  '3º': Array.from({ length: 5 }, (_, i) => ({
    id: `D${i + 11}`,
    nome: `Disciplina ${i + 11}`,
  })),
  '4º': Array.from({ length: 5 }, (_, i) => ({
    id: `D${i + 16}`,
    nome: `Disciplina ${i + 16}`,
  })),
  '5º': Array.from({ length: 5 }, (_, i) => ({
    id: `D${i + 21}`,
    nome: `Disciplina ${i + 21}`,
  })),
};

const professores = Array.from({ length: 10 }, (_, i) => ({
  id: `P${i + 1}`,
  nome: `Professor ${i + 1}`,
}));

// Etapa 2: Geração da população
function popInicial(qtdIndividuos = 5) {
  const populacao = [];

  for (let i = 0; i < qtdIndividuos; i++) {
    const individuo = {};

    periodos.forEach(periodo => {
      individuo[periodo] = {};
      const disciplinasDoPeriodo = disciplinasPorPeriodo[periodo];

      // Regra nova: manter um Set para controlar quais professores já foram usados nesse período
      const professoresUtilizadosNoPeriodo = new Set();

      dias.forEach(dia => {
        individuo[periodo][dia] = [];

        for (let h = 0; h < horarios.length; h++) {
          const disciplina = disciplinasDoPeriodo[Math.floor(Math.random() * disciplinasDoPeriodo.length)];

          // Seleciona um professor que ainda não foi usado nesse período
          const professoresDisponiveis = professores.filter(p => !professoresUtilizadosNoPeriodo.has(p.id));

          // Se todos os professores já foram usados, reinicia o controle
          if (professoresDisponiveis.length === 0) {
            professoresUtilizadosNoPeriodo.clear();
            professoresDisponiveis.push(...professores);
          }

          const professor = professoresDisponiveis[Math.floor(Math.random() * professoresDisponiveis.length)];
          professoresUtilizadosNoPeriodo.add(professor.id);

          individuo[periodo][dia].push({
            disciplina: disciplina.nome,
            professor: professor.nome,
          });
        }
      });
    });

    populacao.push(individuo);
  }

  return populacao;
}

// Etapa 3: Rota da API
app.get('/api/populacao', (req, res) => {
  const populacao = popInicial();
  res.json({ populacao });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
