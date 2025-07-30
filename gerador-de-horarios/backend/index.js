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

// Função que gera a população inicial de indivíduos (grades horárias)
function popInicial(qtdIndividuos = QTD_INDIVIDUOS) {
  const populacao = []; // Lista onde serão armazenados todos os indivíduos

  // Gera 'qtdIndividuos' indivíduos
  for (let i = 0; i < qtdIndividuos; i++) {
    const individuo = {}; // Objeto que representará a grade horária de todos os períodos
    const disciplinaProfessorMap = {}; // Mapeia cada disciplina para um professor fixo
    individuo._ocupacaoProfessores = {}; // Guarda as alocações já feitas por professor
    individuo._conflitos = []; // Lista de conflitos (professor com sobreposição de horário)

    // Para cada período (ex: '1º', '2º', ..., '5º')
    NOMES_PERIODOS.forEach(periodo => {
      const grade = {}; // Grade de horários desse período
      const disciplinas = disciplinasPorPeriodo[periodo]; // Lista de 5 disciplinas do período

      // Embaralha os professores disponíveis para aleatoriedade na atribuição
      const professoresDisponiveis = [...professores].sort(() => Math.random() - 0.5);

      const todasCelulas = []; // Lista com todas as posições possíveis na grade (dia x horário)

      // Inicializa a grade para os 5 dias da semana, com 4 horários por dia
      NOMES_DIAS.forEach(dia => {
        grade[dia] = Array(QTD_HORARIOS_POR_DIA).fill(null); // Ex: [null, null, null, null]
        for (let h = 0; h < QTD_HORARIOS_POR_DIA; h++) {
          todasCelulas.push({ dia, horario: h }); // Salva todas as combinações possíveis
        }
      });

      // Embaralha a lista de células para sortear posições aleatórias
      todasCelulas.sort(() => Math.random() - 0.5);

      // Para cada disciplina do período, alocar 4 horários distintos
      for (const disciplina of disciplinas) {
        // Define o professor da disciplina (fixo por disciplina)
        let professor = disciplinaProfessorMap[disciplina.id] || professoresDisponiveis.pop();
        disciplinaProfessorMap[disciplina.id] = professor;

        let alocados = 0;

        // Enquanto não alocar os 4 horários da disciplina
        while (alocados < QTD_AULAS_POR_DISCIPLINA && todasCelulas.length > 0) {
          const celula = todasCelulas.pop(); // Pega uma célula aleatória disponível
          const chave = `${celula.dia}-${celula.horario}`; // Ex: "Segunda-2"

          // Inicializa o registro de ocupação do professor, se necessário
          if (!individuo._ocupacaoProfessores[professor.nome]) {
            individuo._ocupacaoProfessores[professor.nome] = new Set();
          }

          // Verifica se o professor já está ocupado nesse horário
          const estaOcupado = individuo._ocupacaoProfessores[professor.nome].has(chave);

          // Aloca a disciplina na grade
          grade[celula.dia][celula.horario] = {
            disciplina: disciplina.nome,
            professor: professor.nome,
          };
          alocados++;

          // Se o professor estiver ocupado, registra um conflito
          if (estaOcupado) {
            individuo._conflitos.push({
              professor: professor.nome,
              dia: celula.dia,
              horario: celula.horario,
              periodo,
            });
          } else {
            // Marca a ocupação desse horário para o professor
            individuo._ocupacaoProfessores[professor.nome].add(chave);
          }
        }
      }

      // Adiciona a grade horária finalizada ao indivíduo
      individuo[periodo] = grade;
    });

    // Adiciona o indivíduo completo à população
    populacao.push(individuo);
  }

  // Retorna a população gerada
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
