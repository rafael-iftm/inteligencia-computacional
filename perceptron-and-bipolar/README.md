# Simulação de Perceptron - Porta AND com Saída Bipolar

Este projeto simula o treinamento de um **Perceptron** simples para aprender a função lógica **AND** com **entradas binárias** e **saídas bipolares** (-1 e 1). O objetivo é encontrar os pesos corretos que resolvem o problema, utilizando uma **taxa de aprendizado de 1** e um **limiar de 0.2**.

## 🧠 Conceito

O Perceptron é um modelo de rede neural simples capaz de resolver problemas linearmente separáveis. Neste projeto, utilizamos o algoritmo de aprendizado supervisionado para ajustar os pesos com base no erro da saída prevista em relação à saída desejada.

### Tabela Verdade da Porta AND (Bipolar)

| Entrada X1 | Entrada X2 | Saída Esperada |
|------------|------------|----------------|
|     0      |     0      |      -1        |
|     0      |     1      |      -1        |
|     1      |     0      |      -1        |
|     1      |     1      |       1        |

## ⚙️ Parâmetros

- **Taxa de Aprendizado (η):** 1.0
- **Limiar (θ):** 0.2
- **Função de Ativação:** Bipolar (retorna 1 se o somatório for ≥ limiar, caso contrário retorna -1)
- **Pesos Iniciais:** Aleatórios ou definidos manualmente

## 🗂 Estrutura do Projeto

```
perceptron_and/
├── perceptron.py          # Código principal do Perceptron
├── simulacao.xlsx         # Simulação passo a passo em planilha (Excel)
├── README.md              # Este arquivo
```

## 🧪 Como Executar

### 📦 Passo 1 — Clonar o projeto (se necessário)
```bash
git clone https://github.com/rafael-iftm/inteligencia-computacional
cd perceptron-and-bipolar
```
### 📦 Passo 2 — Rodar o comando abaixo
```bash
python perceptron.py
```

Certifique-se de que você tenha o Python instalado. O código irá exibir os pesos ajustados ao final do treinamento.

## 📊 Resultados

A planilha `simulacao.xlsx` anexa contém a simulação completa do algoritmo, com:

- Tabela de entradas
- Saídas esperadas
- Pesos por época
- Cálculo do somatório e da função de ativação
- Correções aplicadas

## 🧑‍🏫 Aplicação Acadêmica

Este projeto pode ser usado como entrega em disciplinas de Redes Neurais, Inteligência Artificial ou Aprendizado de Máquina. A planilha foi feita para facilitar a compreensão do passo a passo.
