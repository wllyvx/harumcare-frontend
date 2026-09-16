# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: community members who read and donate — they discover HarumCare through publishable content (news, blog, kajian) and act by supporting Campaigns via donations. Content builds trust; donation is the decisive action.

Secondary:
- Consultation seekers using Pojok Konsultasi to ask and follow threads.
- Authors / admins managing PublishableContent, Campaigns, consultations, donations, and users under role-based access.

## Product Purpose

HarumCare is an Islamic care platform that makes trusted guidance and collective action accessible in one place — reading well-curated content, supporting verified donation campaigns, and seeking consultation — so a visitor can move from learning to meaningful action without switching tools.

Success means a reader finds relevant content quickly, understands campaign progress transparently, and completes a donation or consultation with confidence.

## Positioning

Islamic care lens applied end-to-end. PublishableContent, kajian, and campaigns are curated through that lens — not generic health, publishing, or donation software with an Islamic skin. The integrated loop (content → trust → campaign → donation → consultation follow-up) is what a single-purpose neighbour cannot truthfully copy.

## Operating Context

Core workflows:
- Browse and read PublishableContent by ContentType (news | blog | kajian) via list and detail (slug-routed), with view-count derived on detail reads.
- Discover and support Campaigns (list/detail, progress, linked from content via campaignId/CampaignRef).
- Donate via payment flow; track donation history under profile/donations.
- Seek and follow consultation in Pojok Konsultasi (threaded).
- Auth (login/signup/logout), profile, Zakat calculator (kalkulator-zakat), Tilawah player with surah data.
- Author/admin: create and manage PublishableContent, Campaigns, consultations, donations, users.

Environments: web on Cloudflare. Frontend: Astro + React islands + Tailwind. Backend: Hono + Cloudflare D1 + R2, with Drizzle ORM. Deployed via Wrangler.

## Capabilities and Constraints

Confirmed capabilities:
- PublishableContent with ContentType, Slug (unique per ContentType), Author ({nama, username}), CampaignRef ({title, imageUrl}), ViewCount (derived on detail).
- Campaigns and Donations with campaign-linked content and payment routing.
- Consultations (Pojok Konsultasi) with threaded detail views.
- Auth with role-based middleware, zakat calculator, Tilawah surah playback, file upload to R2.

Constraints:
- Brand name HarumCare preserved.
- Web only; no native app scope.
- Must not fabricate testimonials, campaign outcomes, pricing, or press.
- Stack is incumbent (Astro frontend, Hono/D1/R2 backend) — not greenfield.

Undecided: audience language scope beyond Indonesian, specific accessibility target level, and donation payment providers beyond current flow.

## Brand Commitments

Name: HarumCare. No invented tagline, palette, or logo beyond what exists in repository. Voice and visual identity to be established in DESIGN.md via new-work; init records no binding aesthetic direction beyond the Islamic care positioning.

## Evidence on Hand

- Repo content: `harumcare-backend/src` (Hono routes for auth, blog, news, kajian, campaigns, consultations, donations, upload, users), `harumcare-frontend/src/pages` (home, blog/news/kajian/campaign lists and slug/id details, pojok-konsultasi, kalkulator-zakat, payment, profile, admin CRUD), `CONTEXT.md` domain vocabulary.
- No verified testimonials, case studies, press, or benchmarks on hand — must not invent.

## Product Principles

1. Trust before transaction — content quality and campaign transparency earn the donation.
2. One roof, clear paths — a reader can go from article to campaign to donation without confusion.
3. Islamic care with substance — guidance is curated and actionable, not decorative.
4. Progress made visible — campaign state and next steps are always legible.
5. Respect the seeker — consultation and donation flows are calm, private, and unhurried.

## Accessibility & Inclusion

No product-specific accessibility requirement established beyond standard web best practice. To be refined when audience needs are confirmed.
