## UC03 - Agendar Serviço

### 1. Descrição

É o processo onde um usuário do sistema (Gerente ou Colaborador) realiza o agendamento de um serviço para um cliente no sistema do salão de beleza.

### 2. Importância

Alta

### 3. Ator Primário / Ator Secundário

- Primário: Usuário (Gerente ou Colaborador)

### 4. Pré-condições

- Usuário autenticado no sistema;
- Cliente previamente cadastrado no sistema.

### 5. Pós-condições

- Agendamento cadastrado com sucesso;
- Dados do agendamento armazenados no sistema.

### 6. Fluxo Principal

#### P1. Realizar Agendamento
##### P1.1 Usuário navega até a aba de agenda;
##### P1.2 Usuário seleciona a opção "Novo Agendamento"; A1
##### P1.3 Sistema exibe o formulário de agendamento;
##### P1.4 Usuário informa os dados do agendamento (cliente, profissional, data, horário, tipo de serviço); E1
##### P1.5 Usuário seleciona a opção "Confirmar";
##### P1.6 Sistema valida os dados informados; E3
##### P1.7 Sistema realiza o cadastro do agendamento;
##### P1.8 Sistema exibe mensagem de sucesso;
##### P1.9 Caso de uso finalizado.

### 7. Fluxo Alternativo

#### A1. Cancelar Agendamento
##### A1.1 Usuário seleciona "Cancelar"; P1.1

### 8. Fluxo de Exceção

#### E1. Dados Incompletos
##### E1.1 Caso algum campo obrigatório não esteja preenchido, o sistema exibe mensagem "Preencha todos os campos obrigatórios"; P1.4

### 9. Regras de Negócio

#### RN01 - O cliente deve estar previamente cadastrado no sistema;
#### RN02 - Não é permitido agendar dois atendimentos para o mesmo horário e profissional;
#### RN03 - O agendamento só pode ser realizado por usuários autenticados;
#### RN04 - O sistema deve validar a disponibilidade antes de confirmar o agendamento;

-------------------------------------

### Histórico

- Data: 30/04/2026 - Versão Inicial - Responsável: Shamyra
- Data: 30/04/2026 - Versão corrigida - Responsável: Maria Aparecida
