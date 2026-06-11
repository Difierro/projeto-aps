## UC03 - Login

### 1. Descrição

É o processo onde um usuário do sistema (Gestor ou Colaborador) realiza a autenticação para acessar o sistema do salão de beleza.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

- Primário: Usuário (Gerente ou Colaborador)

### 4. Pré-condições

- Usuário deve estar previamente cadastrado no sistema;
- Sistema deve estar disponível;
- Usuário deve possuir login e senha válidos;

### 4. Pós-condições

- Usuário autenticado com sucesso e acesso ao sistema liberado;
- Em caso de erro, mensagem exibida ao usuário;

### 5. Fluxo Principal

#### P1. Realizar Login

##### P1.1 Usuário acessa a tela de login;
##### P1.2 Sistema exibe os campos de login e senha;
##### P1.3 Usuário informa login e senha;
##### P1.4 Usuário clica no botão "Entrar";
##### P1.5 Sistema valida os dados informados;
##### P1.6 Sistema autentica o usuário;
##### P1.7 Sistema redireciona o usuário para a tela principal;

### 6. Fluxos Alternativos

#### A1 - Login ou senha inválidos

##### A1.1 No passo P1.5, sistema identifica dados incorretos;
##### A1.2 Sistema exibe mensagem: "Login ou senha inválidos";
##### A1.3 Sistema retorna para a tela de login;

#### A2 - Campos não preenchidos

##### A2.1 No passo P1.3, sistema detecta campos vazios;
##### A2.2 Sistema exibe mensagem: "Preencha todos os campos";
##### A2.3 Sistema não permite continuar;

### 7. Fluxos de Exceção

#### E1 - Falha no sistema

##### E1.1 Sistema apresenta erro interno durante validação;
##### E1.2 Sistema exibe mensagem: "Erro ao processar login";
##### E1.3 Sistema solicita nova tentativa;

### 8. Regras de Negócio

#### RN01: O login deve ser único para cada usuário;
#### RN02: O acesso ao sistema só é permitido mediante autenticação válida;
#### RN03: O sistema deve validar corretamente login e senha antes de permitir acesso;

### 9. Frequência de Uso

#### Sempre que o usuário desejar acessar o sistema.

-------------------------------------
### Histórico

- Data: 30/04/2026 - Versão Inicial - Responsável: Jéssica Isabela
- Data: 30/04/2026 - Versão corrigida - Responsável: Jéssica Isabela
