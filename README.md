# Unmark frontend

Next.js web app for [unmark.ink](https://unmark.ink).

## Local

```bash
cp .env.example .env.local   # edit if needed
npm install
npm run dev
```

Companion repos (run separately): **backend**, **chrome-extension**, **cli**.

## Secrets

Never commit `.env.local` or `.env`. Only `.env.example` is safe.

```bash
./scripts/check-no-secrets.sh
```
