![Brix](docs/logo.png)

# Brix - Modular components for Node.js

Brix aims to be a collection of libraries and modules that fit together nicely to rapidly build projects and apps.
A brick can be used by itself, combined with other bricks to provide complex solutions, or swapped out for another brick.

## Bricks in this repo
- [⚡️ `@brix/cli`](packages/cli) - A CLI for managing brix projects
- [🔌 `@brix/api`](packages/api) - A minimal config GQL Node.js server
- [📕 `@brix/core`](packages/core) - Core library for Brix (Plugins, utils, etc)
- [🏗 `@brix/generated`](packages/generated) - Automatically generate types, API clients for testing and more for your project
- [🗄 `@brix/model`](packages/model) - Generic database adapter using decorators (Inspired by [Sequelize Typescript](https://github.com/RobinBuschmann/sequelize-typescript))
- [📊 `@brix/plugin-admin`](packages/plugin-admin) - Dynamic, theme-able admin panel for Brix projects
- [🔐 `@brix/plugin-auth-jwt`](packages/plugin-auth-jwt) - JWT authentication plugin
- [👤 `@brix/plugin-entity-user`](packages/plugin-entity-user) - User entity plugin
- [🗄 `@brix/plugin-store-sequelize`](packages/plugin-store-sequelize) - Sequelize store adapter
- [🎨 `@brix/plugin-templates`](packages/plugin-templates) - Serve template files from Brix
- [💌 `@brix/mail-tester`](packages/mail-tester) - A local SMTP server and client for testing emails and email content
