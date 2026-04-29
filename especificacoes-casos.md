## UC01 - Cadastrar Cliente

### 1. Descrição

É o processo onde um usuário do sistema (Atendente ou Gerente) realiza o cadastro de um novo cliente no sistema do salão de beleza.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

- Primário: Usuário (Atendente ou Gerente)

### 4. Pré-condições

- Usuário autenticado no sistema.

### 4. Pós-condições

- Cliente cadastrado com sucesso;
- Dados do cliente armazenados no sistema.


### 5. Fluxo Principal

#### P1. Cadastrar Cliente
##### P1.1 Usuário seleciona a opção "Cadastrar Cliente"; A1
##### P1.2 Sistema exibe o formulário de cadastro;
##### P1.3 Usuário informa os dados do cliente (nome, telefone, preferências); E1
##### P1.4 Usuário seleciona a opção "Salvar";
##### P1.5 Sistema valida os dados informados; E2
##### P1.6 Sistema realiza o cadastro do cliente;
##### P1.7 Sistema exibe mensagem de sucesso;
##### P1.8 Caso de uso finalizado.

### 6. Fluxo Alternativo

#### A1. Cancelar Cadastro
##### A1.1 Usuário seleciona "Cancelar"; P1.1

### 7. Fluxo de Exceção

#### E1. Dados Incompletos
##### E1.1 Sistema exibe mensagem "Preencha todos os campos obrigatórios"; P1.3

##### E2. Cliente já cadastrado
##### E2.1 Sistema exibe mensagem "Cliente já existente"; P1.2

### 8. Regras de Negócio

#### RN01 - O cliente deve possuir nome e telefone obrigatórios;
#### RN02 - Não é permitido cadastrar clientes duplicados (mesmo telefone);
#### RN03 - O cadastro só pode ser realizado por usuários autenticados;
#### RN04 - A data de cadastro deve ser registrada automaticamente.

-------------------------------------
### Histórico

- Data: 29/04/2026 - Versão Inicial - Responsável: Evelyn Cristina

