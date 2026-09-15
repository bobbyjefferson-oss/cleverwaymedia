# Clever Way Media — Website (Next.js)

Premium, háromnyelvű (DE / HU / RO) marketingügynökségi weboldal.
Next.js 14 (App Router) · TypeScript · Tailwind · next-intl · Framer Motion · Lenis.

A jóváhagyott prémium dizájn (fekete–krém–arany, Fraunces + Inter + Cormorant),
teljes SEO/AEO réteggel, komponensekre bontott, skálázható architektúrával.

---

## Gyors indítás

```bash
npm install
npm run dev
```

Megnyitás: <http://localhost:3000> → átirányít a `/de` oldalra.
Nyelvek: `/de`, `/hu`, `/ro`.

Build + éles futtatás:

```bash
npm run build
npm start
```

---

## Deploy Vercelre

1. Töltsd fel a projektet egy Git-repóba (GitHub/GitLab).
2. Vercel → **New Project** → válaszd ki a repót → **Deploy** (a Next.js automatikusan felismerődik).
3. Állítsd be a környezeti változókat (lásd lent) a Vercel **Settings → Environment Variables** alatt.
4. Domain hozzáadása: **Settings → Domains** (pl. `cleverwaymedia.de`).

---

## Környezeti változók (`.env.local`)

```bash
NEXT_PUBLIC_SITE_URL=https://www.cleverwaymedia.de
NEXT_PUBLIC_BOOKING_URL=          # pl. Cal.com link, ha üres → a #kontakt szekcióra visz
NEXT_PUBLIC_FORM_ENDPOINT=        # pl. Formspree / saját API route az űrlaphoz
```

---

## Funkciók bekötése (hogy minden éljen) — 3 gyors lépés

Másold le az `env.local.example` fájlt `.env.local` néven a projekt gyökerébe,
és töltsd ki:

**1) Foglalás — Cal.com (Google Calendar szinkron + automata visszaigazoló email)**
1. Ingyenes regisztráció: <https://cal.com>
2. Settings → Availability → kösd össze a Google Calendarodat
3. Hozz létre egy event type-ot (pl. "30 perces stratégiai beszélgetés")
4. A linkből (`cal.com/felhasznalonev/30min`) csak a `felhasznalonev/30min`
   részt írd be: `NEXT_PUBLIC_CALCOM_LINK=felhasznalonev/30min`
5. Ha ez ki van töltve, a "Termin"/"Időpont" szekcióban egy **valódi,
   beágyazott naptár** jelenik meg — a látogató választ napot/időpontot,
   a foglalás automatikusan bekerül a naptáradba, és mindkettőtök kap
   visszaigazoló emailt, mert ezt a Cal.com intézi.

**2) Kontakt-űrlap — Formspree (backend nélkül is valós email-küldés)**
1. Ingyenes regisztráció: <https://formspree.io>
2. Hozz létre egy új Form-ot, másold ki az endpoint URL-t
3. `NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx`
4. Ha ezt kihagyod, az űrlap és az exit-intent popup akkor is működik:
   megnyitja a látogató levelezőjét, kitöltve a `cleverwaymedia@gmail.com`
   címmel — csak Formspree-vel automatikusabb és nem a látogató gépén dől el.

**3) Közösségi média linkek**
```
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/...
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/...
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/...
```
Amit üresen hagysz, az a footerben/kontaktnál inaktív ("Hamarosan") marad —
nem mutat halott linkre.

Miután kitöltötted az `.env.local`-t, állítsd le és indítsd újra a szervert
(`Ctrl+C`, majd `npm run dev`), hogy beolvassa az új értékeket.

Élesítéskor (Vercel) ugyanezeket a változókat másold be:
**Settings → Environment Variables**.

---

## Google Maps

Ágyazz be egy `<iframe>`-et a `Contact.tsx` info-blokkjába (Google Maps →
"Megosztás" → "Térkép beágyazása" → másold a kapott `<iframe>` kódot).

## Analitika

---

## SEO / AEO — mi van már bekötve

- Nyelvenkénti `metadata` + **hreflang** alternatívák (`layout.tsx`)
- **JSON-LD**: `ProfessionalService` (Organization) + `FAQPage` (`lib/schema.ts`)
- `sitemap.xml` (`app/sitemap.ts`) és `robots.txt` (`app/robots.ts`)
- Szemantikus HTML, tiszta heading-hierarchia, `next/font` (gyors betűtöltés)
- Reszponzív, `prefers-reduced-motion` támogatással

Új útvonalak (Services, Case Studies, About, Blog) hozzáadásakor vedd fel őket a
`app/sitemap.ts` `routes` tömbjébe is.

---

## Új aloldal hozzáadása

Hozz létre egy mappát: `src/app/[locale]/leistungen/page.tsx`, a fájl elején hívd
meg a `setRequestLocale(locale)`-t, és használd a `useTranslations`-t. Add hozzá a
szövegeket mindhárom `messages/*.json`-hoz, az útvonalat pedig a sitemaphez.

---

## Struktúra

```
messages/            de.json · hu.json · ro.json   (minden szöveg itt)
src/i18n/            routing · request · navigation (next-intl)
src/app/[locale]/    layout.tsx · page.tsx
src/app/             globals.css · sitemap.ts · robots.ts
src/components/       Nav · Footer · ExitModal · Reveal · Counter · SmoothScroll
src/components/sections/  Hero · Marquee · Automation · Services · Process
                          CaseStudies · Pricing · Faq · Booking · Contact
src/lib/             site.ts · schema.ts
```

---

## Fontos a launch előtt (DE jog)

Németországban kötelező az **Impressum** és a **Datenschutzerklärung** (DSGVO),
valamint tracking esetén a **cookie-consent**. A footerben a helyek megvannak
(`#`), ezekhez hozz létre saját aloldalakat, mielőtt élesíted.

---

## Megjegyzés a tartalomról

A referenciák/case study-számok jelenleg **példaértékűek** — cseréld valós adatokra,
amint megvannak az első referenciakliensek. Véleményeket (reviews) szándékosan nem
tartalmaz, amíg nincsenek valódiak.
