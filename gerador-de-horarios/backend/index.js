// Importa o Express e o CORS
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Habilita CORS e JSON parsing para requisições
app.use(cors());
app.use(express.json());

// Dados base para construção da grade
const periodos = ['1º', '2º', '3º', '4º', '5º'];
const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const horarios = [1, 2, 3, 4];

// Define 25 disciplinas distribuídas entre os 5 períodos
const disciplinasPorPeriodo = {
  '1º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 1}`, nome: `Disciplina ${i + 1}` })),
  '2º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 6}`, nome: `Disciplina ${i + 6}` })),
  '3º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 11}`, nome: `Disciplina ${i + 11}` })),
  '4º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 16}`, nome: `Disciplina ${i + 16}` })),
  '5º': Array.from({ length: 5 }, (_, i) => ({ id: `D${i + 21}`, nome: `Disciplina ${i + 21}` })),
};

// Define 10 professores
const professores = Array.from({ length: 10 }, (_, i) => ({
  id: `P${i + 1}`,
  nome: `Professor ${i + 1}`,
}));

// Função que gera uma população inicial com N indivíduos
function popInicial(qtdIndividuos = 5) {
  const populacao = [];

  for (let i = 0; i < qtdIndividuos; i++) {
    const individuo = {};
    const disciplinaProfessorMap = {}; // Associa disciplinas a professores fixos
    individuo._ocupacaoProfessores = {}; // Para mapear conflitos
    individuo._conflitos = [];

    // Para cada período, gera uma grade horária
    periodos.forEach(periodo => {
      const grade = {};
      const disciplinas = disciplinasPorPeriodo[periodo];
      const professoresDisponiveis = [...professores].sort(() => Math.random() - 0.5); // Embaralha

      const todasCelulas = [];
      dias.forEach(dia => {
        grade[dia] = [null, null, null, null];
        for (let h = 0; h < 4; h++) {
          todasCelulas.push({ dia, horario: h });
        }
      });

      todasCelulas.sort(() => Math.random() - 0.5); // Embaralha células disponíveis

      for (const disciplina of disciplinas) {
        let professor;

        // Define professor fixo para a disciplina
        if (disciplinaProfessorMap[disciplina.id]) {
          professor = disciplinaProfessorMap[disciplina.id];
        } else {
          professor = professoresDisponiveis.pop();
          disciplinaProfessorMap[disciplina.id] = professor;
        }

        // Aloca a disciplina em 4 células
        let alocados = 0;
        while (alocados < 4 && todasCelulas.length > 0) {
          const celula = todasCelulas.pop();
          const chave = `${celula.dia}-${celula.horario}`;

          // Inicializa controle de ocupação do professor
          if (!individuo._ocupacaoProfessores[professor.nome]) {
            individuo._ocupacaoProfessores[professor.nome] = new Set();
          }

          const estaOcupado = individuo._ocupacaoProfessores[professor.nome].has(chave);

          // Preenche a célula com a disciplina
          grade[celula.dia][celula.horario] = {
            disciplina: disciplina.nome,
            professor: professor.nome
          };
          alocados++;

          if (estaOcupado) {
            // Registra conflito se o professor já estava alocado nesse horário
            individuo._conflitos.push({
              professor: professor.nome,
              dia: celula.dia,
              horario: celula.horario,
              periodo
            });
          } else {
            // Marca o horário como ocupado para o professor
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

// Rota da API que retorna a população gerada
app.get('/api/populacao', (req, res) => {
  const populacao = popInicial(); // Gera nova população
  res.json({ populacao });
});

// Inicia o servidor na porta 3001
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
