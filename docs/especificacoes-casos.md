## UC01 - Cadastrar Cliente

### 1. Descrição

É o processo onde um usuário do sistema (Gestor ou Cabeleleira) realiza o cadastro de um novo cliente no sistema do salão de beleza.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

- Primário: Usuário (Gestor ou Cabeleleira)

### 4. Pré-condições

- Usuário autenticado no sistema.

### 4. Pós-condições

- Cliente cadastrado com sucesso;
- Dados do cliente armazenados no sistema.


### 5. Fluxo Principal

#### P1. Cadastrar Cliente
##### P1.1 Usuario navega até a aba cliente;
##### P1.2  Usuário seleciona a opção "novo Cliente"; A1
##### P1.3 Sistema exibe o formulário de cadastro;
##### P1.4 Usuário informa os dados do cliente (nome, telefone, preferências); E1
##### P1.5 Usuário seleciona a opção "Salvar";
##### P1.6 Sistema valida os dados informados; E2
##### P1.7 Sistema realiza o cadastro do cliente;
##### P1.8 Sistema exibe mensagem de sucesso;
##### P1.9 Caso de uso finalizado.

### 6. Fluxo Alternativo

#### A1. Cancelar Cadastro
##### A1.1 Usuário seleciona "Cancelar"; P1.2

### 7. Fluxo de Exceção

#### E1. Dados Incompletos
##### E1.1 Caso o campo nome não esteja preenchido, o sistema exibe mensagem "Preencha este campo"; P1.4


### 8. Regras de Negócio

#### RN01 - O cliente deve possuir nome obrigatório;
#### RN02 - O cadastro só pode ser realizado por usuários autenticados.

-------------------------------------
### Histórico

- Data: 29/04/2026 - Versão Inicial - Responsável: Evelyn Cristina
- Data: 30/04/2026 - Versão corrigida - Responsável: Evelyn Cristina

