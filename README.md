# soulfiremc.com
The code for our website and documentation!

## Generate better-auth schema

```bash
pnpm tsx scripts/generate-auth-schema.ts
```

## Drizzle

https://orm.drizzle.team/docs/kit-overview

### Create migration

```bash
pnpm drizzle-kit generate --name=<name>
```

### Run migrations

```bash
pnpm drizzle-kit migrate
```

### Push schema to db

```bash
pnpm drizzle-kit push
```

### Open Studio

URL: https://local.drizzle.studio

```bash
pnpm drizzle-kit studio
```

<p align="center">
  <a rel="noopener noreferrer" target="_blank" href="https://vercel.com/?utm_source=soulfire&utm_campaign=oss">
    <img height="34px" src="/public/assets/powered-by-vercel.svg" alt="Powered by vercel">
  </a>
</p>
