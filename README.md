# Unmark frontend

<p align="center">
  <img src="public/brand/unmark-icon-knockout.png" alt="Unmark knockout icon" width="96" />
</p>

<p align="center">
  <strong>Unmark</strong> — remove Gemini / Veo sparkle watermarks<br />
  <a href="https://unmark.ink">unmark.ink</a>
</p>

Next.js web app for [unmark.ink](https://unmark.ink).

## Brand graphics

Primary app icon (**Knockout** — copper tile, white sparkle):

<p align="center">
  <img src="public/brand/unmark-icon-knockout.png" alt="Unmark Knockout icon" width="128" />
</p>

Logo themes, wordmark, and palette (concept sheet):

<p align="center">
  <img src="public/brand/unmark-logo-themes.png" alt="Unmark logo themes and brand palette" width="720" />
</p>

| Theme | Idea |
|-------|------|
| **Knockout** | Primary mark — copper tile, white sparkle cutout |
| **Fade out** | Sparkle disappearing left to right |
| **Corner target** | Detection frame — sparkle locked in the corner |
| **Eraser** | Removal in action — sparkle wiped to dust |

**Palette**

| Name | Hex |
|------|-----|
| Ink | `#1A1A17` |
| Copper | `#C77B36` |
| Peach | `#E8A05C` |
| Cream | `#FBF0E6` |
| Sand | `#F2EEE5` |

Assets: [`public/brand/`](public/brand/) · Live page: [`/brand`](https://unmark.ink/brand)  
React marks: [`components/brand/logos.tsx`](components/brand/logos.tsx)

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
