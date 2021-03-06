# 🔌 Brix API Module

This module provides a ridiculously easy GraphQL server environment that works out of the box.
It's designed to plug directly into the Brix environment (using plugins and model/database adapters),
or work completely stand alone. As per Brix's philosophy, the choice is yours.

Under the hood, `@brix/api` uses these brilliant technologies:
- [`express`](http://expressjs.com/)
- [`apollo-server-express`](https://github.com/apollographql/apollo-server)
- [`type-graphql`](https://typegraphql.ml/)
- `@brix` plugins (Optional)

---
- [🔌 Brix API Module](#%f0%9f%94%8c-brix-api-module)
  - [Installation](#installation)
  - [Usage](#usage)
    - [With `@brix/cli`](#with-brixcli)
    - [Manually (without the `@brix/cli`)](#manually-without-the-brixcli)
  - [Configuration](#configuration)
  - [Loading Resolvers & Middleware](#loading-resolvers--middleware)
    - [Option 1: Directory structure](#option-1-directory-structure)
    - [Option 2: Manually pass in resolvers/middleware](#option-2-manually-pass-in-resolversmiddleware)
  - [Authentication](#authentication)
  - [Using Authentication for your Resolvers](#using-authentication-for-your-resolvers)

---

## Installation
```bash
yarn add @brix/api
```

## Usage
### With [`@brix/cli`](../cli)
Once your project is setup, simply run `brix` or `brix start` to start your server.
```
$ brix
info: ✅ Database connected
info: 🚀 Server ready at http://localhost:4000/graphql
```

### Manually (without the [`@brix/cli`](../cli))
```ts
import API from '@brix/api';

(async () => {
  const { server, db } = await API.server();
})();
```

This will spin up an API instance, automatically pulling in configuration from a `brix.yaml` / `brix.json` file.
You can also pass in options directly into the `API.server()` method to override anything loaded from config
files or environment variables


## Configuration
The core idea behind Brix is to manage as few things as possible. We achieve this with a single configuration file that allows you to control everything your environment does.

**Example `brix.yaml`**
```yaml
plugins:
  - name: store-sequelize # Use Sequelize to manage data
  - name: entity-user # Enable users
  - name: auth-jwt # Use JWT strategy for authentication
  - name: templates # Serve template files (.pug, .hbs, etc) from a directory
  - name: admin # Admin portal for managing Brix
dbConnection:
  dialect: postgres # Brix is database agnostic
  host: yourdb.com
  port: 5432
  username: root
accessTokenSecret: secretStuff
```

Configuration can be overridden by passing a `BrixConfig` object to the `API.server()` and additionally through `.env` files or environment variables.


## Loading Resolvers & Middleware

### Option 1: Directory structure
Brix API automagically loads in resolvers and entities for you into GQL. You can also change these settings in the `brix.yaml` file using `resolverDir` or `middlewareDir`. By default, Brix looks for:

- **Resolvers:** `./gql/resolvers/` or `./dist/gql/resolvers`
- **Middleware:** `./middleware/` or `./dist/middleware`

**Example**
```
|- brix.yml
|- gql/
  |- entities/
    |- Post.entity.js
    |- User.entity.js
  |- resolvers/
    |- Post.resolver.js
    |- User.resolver.js
|- middleware/
  |- logSomething.js
```

These files would expose an `ObjectType()` from `type-graphql`:

```ts
@ObjectType()
@Model()
export class User {
  @Field()
  id: string;

  @Field()
  @ModelField()
  firstName: string;

  @Field()
  @ModelField()
  lastName: string;

  @Field()
  @ModelField()
  email: string;

  @ModelField()
  password: string;
}
```

### Option 2: Manually pass in resolvers/middleware
You're also able to pass in resolvers or Express/Connect middleware functions when you generate the server as well.

```ts
await API.server({
  resolvers: [UserResolver, PostResolver],
  middleware: [logSomething, (req, res, next) => {
    // Do something...
    next();
  }]
})
```

## Authentication
You can very easily setup authentication by adding a plugin like [`@brix/plugin-auth-jwt`](../plugin-auth-jwt) to your `brix.yaml`

```yaml
plugins:
  - name: store-sequelize # Use Sequelize to manage data
  - name: entity-user # Enable users
  - name: auth-jwt # <--- Use JWT strategy for authentication
dbConnection:
  dialect: sqlite
  storage: ./test.db
```

Under the hood, `@brix/api` uses `authChecker` middlewares passed into `type-graphql`. You can [read more about it here](https://typegraphql.ml/docs/authorization.html).

If you want to extend or provide your own authentication, you can easily do this with registering a plugin:

```ts

// your-plugin.ts
export default () => {
  BrixPlugins.register({
    name: 'My Auth',
    description: 'Custom authentication for your server',
    // Register a new context middleware which stores the `clientToken` on the context
    contextMiddlewares: [(req, context) => {
      context.clientToken = getClientToken(req);
      return context;
    }],
    // Register a new authChecker middleware which checks the token on `@Authorization()`
    authCheckers: [(context, roles) => {
      return validateToken(context.clientToken)
    }]
  });
};
```

For a complete example, check out the [`@brix/plugin-auth-jwt`](../plugin-auth-jwt) plugin


## Using Authentication for your Resolvers
Brix uses the `@Authorization()` decorator from [`type-graphql`](https://typegraphql.ml/docs/authorization.html) to authorize queries and mutations.

```ts
import { Arg, Mutation, Query, Resolver, Authorized } from 'type-graphql';

@Resolver(User)
export class UserResolver {
  model = Store.model<User>('User');

  @Query(() => [User])
  @Authorized() // This triggers the authorization middleware
  async users() {
    return this.model.findAll();
  }

  @Mutation(() => User)
  async signup(
    @Arg('user', () => UserInput) user: UserInput
  ) {
    user.password = await hashPassword(user.password);
    return this.model.create(user);
  }
}
```
