## UC01 - Realizar Login

### 1. Descrição

É o processo onde um usuário do sistema (Gerente ou Colaborador) realiza a autenticação para acessar o sistema do salão de beleza.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

- Primário: Usuário (Gerente ou Colaborador)

### 4. Pré-condições

- Usuário deve estar previamente cadastrado no sistema;
- Sistema deve estar disponível;
- Usuário deve possuir login e senha válidos;

### 5. Pós-condições

- Usuário autenticado com sucesso e acesso ao sistema liberado;

### 6. Fluxo Principal

#### P1. Realizar Login

##### P1.1 Usuário acessa a tela de login;
##### P1.2 Sistema exibe os campos de email e senha;
##### P1.3 Usuário informa email e senha; E3
##### P1.4 Usuário clica no botão "Entrar";
##### P1.5 Sistema valida os dados informados; E2
##### P1.6 Sistema autentica o usuário;
##### P1.7 Sistema redireciona o usuário para a tela principal (Agenda);

### 7. Fluxo Alternativo

### 8. Fluxo de Exceção

#### E1. Falha no sistema

##### E1.1 Sistema apresenta erro interno durante validação;
##### E1.2 Sistema exibe mensagem: "Erro ao processar login";
##### E1.3 Sistema solicita nova tentativa;

#### E2. Email ou senha inválidos

##### E2.1 Sistema identifica dados incorretos; P1.2
##### E3.2 Sistema exibe mensagem: "Login ou senha inválidos";
##### E2.3 Sistema retorna para a tela de login;

#### E3. Campos não preenchidos

##### E3.1 Sistema detecta campos vazios; 
##### E3.2 Sistema exibe mensagem: "Preencha todos os campos";
##### E3.3 Sistema não permite continuar;

### 9. Regras de Negócio

#### RN01 - O login deve ser único para cada usuário;
#### RN02 - O acesso ao sistema só é permitido mediante autenticação válida;
#### RN03 - O sistema deve validar corretamente email e senha antes de permitir acesso;

-------------------------------------

### Histórico

- Data: 30/04/2026 - Versão Inicial - Responsável: Jéssica Isabela
- Data: 30/04/2026 - Versão corrigida - Responsável: Maria Aparecida
