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
    const disciplinaProfessorMap = {}; // disciplina.id -> professor

    periodos.forEach(periodo => {
      const grade = {};
      const disciplinas = disciplinasPorPeriodo[periodo];
      const contagemHorarios = {};
      const professoresDisponiveis = [...professores].sort(() => Math.random() - 0.5);

      disciplinas.forEach(d => contagemHorarios[d.id] = 0);
      const todasCelulas = [];

      // Cria estrutura da grade por dia e monta todas as posições disponíveis
      dias.forEach(dia => {
        grade[dia] = [null, null, null, null];
        for (let h = 0; h < 4; h++) {
          todasCelulas.push({ dia, horario: h });
        }
      });

      // Embaralha as células para alocação aleatória
      todasCelulas.sort(() => Math.random() - 0.5);

      // Alocar 4 horários por disciplina, com professor fixo
      for (const disciplina of disciplinas) {
        let professor;

        if (disciplinaProfessorMap[disciplina.id]) {
          professor = disciplinaProfessorMap[disciplina.id];
        } else {
          // Atribui professor aleatório ainda não usado com outra disciplina
          professor = professoresDisponiveis.pop();
          disciplinaProfessorMap[disciplina.id] = professor;
        }

        let alocados = 0;
        while (alocados < 4 && todasCelulas.length > 0) {
          const celula = todasCelulas.pop();
          if (grade[celula.dia][celula.horario] === null) {
            grade[celula.dia][celula.horario] = {
              disciplina: disciplina.nome,
              professor: professor.nome
            };
            alocados++;
          }
        }
      }

      individuo[periodo] = grade;
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
