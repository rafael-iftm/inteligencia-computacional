// Importa os hooks de estado e efeito do React
import { useEffect, useState } from 'react';
// Importa a lib axios para fazer requisições HTTP
import axios from 'axios';
// Importa os estilos do App
import './App.css';

function App() {
  // Estado que guarda a população (lista de indivíduos gerados)
  const [populacao, setPopulacao] = useState([]);

  // Índice do indivíduo atualmente sendo visualizado
  const [indiceIndividuo, setIndiceIndividuo] = useState(0);

  // Hook que roda apenas uma vez quando o componente monta
  useEffect(() => {
    // Faz uma requisição GET para a API que gera a população
    axios.get('http://localhost:3001/api/populacao')
      .then((res) => {
        // Ordena os indivíduos pela quantidade de conflitos (do menor para o maior)
        const populacaoOrdenada = res.data.populacao.sort(
          (a, b) => (a._conflitos?.length || 0) - (b._conflitos?.length || 0)
        );
        // Salva no estado a população já ordenada
        setPopulacao(populacaoOrdenada);
      })
      .catch((err) => console.error(err)); // Captura erro se a API falhar
  }, []);

  // Seleciona o indivíduo atual com base no índice
  const individuoAtual = populacao[indiceIndividuo];

  // Constantes auxiliares para renderização da grade
  const periodos = ['1º', '2º', '3º', '4º', '5º'];
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const horarios = [1, 2, 3, 4];

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Gerador de Horários</h1>

      {/* Mostra a quantidade de conflitos do indivíduo atual */}
      {individuoAtual && (
        <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '1rem' }}>
          🔴 Conflitos detectados: {individuoAtual._conflitos?.length || 0}
        </p>
      )}

      {/* Se a população estiver carregada, renderiza as grades */}
      {populacao.length > 0 && (
        <>
          {/* Navegação entre indivíduos */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              disabled={indiceIndividuo === 0}
              onClick={() => setIndiceIndividuo(indiceIndividuo - 1)}
            >
              ← Anterior
            </button>

            <span style={{ margin: '0 1rem' }}>
              Grade Horária {indiceIndividuo + 1} de {populacao.length}
            </span>

            <button
              disabled={indiceIndividuo === populacao.length - 1}
              onClick={() => setIndiceIndividuo(indiceIndividuo + 1)}
            >
              Próximo →
            </button>
          </div>

          {/* Renderiza a grade para cada período */}
          {periodos.map((periodo) => (
            <div key={periodo} style={{ marginBottom: '2rem' }}>
              <h2>Período {periodo}</h2>
              <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Horário</th>
                    {dias.map((dia) => (
                      <th key={dia}>{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((_, index) => (
                    <tr key={index}>
                      <td><strong>{index + 1}º Horário</strong></td>
                      {dias.map((dia) => {
                        const celula = individuoAtual[periodo][dia][index];

                        // Verifica se há conflito naquela célula
                        const conflitos = individuoAtual._conflitos?.filter(
                          c => c.dia === dia && c.horario === index && c.professor === celula?.professor
                        );
                        const conflito = conflitos.length > 0;

                        // Define cores com base em conflito
                        const backgroundColor = conflito ? '#f44336' : '#fff';
                        const textColor = conflito ? '#fff' : '#333';

                        return (
                          <td
                            key={dia + index}
                            style={{
                              backgroundColor,
                              color: textColor,
                              transition: '0.2s all',
                            }}
                          >
                            {/* Informações da célula: disciplina e professor */}
                            <div><strong>{celula?.disciplina}</strong></div>
                            <div style={{ fontSize: '0.85em' }}>{celula?.professor}</div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}

      {/* Caso ainda não tenha carregado a população */}
      {populacao.length === 0 && (
        <p>Carregando população inicial...</p>
      )}
    </div>
  );
}

export default App;
