# 🧠 Gerador Automático de Horários — Algoritmos Genéticos

Este projeto foi desenvolvido como parte da disciplina de **Inteligência Computacional**, ministrada pelo Prof. Dr. Clarimundo Machado Moraes Júnior.

## 🎯 Objetivo da Atividade

Criar uma aplicação web capaz de gerar automaticamente grades de horários acadêmicos utilizando **algoritmos genéticos**.

### 🔍 Cenário Real

- 5 períodos
- 5 dias da semana (segunda a sexta)
- 4 horários por dia
- 25 disciplinas
- 10 professores
- Cada disciplina pertence exclusivamente a um período
- Cada disciplina ocupa exatamente 4 horários por semana
- Cada disciplina é ministrada sempre pelo mesmo professor (fixo por indivíduo)
- Um professor não pode estar em dois lugares ao mesmo tempo (caso isso ocorra, o conflito é sinalizado de vermelho)

### ✅ Solução construída

O sistema é dividido em:

- `backend/`: responsável pela lógica de geração da população inicial
- `frontend/`: interface web que permite visualizar as grades geradas por indivíduo

A cada execução, uma nova **população de soluções aleatórias viáveis** é gerada respeitando a distribuição de disciplinas por período.

---

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
