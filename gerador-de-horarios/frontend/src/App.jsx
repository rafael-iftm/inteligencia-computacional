import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// 🔢 CONSTANTES
const NOMES_PERIODOS = ['1º', '2º', '3º', '4º', '5º'];
const NOMES_DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const QTD_HORARIOS_POR_DIA = 4;

function App() {
  const [populacao, setPopulacao] = useState([]);
  const [indiceIndividuo, setIndiceIndividuo] = useState(0);

  useEffect(() => {
    console.log('📡 Requisitando população inicial...');
    axios.get('http://localhost:3001/api/populacao')
      .then((res) => {
        const populacaoOrdenada = res.data.populacao.sort(
          (a, b) => (a._conflitos?.length || 0) - (b._conflitos?.length || 0)
        );
        console.log('✅ População inicial recebida do backend.');
        setPopulacao(populacaoOrdenada);
      })
      .catch((err) => {
        console.error('❌ Erro ao buscar população inicial:', err);
      });
  }, []);  

  const individuoAtual = populacao[indiceIndividuo];

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Gerador de Horários</h1>
  
      {/* Botão para gerar nova população cruzada */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => {
        console.log('🔁 Solicitando nova população (crossover)...');
        axios.get('http://localhost:3001/api/gerar')
          .then((res) => {
            const populacaoOrdenada = res.data.populacao.sort(
              (a, b) => (a._conflitos?.length || 0) - (b._conflitos?.length || 0)
            );
            console.log('✅ Nova população recebida e exibida.');
            setPopulacao(populacaoOrdenada);
            setIndiceIndividuo(0);
          })
          .catch((err) => {
            console.error('❌ Erro ao gerar nova população:', err);
          });
      }}>
        🔁 Gerar nova população (por cruzamento)
      </button>
      </div>
  
      {individuoAtual && (
        <p style={{ color: '#d32f2f', fontWeight: 'bold', marginBottom: '1rem' }}>
          🔴 Conflitos detectados: {individuoAtual._conflitos?.length || 0}
        </p>
      )}
  
      {populacao.length > 0 && (
        <>
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
  
          {NOMES_PERIODOS.map((periodo) => (
            <div key={periodo} style={{ marginBottom: '2rem' }}>
              <h2>Período {periodo}</h2>
              <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Horário</th>
                    {NOMES_DIAS.map((dia) => (
                      <th key={dia}>{dia}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: QTD_HORARIOS_POR_DIA }).map((_, index) => (
                    <tr key={index}>
                      <td><strong>{index + 1}º Horário</strong></td>
                      {NOMES_DIAS.map((dia) => {
                        const celula = individuoAtual[periodo][dia][index];
                        const conflitos = individuoAtual._conflitos?.filter(
                          c => c.dia === dia && c.horario === index && c.professor === celula?.professor
                        );
                        const conflito = conflitos.length > 0;
                        const backgroundColor = conflito ? '#f44336' : '#fff';
  
                        return (
                          <td
                            key={dia + index}
                            style={{
                              backgroundColor,
                              color: '#333',
                              transition: '0.2s all',
                            }}
                          >
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
  
      {populacao.length === 0 && (
        <p>Carregando população inicial...</p>
      )}
    </div>
  );  
}

export default App;
