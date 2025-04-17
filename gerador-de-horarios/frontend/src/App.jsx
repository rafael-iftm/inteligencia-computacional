import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [populacao, setPopulacao] = useState([]);
  const [indiceIndividuo, setIndiceIndividuo] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:3001/api/populacao')
      .then((res) => setPopulacao(res.data.populacao))
      .catch((err) => console.error(err));
  }, []);

  const individuoAtual = populacao[indiceIndividuo];
  const periodos = ['1º', '2º', '3º', '4º', '5º'];
  const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const horarios = [1, 2, 3, 4];

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Gerador de Horários</h1>
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
                        const conflitos = individuoAtual._conflitos?.filter(
                          c => c.dia === dia && c.horario === index && c.professor === celula?.professor
                        );
                        const conflito = conflitos.length > 0;                        

                        const backgroundColor = conflito ? '#f44336' : '#fff'; // vermelho mais forte
                        const textColor = conflito ? '#fff' : '#333'; // texto branco em conflito

                        return (
                          <td
                            key={dia + index}
                            style={{
                              backgroundColor,
                              color: textColor,
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
