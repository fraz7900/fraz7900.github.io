# Advising: setup and maintenance

This guide covers the Advising section (`/advising/…`): how to switch on real booking, how to add content, how
consent is tracked, and how paid sessions could be added later. Nothing here has been configured for you yet.
Every booking setting below is a **proposal for you to apply in your own account**.

- Config: `src/content/advising/config.ts`
- Services: `src/content/advising/services.ts`
- Supported tests: `src/content/advising/tests.ts`
- FAQ: `src/content/advising/faq.ts`
- Scholarship guides: `src/content/advising/scholarships.ts`
- Stories: `src/content/advising/stories.ts` (dev-only samples in `stories.dev-fixtures.ts`)
- Updates: `src/content/advising/updates.ts`
- Logic (all unit-tested): `src/lib/advising/*`

Content is validated when the site builds, so a story without consent, a deadline without a check date, or an exact time
without a time zone fails the build with a readable message.

## Current state

- **Online booking is off** (`BOOKING.enabled = false`). `/advising/book/` shows an email fallback
  (`mailto:frazahmed79@gmail.com?subject=Advising conversation: <focus>`). No placeholder links and no fake availability are published.
- **The booking page is a guided two-column flow.** On the left, visitors choose one of four focuses (`src/content/advising/bookingFocus.ts`).
  On the right, they see the session details and pick a time. Links such as `/advising/book/?topic=scholarships` preselect a focus, and the choice
  stays in the URL, so the Back button restores it. The progress indicator never shows "confirmed": only the provider's
  confirmation (or your email reply) confirms a booking.
- **Introductory sessions are free and 30 minutes long** (`BOOKING.pricing`, `BOOKING.sessionMinutes`). Every page reads these values.
- **No tests are confirmed.** The test-prep page offers general planning only. GRE, GMAT, IELTS and TOEFL appear only under `next dev`.
- **No stories are published.** The stories page shows an honest empty state (see "Stories" for the build detail).
- **Four updates are published**, each checked on 14 November 2026. The Australia Awards entry is marked "not verified" because the DFAT page couldn't be reached during the build.
- **There is no analytics.** None was added, and none should be added just for this section.

## 1. Create the booking schedule (Google Calendar appointment schedules)

Official help: <https://support.google.com/calendar/answer/10729749>

1. On a computer, open Google Calendar. Schedules can't be created in the mobile apps.
2. Click **Create → Appointment schedule**.
3. Set up an introductory session. The settings agreed on 16 November 2026 (weekends 9:00–11:30 am ET, 10 slots a week, and the
   description line `Ref: ADV-INTRO` that the email automation relies on) are kept with the email automation's setup notes, which
   take precedence over the general suggestions below:
   - **Duration:** 30 minutes. Keep `BOOKING.sessionMinutes` in sync.
   - **Availability:** your own real hours. Don't copy anyone's suggestion.
   - **Scheduling window:** minimum notice 24 hours, maximum 30 days ahead.
   - **Buffer time:** 10 minutes.
   - **Maximum bookings per day:** a number you can manage, for example 2.
   - **Calendars checked for conflicts:** your main calendar. This blocks busy times without showing their details to anyone.
   - **Location:** Google Meet video conferencing, if your account offers it.
   - **Booking form:** keep first name, last name and email (required by Google). Add a required item **"What would you like to discuss? (career, test prep, admissions or scholarships)"**. Visitors see their chosen focus on this site with a copy button to paste into it.
   - **Email verification:** turn on if spam becomes a problem.
   - **Confirmations and reminders:** turn on. You can't edit the reminder text.
4. In the booking page description, state the cancellation and rescheduling process. For example: "Use the link in your confirmation email to reschedule or cancel at least 12 hours ahead."
5. Save, open the booking page, and copy its URL. Then use Google's **Share** option for the official website embed code. Take the `src` URL from that embed code rather than building one yourself.

