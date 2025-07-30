// Constantes Globais
const QTD_PONTOS_CORTE = 2; // Número de pontos de corte para o cruzamento genético
const QTD_INDIVIDUOS = 5;   // Tamanho da população
const QTD_DISCIPLINAS_POR_PERIODO = 5;
const QTD_PROFESSORES = 10;
const QTD_HORARIOS_POR_DIA = 4;
const NOMES_PERIODOS = ['1º', '2º', '3º', '4º', '5º'];
const NOMES_DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

// Escolhe dois pais para cruzar
function selecao(populacaoOrdenada) {
  // Calcula o ponto que separa os melhores 50%
  const metade = Math.floor(populacaoOrdenada.length / 2);

  // Seleciona o primeiro pai entre os melhores (menor número de conflitos)
  const pai1 = JSON.parse(JSON.stringify(
    populacaoOrdenada[Math.floor(Math.random() * metade)]
  ));

  // Seleciona o segundo pai de forma completamente aleatória
  const pai2 = JSON.parse(JSON.stringify(
    populacaoOrdenada[Math.floor(Math.random() * populacaoOrdenada.length)]
  ));

  // Log de apoio para depuração
  console.log("\n🧬 Seleção de Pais");
  console.log("├── Pai 1 - Conflitos:", pai1._conflitos.length);
  console.log("└── Pai 2 - Conflitos:", pai2._conflitos.length);

  // Retorna os dois pais selecionados
  return [pai1, pai2];
}

// Mistura os genes dos pais (por período)
function cruzamento(pai1, pai2) {
  // Extrai os nomes dos períodos (excluindo propriedades como _conflitos)
  const periodos = Object.keys(pai1).filter(p => !p.startsWith('_'));

  const cortes = [];

  // Gera pontos de corte aleatórios, distintos entre si
  while (cortes.length < QTD_PONTOS_CORTE) {
    const ponto = Math.floor(Math.random() * (periodos.length - 1)) + 1;
    if (!cortes.includes(ponto)) cortes.push(ponto);
  }

  // Ordena os pontos de corte em ordem crescente
  cortes.sort((a, b) => a - b);

  console.log("\n🔀 Cruzamento");
  console.log("├── Pontos de corte:", cortes.join(', '));

  // Inicializa dois novos filhos com metadados vazios
  const filho1 = { _conflitos: [], _ocupacaoProfessores: {} };
  const filho2 = { _conflitos: [], _ocupacaoProfessores: {} };

  let alterna = false;

  // Para cada período, decide de qual pai os filhos herdam a grade
  for (let i = 0; i < periodos.length; i++) {
    const periodo = periodos[i];

    // Alterna a origem dos dados baseado nos pontos de corte
    const source1 = alterna ? pai2[periodo] : pai1[periodo];
    const source2 = alterna ? pai1[periodo] : pai2[periodo];

    // Copia a grade daquele período para cada filho
    filho1[periodo] = JSON.parse(JSON.stringify(source1));
    filho2[periodo] = JSON.parse(JSON.stringify(source2));

    // Se este índice é um ponto de corte, inverta o pai de origem
    if (cortes.includes(i + 1)) {
      alterna = !alterna;
    }
  }

  console.log("└── Filhos gerados (pré-avaliação)");
  return [filho1, filho2];
}

// Troca aleatória de duas células da grade
function mutacao(individuo) {
  // Seleciona aleatoriamente um período para aplicar mutação
  const periodos = Object.keys(individuo).filter(p => !p.startsWith('_'));
  const periodoEscolhido = periodos[Math.floor(Math.random() * periodos.length)];

  const grade = individuo[periodoEscolhido];
  const dias = Object.keys(grade);

  // Sorteia dois dias e dois horários
  const dia1 = dias[Math.floor(Math.random() * dias.length)];
  const dia2 = dias[Math.floor(Math.random() * dias.length)];
  const horario1 = Math.floor(Math.random() * QTD_HORARIOS_POR_DIA);
  const horario2 = Math.floor(Math.random() * QTD_HORARIOS_POR_DIA);

  // Troca os conteúdos entre duas posições na grade
  const temp = grade[dia1][horario1];
  grade[dia1][horario1] = grade[dia2][horario2];
  grade[dia2][horario2] = temp;

  // Log para rastrear a mutação aplicada
  console.log(`🔄 Mutação aplicada no período ${periodoEscolhido} (${dia1}-${horario1} ⇄ ${dia2}-${horario2})`);
}

// Conta conflitos de alocação por professor
function avaliarIndividuo(individuo) {
  // Inicializa estruturas auxiliares
  individuo._ocupacaoProfessores = {};
  individuo._conflitos = [];

  // Itera pelos períodos do indivíduo
  const periodos = Object.keys(individuo).filter(p => !p.startsWith('_'));

  for (const periodo of periodos) {
    const grade = individuo[periodo];

    // Para cada dia da semana
    for (const dia of Object.keys(grade)) {
      // Para cada horário daquele dia
      grade[dia].forEach((celula, horario) => {
        if (!celula || !celula.professor) return;

        const chave = `${dia}-${horario}`; // Identificador único do horário
        const nome = celula.professor;

        // Inicializa ocupação do professor, se necessário
        if (!individuo._ocupacaoProfessores[nome]) {
          individuo._ocupacaoProfessores[nome] = new Set();
        }

        // Se o professor já estava alocado neste horário, é conflito
        if (individuo._ocupacaoProfessores[nome].has(chave)) {
          individuo._conflitos.push({
            professor: nome,
            dia,
            horario,
            periodo
          });
        } else {
          // Caso contrário, marca como ocupado
          individuo._ocupacaoProfessores[nome].add(chave);
        }
      });
    }
  }

  // Feedback da avaliação
  console.log(`✅ Avaliação concluída - Conflitos detectados: ${individuo._conflitos.length}`);
}

// Executa ciclo genético completo
function gerarNovaPopulacao(populacaoOrdenada) {
  const novaPopulacao = [];
  let gerados = 0;

  console.log("\n🚧 Iniciando geração de nova população...");

  // Gera nova população com mesmo tamanho da anterior
  while (novaPopulacao.length < populacaoOrdenada.length) {
    // Etapa 1: seleção de pais
    const [pai1, pai2] = selecao(populacaoOrdenada);

    // Etapa 2: cruzamento
    const [filho1, filho2] = cruzamento(pai1, pai2);

    // Etapa 3: mutação (modificação aleatória)
    mutacao(filho1);
    mutacao(filho2);

    // Etapa 4: avaliação da qualidade dos filhos
    avaliarIndividuo(filho1);
    avaliarIndividuo(filho2);

    // Etapa 5: inclusão dos filhos na nova população
    novaPopulacao.push(filho1);
    gerados++;

    // Adiciona o segundo filho, se houver espaço
    if (novaPopulacao.length < populacaoOrdenada.length) {
      novaPopulacao.push(filho2);
      gerados++;
    }
  }

  console.log(`\n✅ Nova população gerada com ${gerados} indivíduos.`);
  return novaPopulacao;
}

module.exports = {
  selecao,
  cruzamento,
  gerarNovaPopulacao,
  mutacao,
  avaliarIndividuo,
};
