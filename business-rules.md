# Projeto: Therapy Scheduling

> Cadastro de psicólogos e pacientes para agendamento de sessões.

## Entidades

- Psicólogo - `psychologist`

|     | psychologist |                           |
| --- | ------------ | ------------------------- |
| PK  | id           | string                    |
|     | fullName     | string                    |
|     | email        | string                    |
|     | passwordHash | string                    |
|     | dateOfBirth  | date                      |
|     | phone        | string                    |
|     | crp          | string                    |
|     | createdAt    | date                      |
|     | updatedAt    | date \| null \| undefined |

- Paciente - `patient`

|     | patient        |                             |
| --- | -------------- | --------------------------- |
| PK  | id             | string                      |
| FK  | psychologistId | string                      |
|     | fullName       | string                      |
|     | email          | string                      |
|     | phone          | string                      |
|     | dateOfBirth    | date                        |
|     | occupation     | string \| null \| undefined |
|     | createdAt      | date                        |
|     | updatedAt      | date \| null \| undefined   |

- Agendamento - `scheduling`

|     | scheduling          |                                                             |
| --- | ------------------- | ----------------------------------------------------------- |
| PK  | id                  | string                                                      |
| FK  | psychologistId      | string                                                      |
| FK  | patientId           | string                                                      |
|     | appointmentDatetime | date                                                        |
|     | appointmentLocation | string                                                      |
|     | status              | string ('PENDING'\|'CONFIRMED'\|'CANCELED'\|'RESCHEDULING') |
|     | createdAt           | date                                                        |
|     | updatedAt           | date \| null \| undefined                                   |

- Responsável - `responsible`

|     | responsible     |        |
| --- | --------------- | ------ |
| PK  | id              | string |
| FK  | patientId       | string |
|     | fullName        | string |
|     | email           | string |
|     | phone           | string |
|     | degreeOfKinship | string |

## Requisitos funcionais (RF) e Regras de negócio (RN)

> O usuário atuante dentro da aplicação será somente o psicólogo (`psychologist`), sendo todos os outros resursos (`patient`, `responsible`, `scheduling`) manipulados por este.

- Domínio `account`

  - [x] Cadastrar psicólogo (RF):
    - [x] Não deve ser possível criar conta sem CRP (RN);
  - [x] Editar psicólogo (RF):
    - [x] Não deve ser possível editar conta de outro usuário (RN);
  - [x] Deletar psicólogo (RF):
    - [x] Não deve ser possível deletar conta de outro usuário (RN);
  - [x] Autenticação (RF):
    - [x] Deve ser possível se autenticar utilizando e-mail e senha (RN);
  - [ ] Recuperação de senha (RF):
  - [x] Cadastrar paciente (RF);
    - [x] Deve ser possível cadastrar responsáveis ao cadastrar paciente;
    - [x] Não deve ser possível cadastrar paciente para outro usuário (RN);
    - [x] Não deve ser possível cadastrar paciente menor de idade sem um responsável (RN);
  - [x] Buscar paciente (RF):
    - [x] Não deve ser possível buscar paciente de outro usuário (RN);
  - [x] Buscar pacientes (RF):
    - [x] Não deve ser possível buscar pacientes de outro usuário (RN);
  - [x] Editar paciente (RF):
    - [x] Não deve ser possível editar paciente de outro usuário (RN);
  - [x] Deletar paciente (RF):
    - [x] Não deve ser possível deletar paciente de outro usuário (RN);
  - [ ] Cadastrar responsáveis (RF):
    - [x] Não deve ser possível cadastrar responsável para paciente de outro usuário (RN);
  - [ ] Buscar responsáveis (RF):
  - [ ] Editar responsável (RF):
    - [x] Não deve ser possível editar responsável do paciente de outro usuário (RN);
  - [ ] Deletar responsável (RF):
    - [x] Não deve ser possível deletar responsável do paciente de outro usuário (RN);

- Domínio `scheduling`

  - [ ] Criar agendamento (RF):
    - [x] Não deve ser possível criar agendamento para paciente de outro usuário (RN);
    - [x] Não deve ser possível criar agendamento com data passada (RN);
  - [ ] Buscar agendamento (RF):
    - [x] Não deve ser possível buscar agendamento de outro usuário (RN);
  - [ ] Buscar agendamentos (RF):
    - [x] Não deve ser possível buscar agendamentos de outro usuário (RN);
    - [x] Deve ser possível filtrar os agendamentos por id do paciente e intervalo de datas. (RN);
  - [ ] Editar agendamento (RF):
    - [x] Não deve ser possível editar agendamento para uma data passada (RN);
    - [x] Não deve ser possível editar agendamento de outro usuário (RN);
    - [x] Deve ser possível enviar uma nova notificação em caso de alteração do agendamento (RN);
  - [ ] Deletar agendamento (RF):
    - [x] Não deve ser possível deletar agendamento de outro usuário (RN);
  - [ ] Confirmar agendamento (RF):
    - [x] Não deve ser possível confirmar agendamento já confirmado (RN);
  - [ ] Cancelar agendamento (RF):
    - [x] Não deve ser possível cancelar agendamento já cancelado (RN);
  - [ ] Reagendar (?) (RF):
    - [x] Não deve ser possível reagendar agendamento com status de reagendamento (RN);

## Futuro

### Entidades

- Clínica - `clinic`
- Membro - `member`
- Endereço - `address`
- Plano - `plan`

### Requisitos funcionais (RF) e Regras de negócio (RN)

- Domínio `account`

  - [ ] Buscar perfil do psicólogo (RF):
  - [ ] Buscar psicólogo (RF):
  - [ ] Buscar psicólogos (RF):

- Domínio `therapy-office`

  - [ ] Cadastrar clínica (RF):
  - [ ] Buscar clínica (RF):
  - [ ] Buscar clínicas (RF):
  - [ ] Editar clínica (RF):
  - [ ] Deletar clínica (RF):
  - [ ] Convidar membro (RF):
  - [ ] Revogar convite (RF):
  - [ ] Deletar membro (RF):
