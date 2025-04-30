# 🧠 Gerador Automático de Horários — Algoritmos Genéticos

Este projeto foi desenvolvido como parte da disciplina de **Inteligência Computacional**, ministrada pelo Prof. Dr. Clarimundo Machado Moraes Júnior.

## 🎯 Objetivo da Atividade

Criar uma aplicação web capaz de gerar automaticamente grades de horários acadêmicos utilizando **algoritmos genéticos**.

## ✅ Solução construída

O sistema é dividido em:

- `backend/`: responsável pela lógica de geração da população inicial
- `frontend/`: interface web que permite visualizar as grades geradas por indivíduo

A cada execução, uma nova **população de soluções aleatórias viáveis** é gerada respeitando a distribuição de disciplinas por período.

## 📁 Estrutura

```
gerador-de-horarios/
├── backend/       # API Node.js com Express
├── frontend/      # Interface React com Vite
```

## 🚀 Como Rodar o Projeto

### 📦 Passo 1 — Clonar o projeto (se necessário)
```bash
git clone https://github.com/rafael-iftm/inteligencia-computacional
cd gerador-de-horarios
```

### 📦 Passo 2 — Instalar as dependências (de backend e frontend)
```bash
npm install
```

### ▶️ Passo 3 — Rodar o projeto completo (backend + frontend)
```bash
npm start
```

## 🧾 Regras de Negócio

### 🧠 Geração de População Inicial (`/api/populacao`)
- Cada indivíduo representa uma grade horária completa.
- A grade é composta por:
  - 5 períodos
  - 5 dias (segunda a sexta)
  - 4 horários por dia
- Cada período possui 5 disciplinas, totalizando 25 disciplinas.
- Cada disciplina:
  - Pertence exclusivamente a um período
  - É ministrada sempre pelo mesmo professor (fixo por indivíduo)
  - Ocupa 4 horários distintos na semana
- Um professor não pode ser alocado em mais de um horário simultaneamente.
- Conflitos de sobreposição de professores são identificados e destacados visualmente.

### 🔁 Geração Evolutiva (`/api/gerar`)
- Utiliza algoritmo genético com múltiplos pontos de corte.
- **Seleção dos pais:**
  - `Pai 1`: escolhido aleatoriamente da melhor metade da população.
  - `Pai 2`: escolhido aleatoriamente da população inteira.
- **Cruzamento:**
  - Mistura os períodos dos pais com base em pontos de corte definidos aleatoriamente.
- **Avaliação:**
  - Cada filho é analisado para identificar conflitos e reavaliar a ocupação dos professores.
- A nova população gerada é ordenada pela quantidade de conflitos (do menor para o maior).
