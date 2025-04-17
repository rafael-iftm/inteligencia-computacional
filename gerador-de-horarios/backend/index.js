const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const periodos = ['1º', '2º', '3º', '4º', '5º'];
const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const horarios = [1, 2, 3, 4];

const disciplinasPorPeriodo = {
  '1º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 1}`, nome: `Disciplina ${i + 1}` })),
  '2º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 6}`, nome: `Disciplina ${i + 6}` })),
  '3º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 11}`, nome: `Disciplina ${i + 11}` })),
  '4º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 16}`, nome: `Disciplina ${i + 16}` })),
  '5º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 21}`, nome: `Disciplina ${i + 21}` })),
};

const professores = Array.from({ length: 10 }, (_, i) => ({
  id: `P${i + 1}`,
  nome: `Professor ${i + 1}`,
}));

function popInicial(qtdIndividuos = 5) {
  const populacao = [];

  for (let i = 0; i < qtdIndividuos; i++) {
    const individuo = {};
    const disciplinaProfessorMap = {};
    individuo._ocupacaoProfessores = {};
    individuo._conflitos = [];

    periodos.forEach(periodo => {
      const grade = {};
      const disciplinas = disciplinasPorPeriodo[periodo];
      const professoresDisponiveis = [...professores].sort(() => Math.random() - 0.5);

      const todasCelulas = [];
      dias.forEach(dia => {
        grade[dia] = [null, null, null, null];
        for (let h = 0; h < 4; h++) {
          todasCelulas.push({ dia, horario: h });
        }
      });

      todasCelulas.sort(() => Math.random() - 0.5);

      for (const disciplina of disciplinas) {
        let professor;

        if (disciplinaProfessorMap[disciplina.id]) {
          professor = disciplinaProfessorMap[disciplina.id];
        } else {
          professor = professoresDisponiveis.pop();
          disciplinaProfessorMap[disciplina.id] = professor;
        }

        let alocados = 0;
        while (alocados < 4 && todasCelulas.length > 0) {
          const celula = todasCelulas.pop();
          const chave = `${celula.dia}-${celula.horario}`;

          if (!individuo._ocupacaoProfessores[professor.nome]) {
            individuo._ocupacaoProfessores[professor.nome] = new Set();
          }

          const estaOcupado = individuo._ocupacaoProfessores[professor.nome].has(chave);

          // Preenche mesmo se houver conflito
          grade[celula.dia][celula.horario] = {
            disciplina: disciplina.nome,
            professor: professor.nome
          };
          alocados++;

          if (estaOcupado) {
            individuo._conflitos.push({
              professor: professor.nome,
              dia: celula.dia,
              horario: celula.horario,
              periodo
            });
          } else {
            individuo._ocupacaoProfessores[professor.nome].add(chave);
          }
        }
      }

      individuo[periodo] = grade;
    });

    populacao.push(individuo);
  }

  return populacao;
}

app.get('/api/populacao', (req, res) => {
  const populacao = popInicial();
  res.json({ populacao });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
