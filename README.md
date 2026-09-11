# ImTheGoodBack

Backend API for **Confiance / IamTheGood**, built with NestJS, Prisma and PostgreSQL.

## Stack

- NestJS
- Prisma ORM
- PostgreSQL (Supabase or Neon)
- Passport Local + JWT
- class-validator
- bcrypt

## Installation

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` and `JWT_SECRET` in `.env`.

Then:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

For production migrations:

```bash
npx prisma migrate deploy
npm run build
npm run start:prod
```

## API

### Auth

- `POST /auth/signup` — create a profile. Body: `name`, `whatsapp`, `bio`, `email`, `password`.
- `POST /auth/login` — body: `email`, `password`; returns a JWT access token.

### Users

- `GET /users/:slug` — public profile, reviews, average rating and review count.
- `PATCH /users/me` — protected; updates `name`, `whatsapp` and/or `bio`.

### Reviews

- `POST /reviews` — protected; body: `targetId`, `rating` (1–5), optional `comment`.

The service rejects reviews where the authenticated author is the target.

## Environment

Never commit `.env`. Use `.env.example` as the template.

## Scope

Payments, identity verification, public search/directory and messaging are intentionally outside this backend's current scope.
