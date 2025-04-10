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
- Cada disciplina ocupa 4 horas por dia
- Cada disciplina pertence exclusivamente a um período
- Cada professor pode ministrar no máximo uma disciplina por período.

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
