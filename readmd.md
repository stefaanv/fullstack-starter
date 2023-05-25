# Uncomplicated Nestjs/Vue3/Typescript/monorepo fullstack starter with shared code
This repository aims to provide a developer-friendly, uncomplicated fullstack
monorepo starter project using **Nestjs**, **Vue3** (with **Vite**
and **Pinia**)and **Typescript**.  It provides a `shared` project for sharing DTO
objects and other code between back- and frontend.  The monorepo setup is based
on **NPM** workspaces to avoid the complexities of using monorepo build systems
like **NX** or **Lerna**.

A number of never-wrong features like logging, configuration, frontend stores, etc
are added and pre-configured in such a way that they will not impede the developer
when not needed or are easy to remove.

I intend to further extend this repository and to keep in step with the underlaying
technologies, so come back later for more.

You can move directly to [the getting started part](#getting-started).

## Setup

### base technologies

## Running the code
In 3 separate terminal windows, run
- `npm run build:watch -w @nest-vue-starter/shared`
- `npm run start:dev -w @nest-vue-starter/backend`
