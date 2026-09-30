# Fischerverein Bad Liebenzell e.V.

Website [liebenzeller-fischer.de](https://liebenzeller-fischer.de), gebaut mit [Astro](https://astro.build).
Jeder Push auf `main` baut die Seite per GitHub Actions und veröffentlicht sie auf `gh-pages`.

## Lokal starten

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # fertige Seite in dist/
```

## Aufbau

```
src/
  blocks/<name>/        ein Ordner pro Bauteil, HTML/SCSS/JS immer getrennt
    <name>.astro        HTML-Markup
    <name>.scss         Styles nur für diesen Block
    <name>.js           Verhalten (nur wenn nötig)
  content/posts/        Beiträge (Markdown)
  content/pages/        feste Seiten: Über uns, Gewässer, Tageskarten, Kontakt, Impressum, Datenschutz
                        (optional im Kopf: hero, eyebrow, intro)
  layouts/Base.astro    Grundgerüst jeder Seite (Kopf, Header, Footer)
  pages/                URLs – setzen nur Blöcke zusammen
  styles/               globale Grundlagen (Variablen, Mixins, Schrift, Buttons)
  lib/                  Hilfsfunktionen (Beiträge laden, Seiten aufteilen, Tags)
static/                 Bilder (wird 1:1 ausgeliefert), images/design/ = Bilder fürs Layout
```

Blöcke:

- Rahmen: `header`, `footer`, `back-to-top` (Nach-oben-Button), `icon` (SVG-Icons), `fish-swim` (Forellen, Äschen und Barben im Hintergrund)
- Startseite: `hero`, `facts`, `latest`, `waters`, `cta`
- Beiträge: `blog` (Liste), `post-card` (Kachel), `pagination`, `post` (Einzelbeitrag)
- Seiten: `page-header`, `page` (feste Seite), `content` (Markdown-Text), `search`, `taxonomy`

Design-Grundlagen (Farben, Schriften, Abstände) stehen als CSS-Variablen in `src/styles/_tokens.scss`.
Schriften: Fraunces + Inter, lokal eingebunden über `@fontsource` (keine Anfragen an Google).

## Neuer Beitrag

Datei in `src/content/posts/` anlegen, Bilder nach `static/images/`:

```markdown
---
title: "Besatz Nagold 2027"
date: 2027-03-01
image: "images/besatz-nagold-2027-1.jpg"
description: "Fischbesatz in der Nagold im Frühling 2027"
categories: ["News"]
tags: ["Nagold", "Bad Liebenzell", "Besatz"]
---

Text …

![Besatz](/images/besatz-nagold-2027-2.jpg)
```

Die frühere Hugo-Version nutzte das Theme „Persian Hugo“ von Themefisher/Gethugothemes (MIT, siehe `LICENSE-persian-hugo`).
