# DAM2-Atividade2

Projeto de aplicativo desenvolvido em React Native para Atividade 2 da disciplina de Desenvolvimento de Aplicações Móveis II. Este repositório foi criado a partir do projeto base fornecido pelo professor Flávio Augusto de Freitas para a atividade: [Coach4Me](https://github.com/zz4fff/react-native-coach4me).


O projeto é uma plataforma que conecta alunos a coaches (professores), com três partes:

| Pasta     | Descrição                                                  |
| --------- | ---------------------------------------------------------- |
| `server/` | API em Node.js + Express + Knex, com banco SQLite          |
| `mobile/` | Aplicativo em React Native (Expo SDK 40) + TypeScript      |
| `web/`    | Versão web em React, usada para **cadastrar** coaches      |

---

## Funcionalidade implementada: horários disponíveis na listagem de coaches

No cadastro de coaches é possível informar vários horários de aula. Antes, a listagem de coaches no app não exibia esses horários. Agora, **cada coach exibe seus dias e horários disponíveis logo abaixo da bio**.

### Como funciona

A rota `GET /classes` passou a fazer um `JOIN` com a tabela `class_schedule` e a devolver, junto com os dados de cada coach, o array `schedule` com todos os seus horários.

```sql
SELECT
  classes.id AS class_id,
  classes.subject,
  classes.cost,
  coaches.id,
  coaches.name,
  coaches.avatar,
  coaches.whatsapp,
  coaches.bio,
  class_schedule.id AS schedule_id,
  class_schedule.week_day,
  class_schedule."from",
  class_schedule."to"
FROM classes
INNER JOIN coaches ON classes.coach_id = coaches.id
INNER JOIN class_schedule ON class_schedule.class_id = classes.id
WHERE EXISTS (
  SELECT class_schedule.*
  FROM class_schedule
  WHERE class_schedule.class_id = classes.id
    AND class_schedule.week_day = :dia
    AND class_schedule."from" <= :horario_em_minutos
    AND class_schedule."to" > :horario_em_minutos
)
AND classes.subject = :materia
ORDER BY classes.id, class_schedule.week_day, class_schedule."from";
```

Pontos importantes:

- O `EXISTS` decide **quais coaches** aparecem (os que atendem no dia e horário filtrados).
- O `JOIN` com `class_schedule` traz **todos** os horários desses coaches, e não apenas o que casou com o filtro.
- O join devolve uma linha por horário. No controller, essas linhas são agrupadas de volta em **um objeto por coach**.
- No banco os horários ficam em minutos (`480` = `08:00`). A API converte para o formato `HH:mm` antes de responder.

### Exemplo de resposta

`GET /classes?subject=Matemática&week_day=1&time=08:30`

```json
[
  {
    "id": 1,
    "class_id": 1,
    "name": "Nome do Coach",
    "avatar": "https://...",
    "whatsapp": "999999999",
    "bio": "Bio do coach",
    "subject": "Matemática",
    "cost": "50",
    "schedule": [
      { "id": 1, "week_day": 1, "from": "08:00", "to": "12:00" },
      { "id": 2, "week_day": 3, "from": "10:00", "to": "18:00" },
      { "id": 3, "week_day": 4, "from": "08:00", "to": "12:00" }
    ]
  }
]
```

`week_day` segue a convenção `0 = Domingo`, `1 = Segunda`, ..., `6 = Sábado`.

### Arquivos alterados

| Arquivo                                       | Mudança                                                        |
| --------------------------------------------- | -------------------------------------------------------------- |
| `server/src/controllers/ClassesController.ts` | `JOIN` com `class_schedule` e agrupamento dos horários por coach |
| `server/src/utils/convertMinutesToHour.ts`    | **Novo.** Converte minutos em `HH:mm`                          |
| `mobile/src/components/CoachItem/index.tsx`   | Seção "Horários disponíveis" abaixo da bio                     |
| `mobile/src/components/CoachItem/styles.ts`   | Estilos da nova seção                                          |

O campo `schedule` é opcional no tipo `Coach` do app. Assim, coaches favoritados antes desta funcionalidade (salvos no `AsyncStorage` sem horários) continuam abrindo normalmente.

---

## Como executar

### Pré-requisitos

- Node.js e npm
- Expo CLI (usado pelo projeto mobile)

### 1. Server

```bash
cd server
npm install
npm start
```

A API sobe na porta `3333`. O banco SQLite já acompanha o projeto, com coaches e horários de exemplo.

### 2. Mobile

```bash
cd mobile
npm install
npm start
```

Antes de rodar, ajuste o endereço da API em `mobile/src/services/api.ts` para o IP da sua máquina:

```ts
baseURL: 'http://SEU_IP:3333'
```

Em seguida, abra o app pelo menu do Expo: `a` para o emulador Android ou `w` para o navegador. O celular e o computador precisam estar na mesma rede.

### 3. Web (opcional)

A versão web serve apenas para **cadastrar coaches**. Ela não é necessária para ver a listagem.

```bash
cd web
npm install --legacy-peer-deps
npm start
```

### Testando a funcionalidade

1. Abra o app e toque em **Estudar**.
2. Abra o filtro e preencha:
   - Matéria: `Matemática`
   - Dia da semana: `1`
   - Horário: `08:30`
3. Toque em **Filtrar**. A lista mostra os coaches com os horários disponíveis abaixo da bio.

A lista começa vazia e só é carregada depois de aplicar o filtro. A matéria precisa ser digitada exatamente como está cadastrada (inclusive acentos).

---

## Problemas comuns

**`error:0308010C:digital envelope routines::unsupported`**
Acontece ao rodar `mobile` ou `web` em Node 17 ou superior, por causa do OpenSSL 3. Rode antes de iniciar:

```bash
export NODE_OPTIONS=--openssl-legacy-provider
```

**`invalid ELF header` ou `Permission denied` no server**
Ocorre quando o `node_modules` foi gerado em outro sistema operacional. Apague a pasta e reinstale:

```bash
rm -rf node_modules
npm install
```

**O app não alcança a API**
Confirme que o server está rodando e que o `baseURL` em `mobile/src/services/api.ts` usa o IP da máquina (não `localhost`, quando rodando em celular ou emulador).

**Cliques não funcionam ao rodar o app no navegador (`w`)**
Os botões do `react-native-gesture-handler` 1.x (`RectButton`, `BorderlessButton`) não respondem a clique de mouse na web. No celular ou emulador eles funcionam normalmente.

## Vídeo explicativo no YouTube (não listado):

[https://youtu.be/](https://youtu.be/)

## Autor

- **Nome**: Tadeu dos Santos Jerônimo
- **Matrícula**: 2026202194
- **E-mail**: tadeus.jeronimo@gmail.com
- **Disciplina**: Tecnologias Front-End - IF Sudeste/MG

## Licença

Consulte o arquivo [LICENSE](./LICENSE).
