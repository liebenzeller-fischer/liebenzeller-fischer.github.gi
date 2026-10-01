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

Alles ist nach den Seiten benannt: HTML in `src/pages/<seite>.astro`, Styles in `src/styles/<seite>.scss`.

```
src/
  layouts/layout.astro   Grundgerüst jeder Seite: <head>, Kopf, Fuß, Hintergrund-Fische, Nach-oben-Button
  pages/                 HTML je Seite, Dateiname = URL
    index.astro            /             Startseite
    ueber-uns.astro        /ueber-uns/
    gewaesser.astro        /gewaesser/
    tageskarte.astro       /tageskarte/
    kontakt.astro          /kontakt/
    impressum.astro        /impressum/
    datenschutz.astro      /datenschutz/
    post/[...seite].astro  /post/, /post/page/2/ …   Beitragsliste „Aktuelles“
    post/[beitrag].astro   /post/<name>/             einzelner Beitrag
    tags/…, categories/…   Themen und Kategorien
    search.astro           /search/
    404.astro              Fehlerseite
  styles/                SCSS, gleich benannt wie die Seiten
    layout.scss            gilt auf jeder Seite
    index.scss, ueber-uns.scss, gewaesser.scss, tageskarte.scss, kontakt.scss,
    impressum.scss, datenschutz.scss, beitraege.scss, beitrag.scss,
    themen.scss, kategorien.scss, suche.scss, 404.scss
    teile/                 gemeinsame Teile, die die Seiten-SCSS einbinden
                           (_tokens Farben/Schriften, _base, _mixins, _seitenkopf,
                            _inhalt Markdown-Text, _kachel, _liste, _seitenzahlen, _seite)
  scripts/
    layout.js              Menü, Fische, Nach-oben-Button (jede Seite)
    suche.js               Suche
  content/posts/         Beiträge (Markdown)
  content/pages/         Texte der festen Seiten (Markdown)
  lib/                   Hilfsfunktionen (Beiträge laden, Seitenaufteilung, Icons)
static/                  Bilder (wird 1:1 ausgeliefert), images/design/ = Bilder fürs Layout
```

Farben, Schriften und Abstände stehen als CSS-Variablen in `src/styles/teile/_tokens.scss`.
Schriften: Fraunces + Inter, lokal eingebunden über `@fontsource` (keine Anfragen an Google).

Hinweis: Die Beitragskachel steht als HTML in `index.astro`, `post/[...seite].astro`,
`tags/[...path].astro`, `categories/[...path].astro` und (als JS-Vorlage) in `scripts/suche.js` –
Änderungen an der Kachel dort überall nachziehen.

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
