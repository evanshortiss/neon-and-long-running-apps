# Neon's Serverless Postgres and Long-Running Applications

This repository is a companion to this [post on the Neon blog](https://neon.tech/blog/using-neons-auto-suspend-with-long-running-applications).

Built using Fastify, HTMX, and Drizzle, this application demonstrates how you
can use [Neon's Serverless Postrges auto-suspend](https://neon.tech/docs/introduction/auto-suspend)
feature with a long-running Node.js application. The techniques used can be applied to other runtimes and Postgres drivers.

## Usage

### Initial Setup

1. Create a project at https://console.neon.tech/.
1. Copy `.env.example` to a file named `.env`, and replace `DATABASE_URL` your database's [connection string](https://neon.tech/docs/connect/connect-from-any-app).
1. Initialise the database with a schema and some data:
    ```bash
    npm i
    npm run drizzle:generate
    npm run drizzle:push
    npm run seed
    ```

### Dev Mode

To start the application in development mode with hot reload via `nodemon` use:

```bash
npm run dev
```

The application will start listening on http://localhost:8080/.
