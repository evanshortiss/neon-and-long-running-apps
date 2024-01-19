# Neon's Serverless Postgres and Long-Running Applications

This application, built using Fastify, HTMX, and Drizzle, demonstrates how you
can use [Neon's Serverless Postrges auto-suspend](https://neon.tech/docs/introduction/auto-suspend)
feature with a long-running application.

## Usage

### Initial Setup

1. Create a project at https://neon.tech/.
1. Copy `.env.example` to a file named `.env`, and replace `DATABASE_URL` your [connection string](https://neon.tech/docs/connect/connect-from-any-app).
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