**Account eligibility.** Google says some appointment-schedule features need an eligible Google Workspace or Google One subscription, and it doesn't list which ones on that page. Check what your account offers before relying on any feature. A university (Workspace) account is controlled by its administrators and may lose access after graduation, so a personal account is the safer long-term owner.

### Paste the configuration

In `src/content/advising/config.ts`:

```ts
export const BOOKING: BookingConfig = {
  enabled: true,
  provider: "google-calendar",
  bookingUrl: "https://calendar.app.google/…",   // the booking page link you share directly
  embedUrl: "https://calendar.google.com/calendar/appointments/schedules/…", // src from Google's embed code, or null
  topicParam: null,          // Google has no documented prefill: leave null
  sessionMinutes: 30,
  format: "One-to-one video call (Google Meet)",
  pricing: { mode: "free" },
  sessionNote: "Sessions are recorded…", // shown under the session details; null to hide
  fallback: { … },           // keep as is
};
```

`src/lib/advising/booking.ts` accepts only URLs starting with `https://calendar.google.com/calendar/appointments/` or `https://calendar.app.google/`. Anything else is treated as misconfigured: the page falls back to email, and in development it shows why. The website and your shared link point at the same booking page, so the provider remains the single source of truth.

**Then test it yourself.** Make a real test booking from the live page and from the direct link, then cancel both. Don't ask anyone else to make test bookings.

### Alternative: Calendly

Use Calendly instead only if Google doesn't suit you. Don't run both.

- Set `provider: "calendly"` and use your `https://calendly.com/…` event link as both `bookingUrl` and (optionally) `embedUrl`.
- Calendly documents prefilling custom-question answers with `a1`, `a2`, … parameters. If "Topic" is your first custom question, set `topicParam: "a1"`. Only the service name is ever passed; a visitor's own answers never go in URLs.

### What the integration deliberately doesn't do

- It doesn't simulate time slots, scrape or restyle the provider's iframe, or guess its parameters.
- It doesn't treat an iframe load or a link click as a booking.
- It stores no visitor data. The provider collects name, email, topic and the optional question, and sends confirmations.

## 2. Services and prices

`src/content/advising/services.ts` holds each service's copy, `active` flag, pricing and duration. Set `active: false` to hide a service from the landing page, the service finder and the booking topics.

## 3. Test offerings

In `src/content/advising/tests.ts`, set `confirmed: true` on a test once you've decided to offer support for it. Unconfirmed tests never ship to production. When you describe formats or rules, link the official provider rather than restating them, because they change.

## 4. Scholarship guides

`src/content/advising/scholarships.ts` sorts information into four categories that must stay separate:

- **A. Programme guides:** facts read on the official page, with `scope` and `lastChecked`.
- **B. My experience:** `PERSONAL_EXPERIENCE`, limited to what's verified.
- **C. Guest stories:** other scholars' journeys, which never imply coaching.
- **D. Advised outcomes:** only people you actually advised, with a verified outcome.

Before editing facts, re-read the official page and update `lastChecked`. Always state country scope; for example, the Fulbright facts here come from USEFP and apply to Pakistan only.

## 5. Stories and consent

Story fields: slug, title, status, display name or pseudonym, programme, country/university/year (only if verified), relationship (`personal`, `guest`, `advised`), starting point, challenge, preparation, timeline, lessons, outcome (+ `verified`), quotes (+ `approved`), image (+ `approved`, alt text), dates, and consent.

**Consent tracking without exposing private records:**

1. Keep the signed consent (email or form) **outside this repository**, for example in `OneDrive/…/Website/Advising-consent/`.
2. Give each record a non-identifying reference such as `C-2026-001`, and keep a private index linking the reference to the person, what they approved (text, name or pseudonym, photo) and the date.
3. In the story, set `consent: { status: "on-file", reference: "C-2026-001" }`. Publishing is refused unless consent is `on-file`, every quote is `approved`, any image is approved with alt text, and an `advised` story has a verified outcome.
4. If someone withdraws consent, set `status: "withdrawn"`. The story disappears on the next build and deploy.

