// Importa o Express e o CORS
const express = require('express');
const cors = require('cors');
const { gerarNovaPopulacao } = require('./genetico');

const app = express();
const PORT = 3001;

// 🔢 CONSTANTES GLOBAIS
const QTD_PERIODOS = 5;
const QTD_DIAS_POR_SEMANA = 5;
const QTD_HORARIOS_POR_DIA = 4;
const QTD_DISCIPLINAS_POR_PERIODO = 5;
const QTD_PROFESSORES = 10;
const QTD_DISCIPLINAS = QTD_PERIODOS * QTD_DISCIPLINAS_POR_PERIODO;
const QTD_AULAS_POR_DISCIPLINA = 4;
const QTD_INDIVIDUOS = 5;

const NOMES_PERIODOS = ['1º', '2º', '3º', '4º', '5º'];
const NOMES_DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const HORARIOS = Array.from({ length: QTD_HORARIOS_POR_DIA }, (_, i) => i + 1);

// Middleware
app.use(cors());
app.use(express.json());

// Gera disciplinas distribuídas por período
const disciplinasPorPeriodo = Object.fromEntries(
  NOMES_PERIODOS.map((periodo, idx) => {
    const inicio = idx * QTD_DISCIPLINAS_POR_PERIODO + 1;
    const disciplinas = Array.from({ length: QTD_DISCIPLINAS_POR_PERIODO }, (_, i) => ({
      id: `D${inicio + i}`,
      nome: `Disciplina ${inicio + i}`,
    }));
    return [periodo, disciplinas];
  })
);

// Gera professores
const professores = Array.from({ length: QTD_PROFESSORES }, (_, i) => ({
  id: `P${i + 1}`,
  nome: `Professor ${i + 1}`,
}));

// Função que gera a população inicial
function popInicial(qtdIndividuos = QTD_INDIVIDUOS) {
  const populacao = [];

  for (let i = 0; i < qtdIndividuos; i++) {
    const individuo = {};
    const disciplinaProfessorMap = {};
    individuo._ocupacaoProfessores = {};
    individuo._conflitos = [];

    NOMES_PERIODOS.forEach(periodo => {
      const grade = {};
      const disciplinas = disciplinasPorPeriodo[periodo];
      const professoresDisponiveis = [...professores].sort(() => Math.random() - 0.5);

      const todasCelulas = [];
      NOMES_DIAS.forEach(dia => {
        grade[dia] = Array(QTD_HORARIOS_POR_DIA).fill(null);
        for (let h = 0; h < QTD_HORARIOS_POR_DIA; h++) {
          todasCelulas.push({ dia, horario: h });
        }
      });

      todasCelulas.sort(() => Math.random() - 0.5);

      for (const disciplina of disciplinas) {
        let professor = disciplinaProfessorMap[disciplina.id] || professoresDisponiveis.pop();
        disciplinaProfessorMap[disciplina.id] = professor;

        let alocados = 0;
        while (alocados < QTD_AULAS_POR_DISCIPLINA && todasCelulas.length > 0) {
          const celula = todasCelulas.pop();
          const chave = `${celula.dia}-${celula.horario}`;

          if (!individuo._ocupacaoProfessores[professor.nome]) {
            individuo._ocupacaoProfessores[professor.nome] = new Set();
          }

          const estaOcupado = individuo._ocupacaoProfessores[professor.nome].has(chave);

          grade[celula.dia][celula.horario] = {
            disciplina: disciplina.nome,
            professor: professor.nome,
          };
          alocados++;

          if (estaOcupado) {
            individuo._conflitos.push({
              professor: professor.nome,
              dia: celula.dia,
              horario: celula.horario,
              periodo,
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

// Rota da API
app.get('/api/populacao', (req, res) => {
  console.log('\n📥 [GET] /api/populacao - Gerando população inicial aleatória...');
  const populacao = popInicial();
  console.log(`✅ População inicial gerada com ${populacao.length} indivíduos.`);
  res.json({ populacao });
});

// Rota que retorna nova geração cruzada
app.get('/api/gerar', (req, res) => {
  console.log('\n📥 [GET] /api/gerar - Gerando nova geração por cruzamento genético...');
  const populacaoOriginal = popInicial();
  const populacaoOrdenada = populacaoOriginal.sort(
    (a, b) => (a._conflitos?.length || 0) - (b._conflitos?.length || 0)
  );
  const novaGeracao = gerarNovaPopulacao(populacaoOrdenada);
  console.log('✅ Geração concluída e enviada ao frontend.\n');
  res.json({ populacao: novaGeracao });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
});
