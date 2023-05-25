# Uncomplicated Nestjs/Vue3/Typescript/monorepo fullstack starter with shared code
This repository aims to provide a developer-friendly, uncomplicated fullstack
monorepo starter project using **Nestjs**, **Vue3** (with **Vite**
and **Pinia**)and **Typescript**.  It provides a `shared` project for sharing DTO
objects and other code between back- and frontend.  The monorepo setup is based
on **NPM** workspaces to avoid the complexities of using monorepo build systems
like **NX** or **Lerna**.

A number of never-wrong features like logging, configuration, frontend stores, etc
are added and pre-configured in such a way that they will not get in the way
and are easy to remove.

The combination of selected technologie is "seasoned" because it evolved after
years of programming fullstack applications. 

I intend to further extend this repository and to keep in step with the underlaying
technologies, so come back later for more.

You can move directly to [Getting Started](#getting-started) if you're
not interested in the finer details of the repository setup.

## Setup
### Monorepo setup
All 3 subprojects `shared`, `backend` and `frontend` reside in the same repository.
To avoid complexity associated with monorepo build tools, the setup is based on NPM
workspaces courtesy to [Dávid Szabó's excellent blog article](https://daveiscoding.com/nodejs-typescript-monorepo-via-npm-workspaces).
The subprojects live in the `packages` folder under the root folder.  

The `shared` subproject is declared as a dependency of both the `frontend` and the
`backend` projects.  There should be no reason to change the monorepo setup.

### vscode extensions
When you open the root folder in **vscode**, the below extensions will be advised
to install.  All the extensions have been setup in the repository.
- **Thunder client**: a postman-like REST client integrated in vscode
- **Prettier**: code formatter, setup for Typescript
- **Volar** & **TypeScript Vue Plugin**: Vue language tooling
- **Material Icon Theme**: improved icons for specific files
- **better-comments**: Improved comments functionality
- **vscode-eslint**: this is a no-brainer
- **peacock**: helps distinguish the subprojects by coloring the vscode ui differently

It is advised to open every subproject in a separate vscode instance and to alt-tab
between the subprojects.  Alternatively you can open vsacode with the `<project>.code-workspace`
file in the root folder to enjoy vscode workspaces but then you'll lose the Peacock's
UI coloring.  

### Base Technologies
- [Typescript v4.9.5](https://www.typescriptlang.org/) - all subprojects set up
for Typescript.  If you prefer a different language you probably want to select a
different starter template.
- [Nestjs v9.0](https://nestjs.com/) - a well-established,
[Express](https://expressjs.com/)-based framework for creating REST APIs that
helps to write well-structured, clean code
  - [mikro-orm v5.7](https://mikro-orm.io/) Having tried *sequelize* en *typeorm* ORMs, I settled for mikro-orm because it is well-structured, performant and under active development.
- [Vite v4.3](https://vitejs.dev/)
- [Vue v3.3](https://blog.vuejs.org/posts/vue-3-3) - frontend framework
  - [pinia v2](https://pinia.vuejs.org/) - frontend global data management

### Never-wrong's
#### Backend logging
The logging infrastucture includes the `LogService`, `LogInterface` and
`NullLoggerService` assets in `<root>/src/logging/`.  `LoggerService` is a simple
facade in front of the Nest `ConsoleLogger`.  You can adapt it to your liking
to - for instance - send the logs to your favorite log server.
Simple console logging is available out-of-the-box, you can expand on the
as you see fit.

All log function have signature 
```ts
log(message: string, params?: OptionalLogParameters)
```
with 
```ts
interface OptionalLogParameters {
  context?: string
  uuid?: string
  meta?: unknown
}
```

The logger supports `context`, `metadata` and `uid` extra's next to the usual 
string message.  The context is usually set to the name of the *service* or
*controller* like this

```ts
export class SomeService {
  constructor(private _log: LogService) {
    this._log.context = SomeService.name
  }
  // ...
}
```

`uid` can be used to assign a short unique id to every log statement.  That helps
to find the statement back based on the logging.  I usually use a 5-character long uuid.

`meta-data` can be used to add variables to the logging.

On top of the traditional `log`, `error`, `warn`, `debug` and `verbose` loglevels, an
additional `urgent` level is provided .  It's purpose is to have the urgent log messages
sent to yourself (the developer) when you operate in a devops environment.  Make
sure to use the `urgent` level sparecely and to implement some throttling mechanism
to avoid being overwhelmed by urgent messages ! 

#### Configuration
Every real-life project needs configuration.  To facilitate container
deployment, the configuration files are located in a separate folder
outside of the Typescript build (`src`) : `backend/config/config.json` and `backend/config/backed-config-to-frontend.js` files.

Define the (backend) configuration hierarchically in `config.json`. In
`backed-config-to-frontend.js` you define which elements of the backend
configuration must be sent to the frontend and you can add extra
frontend-only configuration.

Both files are watched and reloaded when they change
#### Frontend configuration

#### Pinia stores

## Getting started
In 3 separate terminal windows, run
- `npm run build:watch -w @nest-vue-starter/shared`
- `npm run start:dev -w @nest-vue-starter/backend`