Never put contact details, private notes or unapproved text in the repository, even in drafts.

**Dev-only samples.** `stories.dev-fixtures.ts` holds a clearly fictional sample that loads only under `next dev`. `npm run check:publish` fails the deploy if its marker appears anywhere in the build output.

**Build detail.** Static export needs at least one generated story page. While there are no published stories, the build creates `/advising/stories/none/`, which renders "Page not found", is marked `noindex`, and isn't linked from anywhere. It disappears automatically once a real story is published. (The alternative is to rename the route folder until the first story exists, which avoids the stray URL but makes publishing a manual step.)

Filters by programme, country and category appear once there are `STORY_FILTER_THRESHOLD` (6) stories.

## 6. Updates

Each record in `src/content/advising/updates.ts` has a type, programme, destination, applicant scope, degree levels, cycle, an official `sourceUrl`, `publishedOn`, `lastChecked`, optional `opens`/`deadline`, an optional `declaredStatus` (`open`, `upcoming`, `closed`, `rolling`, `unverified`), and a `draft`/`published` state.

Rules:

- **Dates only when the source states them.** A date-only deadline (`{ kind: "date" }`) gets no time zone, and the site treats it as passed only once it has ended everywhere. An exact deadline (`{ kind: "instant" }`) needs an ISO time with `Z` or an offset, plus the source's own time-zone label.
- **Name the cycle as the source does** ("2027–28 intake", "applications August–October 2026"), so the intake year is never confused with the application year.
- **`lastChecked` is the day you read the source.** Leave it `null` (and the status `unverified`) if you couldn't check. The site never shows "open" by inference: past deadlines flip to closed, an "upcoming" item past its opening date shows "not verified", and items not re-checked for 60 days get a stale notice.
- **Calendar files** (`.ics`) are offered only for checked deadlines that haven't passed. They're all-day events for date-only deadlines and UTC times for exact ones.
- **Expiry happens twice:** statuses are computed at build time, then re-evaluated against the visitor's clock after the page loads, with no hydration mismatch.

Re-check open items before each deploy, and rebuild regularly so build-time statuses stay current.

## 7. Paid sessions later (not active)

The config already supports `pricing: { mode: "paid", amount, currency }` and `{ mode: "contact" }`. The price line and FAQ adapt automatically. To charge for sessions:

1. **Use the provider's own payments.** Google appointment schedules can request payment through a connected Stripe account, depending on your plan and country. Calendly supports Stripe and PayPal on paid plans. Check subscription, merchant-country and currency eligibility first.
2. Set the price in the provider, then mirror it in `BOOKING.pricing` so the site shows the same amount.
3. Don't build a custom checkout. If one is ever considered: payment confirmation and any booking change that depends on it must be verified server-side, for example through the payment provider's signed webhooks. A client-side redirect is not proof of payment, and this static site has no server to do that verification.

Don't add crossed-out prices, seat counts or countdowns.

## 8. Privacy

- The planning tools run in the browser and send nothing anywhere. The readiness checklist saves to `localStorage` only if the visitor ticks "Save my progress on this device", and reset clears it.
- No answers go into URLs, analytics or logs. Booking links carry only a service id (`?topic=career`).
- The site has no privacy notice. If you add one, say that bookings are processed by the scheduling provider (Google or Calendly) under its own privacy policy.

## 9. Checks

```bash
npm run check          # lint → typecheck → unit tests → build → browser tests
npm run check:publish  # fails on placeholders or dev fixtures in out/
```

`e2e/advising.spec.ts` covers every advising route, the service finder, the career reflection, the checklist (saving and reset), the study plan, the update filters and URL state, deadline expiry against a controlled clock, calendar downloads, the booking fallback and the stories empty state.
