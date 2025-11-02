

---

# 🐼 SLP-SLEEP-LIKE-A-PANDA

*Durma Melhor, Viva de Forma Mais Inteligente, Acorde Revigorado*

Construído com as seguintes ferramentas e tecnologias/Built using the following tools and technologies: **JSON, Markdown, npm, JavaScript, React, Vite, ESLint, Axios**  
  
![SLP-banner](/src/assets/slpBanner.jpg)  

---

## 📖 General concept/Visão Geral

### 🚨 Target problem/Problema abordado  

O problema com o qual queremos lidar, é a falta de controle sobre o sono. Em tempos de tamanha ansiedade e preocupação presentes em nossa sociedade, cuidar de nosso sono, recarregar nossas baterias, é essencal, porém mais complicado do que nunca.  

## 💡 Solution/Solução  

A solução que elaboramos para resolver o problema, foi criar uma aplicação que permita aos usuários definir ***alarmes*** em ***horários e datas específicos***, controlando mais fácilmente seu ciclo de sono e tendo um ***ambiente mais interativo*** do que o dos despertadores virtuais tradicionais.

### 🚀 Why SLP-Sleep-Like-a-Panda/Por que SLP-Sleep-Like-a-Panda?  

Queremos fornecer uma plataforma **confiável e amigável** com **atualizações em tempo real** e **navegação fluida**.  

**SLP-Sleep-Like-a-Panda-** é uma aplicação web moderna baseada em React, projetada para oferecer uma experiência suave e envolvente no gerenciamento de sono e alarmes.
Com foco em **manutenibilidade e escalabilidade**, utiliza **Vite** para desenvolvimento rápido e uma arquitetura modular que simplifica fluxos de trabalho complexos no frontend.  

### 🧱 Main features/Principais funcionalidades  

* 🛠️ **ESLint configuration/Configuração ESLint:** garante qualidade de código e boas práticas.
* ⚡ **Vite + React configuration/Configuração Vite + React:** builds rápidos, HMR e desenvolvimento otimizado.
* 🧩 **Modular architecture/Arquitetura Modular:** organização de rotas, layouts e componentes.
* ⏱️ **Real time clock/Relógio em Tempo Real:** sincronizado com banco de dados remoto para contagens regressivas e alarmes.
* 🔗 **Centralized context & API/Contexto & API Centralizados:** fluxo de dados eficiente e comunicação backend.
* 🎨 **Customizable UI components/Componentes de UI Personalizáveis:** consistência visual e interações aprimoradas.  

### 👥 Project members/Membros do projeto  

Os **integrantes** deste projeto são os alunos:  
* Celso Fischer Neto
* Francisco Felipe da Silva
* Gabriel de Oliveira Mello

### 🏫 Our institution/Nossa instituição  

Todos os integrantes deste projeto são estudantes do **Centro Paula Souza**, na **ETEC Jacinto Ferreira de Sá, em Ourinhos, São Paulo.**

### 📧 Contact/Contato  

Podemos ser contatados através do email **gabrielmello8986@gmail.com**.  

---  

## 🛠️ Contributing/Contribuindo  

### 🔗 Submiting a PullRequest/Enviando um PullRequest  

* 📍 Busque ser **objetivo** e escolha **nomes claros e simples** para as alterações.
* 📃 Procure manter o projeto e mudanças **bem documentados**.
* ⌛️ Devido ao tamanho da equipe, podemos levar algum **tempo** para **analisar, aceitar e/ou dar devolutivas** sobre cada PullRequest.

### 📩 Other suggestions/Outras sugestões  

* 🗣 Qualquer tipo de **sugestão**, **conselho**, sobre qualquer forma de **melhoria** do projeto e **feedback**, serão muito bem vindos.
* 📧 Pode-se usar o Email **gabrielmello8986@gmail.com** para enviar tais sugestões.

---  

## ☁️ Hosted project link/Link do projeto hospedado  

O link para o projeto já hospedado na plataforma Vercel é: https://slp-sleep-like-a-panda.vercel.app/ .  

---  

## 🪛 First steps(locally running the project)/Primeiros Passos(rodando o projeto localmente)

### 📌 Requirements/Pré-requisitos

Este projeto requer as seguintes dependências:

* **Programming language/Linguagem de Programação:** JavaScript
* **Package manager/Gerenciador de Pacotes:** npm
* **NodeJS version/Versão do NodeJS:** NodeJS **v22.14.0**

### ⚙️ Installing/Instalação

Construa o projeto a partir do código-fonte e instale as dependências:

```sh
# Cloning the repository/Clonar o repositório
git clone https://github.com/Gabriel-Mello-Dev/Slp-Sleep-Like-a-Panda-

# Entering the project directory/Entrar no diretório do projeto
cd Slp-Sleep-Like-a-Panda-

# Installing dependencies/Instalar dependências
npm install
```

### Estrutura de Dados (db.json)
 ```

Este artefato JSON simula o estado de dados persistente (base de dados mock) para o projeto, contendo as coleções users e tempos. É utilizado em ambientes de desenvolvimento para simular uma API RESTful completa.
1. Coleções Principais
O arquivo consiste em um objeto raiz contendo dois arrays:
1.1. users
Contém o perfil, credenciais e personalizações (skins) dos usuários.
Campo
Tipo
Descrição
id
string
ID único do usuário.
nome
string
Nome de exibição.
email
string
Credencial de login (e-mail).
senha
string
Senha em texto simples. (ALERTA DE SEGURANÇA)
skinEquipada
string
ID da skin atualmente ativa.
skinsCompradas
Array<string>
IDs das skins que o usuário possui.

1.2. tempos
Contém registros de eventos cronometrados ou agendamentos, com um schema heterogêneo.
Tipo de Registro
Campos Chave
Detalhes
Score/Tempo
id, userId (number), horario (number), tipo (number)
Usado para pontuações ou registros de tempo numéricos.
Agendamento
id, userId (string), dia, mes, horario (HH:MM), mensagem
Usado para agendamentos textuais com data e hora.

2. Configuração e Uso Rápido (json-server)
Para simular uma API RESTful a partir deste arquivo:
Instalação (Node.js):
Bash
npm install -g json-server


Salvar: Salve o JSON completo como db.json.
Executar o Servidor:
Bash
json-server --watch db.json


Endpoints Gerados:
Recurso
Exemplo de Endpoint
Usuários
GET /users, GET /users/1
Registros de Tempo
GET /tempos, POST /tempos




```

### 🛫 Running the project/Rodando o projeto 

Para **rodar o projeto de forma local**, basta executar os comandos a seguir, após ter copiado o projeto, navegado para o diretório correto e instalado as dependências.

```sh
# Running the project/Rodando o projeto localmente
npm run dev
```

---
