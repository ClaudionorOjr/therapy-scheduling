## Pre-configurations

### Config Prettier package

> Dentro da pasta `prettier-config` (./config/prettier-config/) executar:

```sh
# Install prettier
$ npm i prettier -D
# Install prettier tailwind plugin
$ npm i prettier-plugin-tailwindcss -D
```

### Config Eslint package

> Dentro da pasta `eslint-config` (./config/eslint-config/) executar:

```sh
# Install rocketseat eslint plugin
$ npm i @rocketseat/eslint-config -D
# Plugin to sort imports
$ npm i eslint-plugin-simple-import-sort -D
```

### Config Typscript package

---

- Para instalar uma biblioteca interna do projeto a outro pacote, adiciona ao `package.json` do pacote a biblioteca interna desejada.

```json
// Instalando o pacote de configuração do Prettier ao pacote de configuração do Eslint
{
  ...
  "devDependencies": {
    "@rocketseat/eslint-config": "^2.2.2",
    "eslint-plugin-simple-import-sort": "^12.1.1",
    "@saas/prettier-config": "*" // Adicionar essa linha
  }
}
```

- Habilitar o Prettier e Eslint no pacote `eslint-config`. Alterar o `package.json`.

```json
{
  ... // Adiconar as configurações abaixo
  "prettier": "@saas/prettier-config",
  "eslintConfig": {
    "extends": ["./library.js"]
  }
}
```

## API

- Criar `package.json` para o projeto API (`./apps/api/`)

```json
{
  // Configuração do `package.json` da API
  "name": "@saas/api",
  "version": "0.0.0",
  "devDependencies": {
    "@saas/eslint-config": "*",
    "@saas/prettier-config": "*",
    "@saas/typescript-config": "*"
  },
  "prettier": "@saas/prettier-config",
  "eslintConfig": {
    "extends": ["@saas/eslint-config/node"],
    "rules": {
      "no-useless-constructor": "off"
    }
  }
}
```

- Bibliotecas para criação da API

```sh
# Install TSX
$ npm i tsx -D
# Install node types
$ npm i @types/node -D
# Install TSX
$ npm i bcryptjs
# Install bcryptjs types
$ npm i @types/bcryptjs -D
# Install Vitest
$ npm i vitest -D
# Install dayjs
$ npm i dayjs
# Install fastify
$ npm i fastify
# Install zod
$ npm i zod
# Install cors plugin for fastify
$ npm i @fastify/cors
# Install zod plugin for fastify
$ npm i fastify-type-provider-zod
#Install Prisma
$ npm i prisma -D
# Install tsyring
$ npm i tsyringe
# Install reflect-metadata (Necessário para o tsyringe)
$ npm i reflect-metadata
```
