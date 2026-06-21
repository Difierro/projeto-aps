# Sistema de Gestão para Salão de Beleza

Este projeto é um sistema web para gerenciamento de um salão de beleza, integrando agendamentos, gestão de clientes, controle de equipe e relatórios financeiros.

## Objetivo do Sistema

O objetivo deste software é otimizar a administração de um Salão de Beleza, permitindo que gerentes e colaboradores organizem suas agendas, mantenham um registro detalhado dos clientes e acompanhem o desempenho financeiro do negócio. O sistema visa reduzir conflitos de horário, facilitar o acesso ao histórico de serviços e prover segurança através de níveis de acesso diferenciados (Gerente e Colaborador).

## Principais Funcionalidades

* **Autenticação e Controle de Acesso:** Sistema de login seguro com token JWT, diferenciando permissões entre usuários do tipo "Gerente" e "Colaborador".
* **Gestão de Agenda:**
    * Visualização de agendamentos (filtro por dia ou mês).
    * Criação de novos agendamentos com verificação de conflito de horários.
    * Ações rápidas: Finalizar atendimento, Reagendar ou Cancelar.
* **Gestão de Clientes:**
    * Cadastro completo com nome, telefone e preferências.
    * Histórico detalhado de atendimentos anteriores por cliente.
* **Gestão de Equipe:**
    * Listagem de colaboradores.
    * Cadastro de novos membros (exclusivo para Gerentes).
* **Módulo Financeiro:**
    * Relatórios de faturamento filtrados por período (dia, semana, mês, ano).
    * Indicadores de desempenho: Faturamento Total, Volume de Atendimentos e Ticket Médio (exclusivo para Gerentes).

## Tecnologias Utilizadas

**Frontend:**
* **React:** Biblioteca principal para construção da interface.
* **Vite:** Ferramenta de build e servidor de desenvolvimento.
* **Tailwind CSS:** Framework de estilização utilitária para design responsivo.
* **React Router:** Gerenciamento de rotas e navegação.
* **Axios:** Consumo da API Backend.
* **Lucide React:** Biblioteca de ícones.

**Backend:**
* **Python & FastAPI:** Framework moderno e de alta performance para construção da API.
* **SQLAlchemy:** ORM para interação com o banco de dados.
* **SQLite:** Banco de dados relacional (arquivo `salao.db`).
* **Pydantic:** Validação de dados e schemas.
* **Passlib (Argon2) & Python-Jose:** Criptografia de senhas e geração de tokens JWT.

## Como Executar o Projeto

Certifique-se de ter **Python**, **Node.js** e **Git** instalados.

### 1. Backend 

```bash
# Entre na pasta do backend
cd src/backend/app

# Crie um ambiente virtual (opcional, mas recomendado)
python -m venv venv ou python3 -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r ../requirements.txt

# Inicialize o banco de dados e crie o usuário admin padrão
python init_data.py ou python3 init_data.py

# Inicie o servidor
uvicorn main:app --reload

```
### 2. Frontend
``` Bash
# Em outro terminal, entre na pasta do frontend
cd src/frontend

# Instale as dependências do Node
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## Como Navegar/Testar o Protótipo

1.  **Acesso Inicial:**
  * Abra o navegador e acesse o endereço local indicado pelo terminal do frontend (geralmente `http://localhost:5173`).

2.  **Login Administrativo (Gerente):**
  * O sistema inicia com um usuário administrador pré-configurado pelo script de inicialização.
    * **Email:** `admin@test.com`
    * **Senha:** `123456`
    * *Este usuário possui permissão de "gerente", com acesso total às telas de Financeiro e cadastro de Equipe.*

3.  **Explorando Funcionalidades:**
    * **Clientes:** Na aba "Clientes", cadastre um novo perfil em "Novo Cliente". Após cadastrado e finalizado atendimento, clique no botão de histórico (ícone de relógio) nos cards para visualizar atendimentos passados.
    * **Agenda:** Tente criar um novo agendamento clicando no botão "Novo". Nos cards existentes, teste as ações de Finalizar (ícone check), Reagendar (ícone carregamento) ou Cancelar (ícone X).
    * **Financeiro:** Verifique os relatórios gerenciais, visíveis apenas para gerentes.

4.  **Testando a Visão do Colaborador (Restrições):**
    * Estando logado como admin, vá até a aba **Equipe**.
    * Utilize o formulário à esquerda para cadastrar um novo usuário e selecione o tipo **"colaborador"**.
    * Faça **Logout** (botão "Sair" na barra lateral).
    * Faça **Login** novamente com o email e senha deste novo colaborador criado.
    * Tente acessar as abas **Financeiro** ou **Equipe**.
    * *O sistema exibirá uma tela de bloqueio com a mensagem "Acesso Restrito", validando o controle de permissões.*

## Colaboradores
<table align="center">
  <tr>    
    <td align="center">
      <a href="https://github.com/EvelynAires">
        <img src="https://avatars.githubusercontent.com/u/147438447?v=4" width="120px;" alt="Foto de Evelyn Cristina"/><br>
        Evelyn Cristina
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Difierro">
        <img src="https://avatars.githubusercontent.com/u/113316680?v=4" width="120px;" alt="Foto de Gustavo Rodrigues"/><br>
        Gustavo Rodrigues
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Jessicaisabela">
        <img src="https://avatars.githubusercontent.com/u/147560889?v=4" width="120px;" alt="Foto de Jéssica Isabela"/><br>
        Jéssica Isabela
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/M-Aparecida">
        <img src="https://avatars.githubusercontent.com/u/143430124?v=4" width="120px;" alt="Foto de 
        Maria Aparecida"/><br>
        Maria Aparecida
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/claraleal12">
        <img src="https://avatars.githubusercontent.com/u/147611128?v=4" width="120px;" alt="Foto de Maria Clara"/><br>
        Maria Clara
      </a>
    </td>
     <td align="center">
      <a href="https://github.com/shamyracarvalhoo">
        <img src="https://avatars.githubusercontent.com/u/147446284?v=4" width="120px;" alt="Foto de Shamyra Carvalho"/><br>
        Shamyra Carvalho
      </a>
    </td>
  </tr>
</table>