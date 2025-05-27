const QTD_PONTOS_CORTE = 2;
const QTD_INDIVIDUOS = 5;
const QTD_DISCIPLINAS_POR_PERIODO = 5;
const QTD_PROFESSORES = 10;
const QTD_HORARIOS_POR_DIA = 4;
const NOMES_PERIODOS = ['1º', '2º', '3º', '4º', '5º'];
const NOMES_DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

function selecao(populacaoOrdenada) {
  const metade = Math.floor(populacaoOrdenada.length / 2);
  const pai1 = JSON.parse(JSON.stringify(
    populacaoOrdenada[Math.floor(Math.random() * metade)]
  ));
  const pai2 = JSON.parse(JSON.stringify(
    populacaoOrdenada[Math.floor(Math.random() * populacaoOrdenada.length)]
  ));
  console.log("\n🧬 Seleção de Pais");
  console.log("├── Pai 1 - Conflitos:", pai1._conflitos.length);
  console.log("└── Pai 2 - Conflitos:", pai2._conflitos.length);
  return [pai1, pai2];
}

function cruzamento(pai1, pai2) {
  const periodos = Object.keys(pai1).filter(p => !p.startsWith('_'));
  const cortes = [];

  while (cortes.length < QTD_PONTOS_CORTE) {
    const ponto = Math.floor(Math.random() * (periodos.length - 1)) + 1;
    if (!cortes.includes(ponto)) cortes.push(ponto);
  }
  cortes.sort((a, b) => a - b);

  console.log("\n🔀 Cruzamento");
  console.log("├── Pontos de corte:", cortes.join(', '));

  const filho1 = { _conflitos: [], _ocupacaoProfessores: {} };
  const filho2 = { _conflitos: [], _ocupacaoProfessores: {} };

  let alterna = false;
  for (let i = 0; i < periodos.length; i++) {
    const periodo = periodos[i];
    const source1 = alterna ? pai2[periodo] : pai1[periodo];
    const source2 = alterna ? pai1[periodo] : pai2[periodo];

    filho1[periodo] = JSON.parse(JSON.stringify(source1));
    filho2[periodo] = JSON.parse(JSON.stringify(source2));

    if (cortes.includes(i + 1)) {
      alterna = !alterna;
    }
  }

  console.log("└── Filhos gerados (pré-avaliação)");
  return [filho1, filho2];
}

function avaliarIndividuo(individuo) {
  individuo._ocupacaoProfessores = {};
  individuo._conflitos = [];

  const periodos = Object.keys(individuo).filter(p => !p.startsWith('_'));
  for (const periodo of periodos) {
    const grade = individuo[periodo];
    for (const dia of Object.keys(grade)) {
      grade[dia].forEach((celula, horario) => {
        if (!celula || !celula.professor) return;
        const chave = `${dia}-${horario}`;
        const nome = celula.professor;

        if (!individuo._ocupacaoProfessores[nome]) {
          individuo._ocupacaoProfessores[nome] = new Set();
        }

        if (individuo._ocupacaoProfessores[nome].has(chave)) {
          individuo._conflitos.push({
            professor: nome,
            dia,
            horario,
            periodo
          });
        } else {
          individuo._ocupacaoProfessores[nome].add(chave);
        }
      });
    }
  }
  console.log(`✅ Avaliação concluída - Conflitos detectados: ${individuo._conflitos.length}`);
}

function gerarNovaPopulacao(populacaoOrdenada) {
  const novaPopulacao = [];
  let gerados = 0;
  console.log("\n🚧 Iniciando geração de nova população...");
  while (novaPopulacao.length < populacaoOrdenada.length) {
    const [pai1, pai2] = selecao(populacaoOrdenada);
    const [filho1, filho2] = cruzamento(pai1, pai2);
    mutacao(filho1);
    mutacao(filho2);
    avaliarIndividuo(filho1);
    avaliarIndividuo(filho2);
    novaPopulacao.push(filho1);
    gerados++;
    if (novaPopulacao.length < populacaoOrdenada.length) {
      novaPopulacao.push(filho2);
      gerados++;
    }
  }
  console.log(`\n✅ Nova população gerada com ${gerados} indivíduos.`);
  return novaPopulacao;
}

function mutacao(individuo) {
  const periodos = Object.keys(individuo).filter(p => !p.startsWith('_'));
  const periodoEscolhido = periodos[Math.floor(Math.random() * periodos.length)];
  const grade = individuo[periodoEscolhido];
  const dias = Object.keys(grade);

  const dia1 = dias[Math.floor(Math.random() * dias.length)];
  const dia2 = dias[Math.floor(Math.random() * dias.length)];
  const horario1 = Math.floor(Math.random() * QTD_HORARIOS_POR_DIA);
  const horario2 = Math.floor(Math.random() * QTD_HORARIOS_POR_DIA);

  const temp = grade[dia1][horario1];
  grade[dia1][horario1] = grade[dia2][horario2];
  grade[dia2][horario2] = temp;

  console.log(`🔄 Mutação aplicada no período ${periodoEscolhido} (${dia1}-${horario1} ⇄ ${dia2}-${horario2})`);
}


module.exports = {
  selecao,
  cruzamento,
  gerarNovaPopulacao,
  mutacao,
  avaliarIndividuo,
};
