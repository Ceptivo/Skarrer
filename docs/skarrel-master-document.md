MVP & BUSINESS PLAN — WORKING DOCUMENT

Owner: Luke  ·  Location focus: Westville / Pinetown / Upper Highway, Durban, KZN

1. Concept

Skarrel is a hyper-local grocery deals and savings app for the Westville, Pinetown, and Upper Highway area of Durban. It aggregates weekly specials from Superspar, Woolworths, Checkers, Pick n Pay, and OK Foods at the specific branch level, and helps households and bargain hunters find the cheapest place to buy their regular basket — while tracking exactly how much they've saved over time.

Core hook

Best-basket comparison — tells the user which store wins for their actual regular basket, not just individual items.

Always-visible savings tracker — a running total ("You've saved R1,240 this year") that turns a utility into something worth checking regularly.

Genuinely hyper-local — branch-level accuracy for Westville/Pinetown/Upper Highway only, not a national aggregator.

Local personality — proudly Durban/Westville tone, not a generic corporate deals app.

Target users

Households doing regular weekly grocery runs.

Budget-conscious bargain hunters actively planning shopping around specials.

2. Competitive Landscape

This space is not empty. Key existing players as of July 2026:

Grocify — the closest and most serious competitor. Basket-level comparison across 7 retailers, fuel cost estimates, price history/drop alerts, and loyalty card storage. Free, no ads, no data collection. Nationwide and generic — no local community layer, no monetization engine.

Cataloguespecials.co.za — established since 2019, broad catalogue aggregation across SA.

DealScout, Troli, EasiShop — smaller national players offering similar catalogue/price comparison, less polished.

Skarrel's opening: none of the above are suburb-specific, none build genuine local community (Facebook groups, local business partnerships, WhatsApp support), and none have a savings-as-identity hook or local brand personality. The differentiator is local trust and community, not the comparison engine itself — so v1 matches table-stakes features (fuel cost estimate) while leaning hard into hyper-local depth.

3. Features by Version

Stage

Features

Launch (v1)

Deal feed (5 retailers, all Westville/Pinetown/Upper Highway branches) · Browse/search by category or store · My Basket (manual entry, cheapest-store comparison) · Cheapest Basket This Week (standardized public basket index across all 5 retailers) · Savings tracker (running total, vs. average price across stores) · Deal expiry indicator · Fuel cost estimate · Dark mode · Price accuracy crowd-check ("Still accurate?" tap, builds a trust score per deal/retailer) · Weekly shareable graphic (auto-generated Basket Index results) · Price history/trends · Smart shopping route · Multi-list management · Price drop alerts · Shareable savings reports · Budget goal tracking · Family/household sharing · Recipe-to-basket · Ad-free tier · Manual loyalty card entry · "HOT" badge (most-saved/most-added, usage-driven) · Favorite products with notifications when they go on special (premium) · Achievement badges (savings milestones, student savings, streaks) · Public leaderboard (opt-in, off by default; weekly/monthly/all-time; ranked by rand saved and by achievements) · Per-deal share button · One-time tip jar · All-suburb browsing · Public changelog/roadmap · In-app feature suggestion box · Active session/device management

Parallel fast-follow

Full automated scraping, built retailer-by-retailer alongside the launch build rather than gating it. Manual entry covers every retailer from day one; each retailer flips to live automated data as its scraper is finished, shown to users via a "Live" badge. Build order likely follows scraping difficulty (simplest site first) rather than retailer size.

Later (v2)

Barcode scanning · Sponsored local picks · Delivery referrals (beyond grocery) · Data insights play (consent-based) · B2B white-label

Technical note: barcode scanning (Later/v2) requires a barcode/EAN field mapped to products, which is a separate data problem from deal scraping — catalogues typically don't publish barcodes alongside specials. This is why it's deferred until there's usage data to justify the investment. Launch search/matching will be name-based instead.

Scope flag: the Launch tier above is deliberately large — most of what was originally planned as a phased v2 has been pulled forward to ship at once. This is a genuine time commitment even at 3-4 hrs/day solo, and the honest risk is scope creep delaying launch. The mitigating decisions already locked in — manual entry instead of waiting on scraping, no formal launch checklist, launching to everyone rather than a staged beta — all push toward shipping rather than perfecting. Worth revisiting scope honestly if progress stalls, rather than letting "almost done" stretch indefinitely.

4. Monetization

Model

Notes

Premium subscription

R50/month or R400/year (~33% discount for annual commitment). 7-day free trial, with clear upfront disclosure of trial terms and a reminder before the first charge (required by card network rules via PayFast). No free-tier limits on basket size — free tier stays genuinely useful; premium sells on added features, not restriction.

Local business ads

Adjacent local businesses (not the 5 grocery retailers) — no conflict of interest with the core price comparison. Partnerships pursued on a goodwill/relationship basis only — no referral or finder's fees paid to third parties for introductions.

Sponsored local picks

Curated, editorial-feeling local business spotlight — separate from ads.

Delivery referrals

Referral commission via Sixty60, ASAP!, Dash, or non-grocery delivery (Uber Eats/Mr D) for small baskets.

Affiliate cut (sideline)

Kept on the sideline for later exploration.

Data insights play (sideline)

Anonymized, aggregated local trend reports sold to retailers/brands — long-term, requires explicit opt-in consent at signup.

B2B white-label (future goal)

License the engine to other suburb-level business associations once proven in Westville.

Sponsored/Featured deal badge

Brands can pay for a clearly labeled "Sponsored" badge on a deal — visually distinct from the organic "HOT" badge, which stays purely usage-driven (most-saved/most-added) and never for sale. Keeps social proof honest while still monetizing visibility. Viable once traffic is high enough to make sponsorship worth paying for (Later).

Tip jar

Optional one-time tip for users who like the app but aren't ready for Premium. No recurring tip option; kept entirely separate from Premium (no crossover discount or recognition).

5. Go-to-Market

Local Facebook groups (Westville/Pinetown/Upper Highway community pages) + word-of-mouth first — builds trust and social proof.

Meta ads: R200/month budget, used to amplify organic traction rather than as the primary growth driver. At current SA benchmarks (~R1.50–R8 CPC for traffic campaigns, tighter with narrow local geo-targeting), an estimated ~R4 average CPC gives roughly 50 clicks/month; at a realistic 10-15% click-to-signup conversion, that's an estimated 5-8 signups/month directly from ads. Costs typically rise in Q4 (Black Friday/festive) and drop in January.

Referral program: refer 5 friends who sign up → 1 free month of premium, repeatable (every 5 new referrals earns another free month). Referred accounts require phone verification to qualify, to prevent fraud.

Actively request reviews/ratings from happy users.

Courtesy email to retailers regarding catalogue data use; proceed regardless if no legal blocker.

About Skarrel page: a small public page introducing Luke as the local founder behind the app and why it exists — builds trust as a genuine local project, not a faceless company.

90-day goal (from launch): 50 signups. Success measured on signups and total rand saved across all users.

6. Brand & Design

Name: Skarrel — SA slang for hustling/sorting yourself out; sounds like a proper standalone tech brand.

Tone: cheeky local slang, professional execution. Tagline: "Skarrel smart. Save more." The name leans into its actual SA slang meaning (hustling to find/sort yourself out) rather than softening it — consistent with the brand's cheeky-but-professional voice.

Visual direction: teal + coral accent palette; bold, rounded wordmark; simplistic, clean, professional-but-not-futuristic. No mascot for v1.

UI voice examples: empty state — "No deals yet — go skarrel something." Savings milestone — "Nice one, you've skarrel'd R500 this month."

Languages: English (default), with Zulu and Afrikaans available.

Domain: skarrel.co.za appears available (no active site or registered business found) — verify and register directly via an accredited SA registrar (e.g. domains.co.za, hostafrica.co.za).

Primary logo lockup

The "sk" icon mark pairs with the full wordmark for primary branding use; the mark alone (below) serves as the app icon.

7. Website / App Look & Feel

First-pass screen design for the web app, reflecting the brand palette and tone locked in above. Bottom tab navigation across three core sections: Deals, Basket, and Savings.

Deals feed

Basket comparison

Savings tracker

Deals feed

Category chips (All, Dairy, Bakery, Meat, Pantry, Produce) filter the feed by tapping — one active category at a time.

Each deal card shows retailer, branch, product, special price vs. crossed-out original price, and a rand-saving badge.

HOT badge: highlights deals that are most-saved/most-added by users (organic, usage-driven — never for sale). A separate, clearly labeled "Sponsored" badge (see Monetization) is used for paid visibility, kept visually distinct so the two are never confused.

Deal expiry shown as a countdown ("3 days left") so nothing stale is mistaken for current.

Per-deal share button (WhatsApp/link) lets users send a specific deal to a friend, separate from the monthly savings report share.

Basket

Manually added items with quantity, editable inline.

Store-by-store total comparison for the full basket, with the cheapest option clearly highlighted.

Savings tracker

Large, prominent "skarrel'd this month" figure as the emotional centerpiece of the screen.

Savings are calculated against the average price across all stores checked for a basket, not just the cheapest — a bigger, more motivating number that still reflects genuine savings behaviour.

Year-to-date total and a monthly breakdown bar chart to show trend over time.

Local, personality-driven copy (e.g. community percentile framing) reinforces the brand tone at a natural celebration moment.

Leaderboard (opt-in) — off by default; users actively choose to join. Weekly, monthly, and all-time views, with separate rankings by rand saved and by achievements/badges earned. Displayed by nickname by default, with full name as a further opt-in choice.

Content cadence (backup content for slow weeks)

For weeks with few genuine new specials, the feed stays active using:

User-submitted spot — users tip off a deal they found in-store (via WhatsApp to start), Luke verifies and posts it. Turns a content gap into a community engagement feature, reinforcing the local-trust differentiator rather than just filling space.

"Did you know" savings facts — aggregate stats (e.g. "Households in Westville have skarrel'd R48,000 collectively this month") keep the feed feeling alive even without new individual deals.

"Still worth it" reminders — resurface a still-valid deal from earlier in the week that's ending soon, rather than needing something brand new.

Weekly shareable graphic (finalized design)

A branded, portrait-format (1080×1270) social graphic generated weekly from the Cheapest Basket This Week data. Design locked:

Teal gradient background, Skarrel logo and date range top, headline ("Cheapest Basket This Week — Westville & Pinetown").

Full per-item price table across all 5 retailers, zebra-striped rows for readability, with the cheapest price for each item highlighted in a coral chip (no separate legend needed — the pattern reads on its own).

Basket Total row at the bottom with the overall cheapest store highlighted.

Trust line pulling from the crowd-accuracy feature (e.g. "Verified accurate by 94% of Skarrel users this week") — reinforces the accountability positioning directly in the marketing asset.

Footer with tagline and download prompt.

Luke posts this manually to Skarrel's own social pages each week; users can also download and share the same branded graphic themselves.

Onboarding & empty states

New users complete a short tutorial on first open, then land on the deals feed — not a separate home/dashboard screen.

Empty basket state: "Create your basket" with a brief explainer of what a basket is and how it powers the store comparison, so first-time users aren't confused by an empty screen.

Admin deal posting: duplicate check

When Luke posts a new deal, the system flags a likely duplicate if a very similar entry (same retailer + product name + branch) is already live and still valid — shown side-by-side with the existing entry. Luke can still push the new entry through regardless (e.g. a genuine price update or re-run), so the flag informs rather than blocks.

Premium upsell placement

In-feed card — native, dismissible card inside the deals feed (e.g. "Get notified when your favourite items go on special"). Appears infrequently, never on every scroll — kept deliberately low-pressure, not spammy.

Savings milestone nudge — appears on the Savings screen after a strong month ("You've saved big this month — go further with Premium").

Premium comparison page — permanent, low-key entry point via Account/sidebar. Includes testimonials and social proof (ratings, user feedback) above a clear free-vs-premium feature table.

No interstitial popups, especially in a user's first session.

Retention

Inactive users receive a re-engagement email after a period of no opens (e.g. "Here's what you've missed this month").

8. Technical Plan

Platform: web app (PWA) first — installable to the home screen, no App Store approval delay. Future native app path stays open via Capacitor (wraps the existing web app for App Store/Google Play with most code reused, rather than a rewrite) — worth noting that Apple's in-app purchase rules for iOS subscriptions would need addressing separately from PayFast at that point, regardless of which native path is taken.

Admin deal-posting screen: a proper simple screen/form within the app for Luke to post deals, rather than editing Supabase tables directly.

Infrastructure setup (still to do): domain (skarrel.co.za) not yet registered · PayFast merchant account not yet registered (requires business/banking details) · a separate n8n instance dedicated to Skarrel, kept apart from the existing Ceptivo/Shelly Residential instance.

Retailer branch list (still to do): the specific branch names/addresses per retailer that count as "Westville/Pinetown/Upper Highway" haven't been enumerated yet — needed before deals data can be properly scoped and tagged.

Stack: n8n for scheduled scraper workflows (one per retailer) · Supabase for deals, branches, users, baskets, and savings history · TanStack Start + Tailwind + shadcn/ui for the frontend.

Store granularity: tracked by specific branch, not just suburb — Supabase needs a branches table with address/coordinates per retailer.

Update cadence: full weekly refresh (matches catalogue cycles) with daily spot-check tweaks for price changes.

Reliability: if a scraper fails, email alert to Luke; app shows an honest "last updated" timestamp to users at all times.

Scraping strategy: manual entry covers all 5 retailers from day one at launch. Automated scraping is built in parallel, retailer-by-retailer, rather than gating launch — each retailer flips from manual to live automated data as its scraper is completed, surfaced to users via a "Live" badge. First build step: spike one retailer's scraper end-to-end (starting with the simplest site to build confidence and momentum) before building further scrapers.

Pre-launch: a full solo dry run (signup, payment, basket, everything end-to-end) before going public — there's no beta phase, so this is the only check before real users hit it.

Error alerting: critical errors or app-down situations trigger an immediate alert to Luke (e.g. WhatsApp/email), rather than relying on manual checking.

Payments: PayFast for the R50/month or R400/year premium subscription, plus a separate one-time (non-recurring) tip jar payment. Card details tokenized on signup (PayFast handles PCI DSS compliance, not Skarrel); PayFast charges the stored token automatically each cycle per the subscription schedule. Payment success/failure notifications (ITN webhook) feed into an n8n workflow that updates subscription status in Supabase. Failed payments retry automatically for 5 days — Premium access continues during this retry window — before the subscription locks, reverts to free tier, and needs manual reactivation. Worth an email alert to Luke when that happens.

Security baseline: Supabase Auth for signup/login · two-factor authentication (email or SMS OTP) required for all accounts, given payment/subscription data involved · row-level security policies enabled before launch so users only ever see their own data · Supabase service key never exposed client-side · n8n webhook URLs authenticated/unguessable. No raw card data is ever stored by Skarrel — that responsibility sits with PayFast.

Admin analytics dashboard: real-time, pull-based (checked whenever, not pushed) internal dashboard for Luke covering both usage metrics (signups, active users, top/most-saved deals) and revenue metrics (MRR, churn rate) from day one.

Referral fraud prevention: phone number verification required to qualify for referral rewards, making duplicate/fake accounts meaningfully harder to farm for free months.

Maintenance mode: a simple internal flag that shows users a friendly "back shortly" notice during planned downtime, rather than the app breaking outright.

Solo operations: Luke is the only person with admin/posting access for now — no backup access plan in place; revisit if the friend mentioned above comes on to help.

Seasonal periods (Black Friday, festive season): handled as normal with no special pre-staging for v1 — deals posted as they come, same as any other week.

9. Accounts, Privacy & Legal

Account required from signup (email/phone) — no anonymous browsing in v1.

Basket onboarding: manual entry to start; the app refines suggestions over time from browsing/saving behaviour.

Data retention: user data is kept and used under an explicit agreement at signup (consistent with POPIA); a self-serve delete button lets users remove their data at any time.

Support: WhatsApp.

Legal entity: launch as a sole proprietor; formalize (e.g. Pty Ltd) once there's real signal — signups and/or premium subscriptions — rather than before launch.

Builder: Luke, solo, part-time (3-4 hrs/day) alongside the Shelly Residential build — scope discipline is critical given limited time. A trusted friend is available to help if/when needed (likely first for backend/scraper maintenance, keeping brand and product decisions with Luke).

10. Legal Checklist

This is a starting checklist, not legal advice — worth verifying with a professional before launch, particularly the POPIA and CPA points.

Data & privacy

POPIA compliance: consent-at-signup and self-serve delete already planned (see Section 9). Also needed: a proper Privacy Policy document, and a designated Information Officer responsibility holder (required even for a sole proprietor).

Basic cookie/tracking consent notice, given analytics is planned from day one.

Basic data breach response process documented (see Privacy Policy Section 10) — assess, notify the Information Regulator, notify affected users, remediate.

Consumer protection

Consumer Protection Act (CPA): subscriptions typically require a cooling-off period (commonly 5 business days) for cancellation without penalty — confirm exact terms with a professional and reflect in Terms of Service alongside the "cancel at end of billing period" policy.

Terms of Service — covering what Skarrel is (a deal aggregator, not a retailer), that prices/availability are sourced from third parties and may change, and a disclaimer that Skarrel isn't liable for pricing errors ("E&OE — errors and omissions excepted").

Using retailer data & logos

Displaying retailer logos next to deals (for identification) is generally covered under nominative fair use — using a trademark to truthfully refer to the actual retailer, without implying endorsement or partnership. To stay safe:

Use logos only to identify the retailer — never wording that implies partnership (e.g. "Official Partner") unless true.

Don't modify logos (no recoloring, distortion, or combining with Skarrel's own branding into a new mark).

Keep usage factual and small — a badge next to a deal card is low-risk; making a retailer's logo a dominant part of Skarrel's own marketing is higher-risk.

Add a disclaimer in Terms: "All retailer names and logos are trademarks of their respective owners. Skarrel is not affiliated with or endorsed by these retailers."

Source clean logo files from retailers' official press/media kits rather than screenshots, for quality and consistency.

If a retailer formally objects to logo usage, comply immediately and negotiate after.

Keep a record of the courtesy email sent to retailers (see Section 5) as a good-faith paper trail, even without a formal agreement.

Business & tax

Business registration: launch as sole proprietor, formalize (e.g. Pty Ltd) once there's real signal — signups and/or premium subscriptions (see Section 9).

VAT registration only mandatory once turnover crosses the current threshold (R1 million/year) — not a concern at launch scale, worth tracking as the business grows.

Brand protection

Trademark check for "Skarrel" — still open. Worth confirming before further brand investment, since it's cheap to check now and expensive to rebrand later if there's a conflict.

11. Open / Sideline Items

Affiliate referral cut — explore once core product is live.

Official loyalty program partnerships (Smart Shopper, Xtra Savings) — pursue once there's traction to justify retailer outreach.

B2B white-label to other suburbs — long-term, post-Westville validation.

Data insights play — anonymized trend reports to retailers/brands, contingent on consent infrastructure being in place.

Expansion beyond groceries — long-term vision to cover general retail specials (clothing, electronics, etc.), not just groceries. Deliberately kept out of v1/v2 scope: broader retail is a bigger, more competitive lane (vs. bigger-funded national deal aggregators), while grocery remains Skarrel's proven, defensible niche.

PART II — TERMS OF SERVICE

TERMS OF SERVICE

Last updated: [DATE]  ·  Effective date: [DATE]

This is a working draft to review with a qualified attorney before publishing. Bracketed [PLACEHOLDER] fields need to be completed with real business details.

1. Introduction & Acceptance

These Terms of Service ("Terms") govern your access to and use of Skarrel ("Skarrel", "we", "us", "our"), a hyper-local grocery deals and savings web application operating in the Westville, Pinetown, and Upper Highway area of Durban, South Africa, including any related website, features, and content (collectively, the "Service").

By creating an account or using the Service, you agree to be bound by these Terms and by our Privacy Policy. If you do not agree, please do not use the Service.

The Service is operated by [Luke's full name / registered business name], a sole proprietor based in Durban, KwaZulu-Natal, South Africa [to be updated to registered entity name once formalized].

2. What Skarrel Is (and Isn't)

Skarrel is an independent deals-aggregation and savings-tracking service. We display information about promotions and specials sourced from third-party retailers, including Superspar, Woolworths, Checkers, Pick n Pay, and OK Foods ("Retailers").

Skarrel is not a retailer. We do not sell products, process retail purchases, or fulfil orders.

Skarrel is not affiliated with, endorsed by, or officially connected to any Retailer named or displayed in the Service, unless explicitly stated otherwise.

Retailer names, logos, and trademarks displayed in the Service are the property of their respective owners and are used solely to identify the source of a deal, in accordance with fair use. See Section 8 (Intellectual Property).

3. Eligibility & Accounts

You must be at least 18 years old, or the age of majority in your jurisdiction, to create a Skarrel account.

An account (email or phone) is required to use the Service — browsing without an account is not currently supported.

You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.

You agree to provide accurate information when creating your account and to keep it up to date.

Two-factor authentication (email or SMS one-time code) is required on all accounts to help protect your account and payment information.

We reserve the right to suspend or terminate accounts that violate these Terms, are inactive for an extended period, or are used fraudulently.

4. Deal Accuracy & Pricing Information

Deal, pricing, and promotional information displayed on Skarrel is sourced from Retailer catalogues, websites, and other publicly available sources, and in some cases entered manually. While we make reasonable efforts to keep this information accurate and current, Skarrel:

Does not guarantee that any price, discount, or promotion displayed is current, accurate, or available in-store at the time of your visit.

Is not responsible for pricing errors, expired promotions, or discrepancies between the Service and what a Retailer actually charges.

Displays a "last updated" timestamp on deal information as an indicator of freshness, not a guarantee of accuracy.

All deal and pricing information is provided "E&OE" (errors and omissions excepted). Always verify pricing with the Retailer directly before making a purchase decision based on Skarrel.

If you believe a deal shown on Skarrel is inaccurate, you can report it via Account → Report an Issue.

5. Subscriptions & Billing

5.1 Plans

Free plan: full access to core deal browsing, basket comparison, and savings tracking features at no cost.

Premium plan: R50/month or R400/year, unlocking additional features as described in the Service. Pricing may change with reasonable notice.

5.2 Free trial

New Premium subscribers may be offered a 7-day free trial. If you do not cancel before the trial ends, your subscription will automatically convert to a paid subscription and you will be charged. We will provide a reminder before your first charge, as required by applicable card network rules.

5.3 Payment processing

Payments are processed by PayFast, a third-party PCI DSS Level 1 compliant payment gateway. Skarrel does not store your card details — PayFast securely tokenizes your payment method for recurring billing. Your use of PayFast is also subject to PayFast's own terms.

5.4 Cancellation & cooling-off

You may cancel your Premium subscription at any time via your Account settings.

If you cancel, you will retain Premium access until the end of your current billing period; you will not be charged again after that period ends.

In accordance with the Consumer Protection Act, you may have the right to cancel a new subscription without penalty within a cooling-off period of [5 business days] from the date of subscribing — [to be confirmed with a legal professional and finalized].

5.5 Failed payments

If a payment fails, PayFast will retry the charge automatically over a period of several days. Your Premium access continues during this retry window. If payment continues to fail after 5 days, your Premium subscription will be paused and revert to the free tier until payment succeeds or you update your payment method.

5.6 Tip jar

Skarrel may offer an optional, one-time tip feature for users who wish to support the Service without subscribing to Premium. Tips are non-recurring, non-refundable, and do not entitle the user to any Premium features, discounts, or recognition.

5.7 Refunds

Except where required by the cooling-off right described in Section 5.4, payments for the current billing period are non-refundable once that period has started. This applies to both monthly and annual Premium subscriptions.

6. Acceptable Use

When using Skarrel, you agree not to:

Use the Service for any unlawful purpose or in violation of these Terms.

Submit false, misleading, or fraudulent deal information via the user-submission feature.

Attempt to interfere with, disrupt, or gain unauthorised access to the Service, its data, or other users' accounts.

Scrape, copy, or redistribute Skarrel's compiled deal data for a competing commercial service.

Impersonate any person or entity, or misrepresent your affiliation with any person or entity.

7. User-Submitted Content

Skarrel may allow users to submit deal tips or report issues. By submitting content, you confirm it is accurate to the best of your knowledge and grant Skarrel a non-exclusive, royalty-free licence to use, verify, publish, and display that content within the Service. Skarrel reviews user submissions before publishing and may edit, decline, or remove any submission at its discretion.

7a. Public Leaderboard & Badges

Skarrel may offer an optional public leaderboard and achievement badges. Participation is off by default and requires your explicit opt-in via Account settings. If you opt in, your chosen display name (nickname by default, or full name if you further opt in) and your savings or achievement ranking will be visible to other users. You may opt out and remove your leaderboard entry at any time. Certain badges (e.g. student savings) may require verification via student number or student email, used solely for that purpose.

The referral program (refer 5 friends who sign up for 1 free month of Premium) is repeatable — every additional 5 successful referrals earns another free month. Referred accounts must complete phone number verification to qualify, to prevent fraudulent or duplicate account activity. Skarrel reserves the right to adjust or discontinue the referral program, or to decline rewards for fraudulent or abusive referral activity.

8. Intellectual Property

The Skarrel name, logo, brand, and all original content, design, and software are the property of Skarrel and may not be copied, reproduced, or used without permission.

Retailer names and logos displayed within the Service are trademarks of their respective owners, used solely to identify the source of pricing and promotional information. Skarrel is not affiliated with or endorsed by these Retailers.

If you are a Retailer or trademark owner and have concerns about how your mark is displayed, please contact us and we will address this promptly.

9. Data & Privacy

Our collection and use of personal information is described in our Privacy Policy, which forms part of these Terms. In summary:

We collect account information and usage data to provide and improve the Service, consistent with the Protection of Personal Information Act (POPIA).

By maintaining an account with us and not exercising your right to delete your data, you consent to our continued use of your data as described in the Privacy Policy.

You may request deletion of your account and associated data at any time via Account → Delete My Data.

We do not sell your personal information to third parties. Any future use of anonymized, aggregated data for insights or reporting purposes will require explicit opt-in consent, separate from these Terms.

10. Limitation of Liability

To the fullest extent permitted by law, Skarrel and its owner(s) shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service, including but not limited to losses resulting from inaccurate deal or pricing information, service interruptions, or reliance on savings estimates displayed within the Service.

The Service is provided "as is" and "as available" without warranties of any kind, express or implied, to the fullest extent permitted by law.

11. Termination

We may suspend or terminate your access to the Service at any time if you violate these Terms, engage in fraudulent activity, or for any other reason at our reasonable discretion, with notice where practical. You may stop using the Service and delete your account at any time.

Skarrel may discontinue or shut down the Service in whole or in part at any time, at our discretion, including for business or operational reasons unrelated to any violation by you. Where practical, we will provide reasonable notice before doing so.

12. Changes to These Terms

We may update these Terms from time to time. If we make material changes, we will notify you via the Service or by email before the changes take effect. Continued use of the Service after changes take effect constitutes acceptance of the updated Terms.

13. Governing Law

These Terms are governed by the laws of the Republic of South Africa. Any disputes arising from these Terms or your use of the Service will be subject to the jurisdiction of the South African courts.

14. Contact Us

If you have questions about these Terms, contact us via WhatsApp support within the Service, or at [support email address].

PART III — PRIVACY POLICY

PRIVACY POLICY

Last updated: [DATE]  ·  Effective date: [DATE]

This is a working draft to review with a qualified attorney before publishing, and should be read alongside our Terms of Service. Bracketed [PLACEHOLDER] fields need to be completed with real business and contact details.

1. Introduction

Skarrel ("Skarrel", "we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains what personal information we collect, why we collect it, how we use and protect it, and the rights you have over it, in accordance with the Protection of Personal Information Act, 2013 ("POPIA").

This Policy applies to your use of the Skarrel web application and related services (the "Service"). By using the Service, you agree to the collection and use of information as described here.

2. Information We Collect

The table below summarises the personal information we collect, why, and the legal basis we rely on under POPIA:

Data

Why we collect it

Legal basis

Email address / phone number

Account creation, login, and essential communications (e.g. billing, security).

Contract performance / consent

Basket items & savings history

To power the store comparison and savings tracker features.

Contract performance

Usage & analytics data

To understand how the Service is used and improve it, including which deals are most-saved (powers the "HOT" badge).

Legitimate interest

Payment information

To process Premium subscription payments. Card details are handled and stored by PayFast, not Skarrel.

Contract performance

User-submitted deal tips

To review and potentially publish community-submitted deals.

Consent

Support communications (e.g. WhatsApp)

To respond to questions, issues, and reports.

Legitimate interest / consent

Leaderboard participation & display name

If you opt in to the public leaderboard, your chosen nickname (or full name, if you further opt in) and savings/achievement ranking are displayed to other users. Off by default — requires your explicit action to enable.

Explicit opt-in consent (separate from account consent)

Student verification details

Student number or student email, used solely to verify eligibility for the student achievement badge.

Consent

Two-factor authentication contact details

Email or phone number used to send one-time verification codes at login, required for account security.

Contract performance / legal obligation

3. How We Use Your Information

To create and manage your account.

To provide the core features of the Service — deal browsing, basket comparison, and savings tracking.

To process Premium subscription payments and manage billing.

To send essential service communications (e.g. billing notices, security alerts, response to support requests).

To send re-engagement communications if you've been inactive for a period, and (if you opt in) product updates or promotional content.

To improve the Service, including using aggregated usage data to power features like the "HOT" deals badge.

To detect, prevent, and address fraud, abuse, or technical issues.

4. Who We Share Information With

We do not sell your personal information. We share limited information with the following categories of third-party service providers, solely to operate the Service:

PayFast — processes Premium subscription payments and securely stores tokenized payment details. Skarrel never sees or stores your raw card details.

Supabase — our database and authentication provider, used to securely store account, basket, and savings data.

n8n — our workflow automation tool, used for tasks like scraper scheduling, payment status updates, and re-engagement emails.

Each provider is contractually and/or technically restricted to using your information only to provide their service to us, not for their own purposes.

Note: confirm the hosting region(s) used by Supabase and any other processors, and whether any personal information is transferred outside South Africa — this affects the cross-border transfer disclosures required under POPIA.

5. Data Retention

We retain your personal information for as long as your account remains active, or as needed to provide the Service. If you delete your account via Account → Delete My Data, we will delete or anonymise your personal information within a reasonable period, except where we are required to retain certain records by law (e.g. billing records for tax purposes).

By maintaining an account with us and not exercising your right to delete your data, you consent to our continued use of that data as described in this Policy.

6. Your Rights

Under POPIA, you have the right to:

Access the personal information we hold about you.

Request correction of inaccurate or outdated information.

Request deletion of your personal information, at any time, via Account → Delete My Data.

Object to our processing of your information in certain circumstances.

Withdraw consent where processing is based on consent (e.g. promotional communications, leaderboard participation), without affecting the lawfulness of processing before withdrawal.

Lodge a complaint with the Information Regulator of South Africa if you believe your rights have been infringed (details in Section 10).

6a. Public Leaderboard

Participation in the public leaderboard is off by default and requires a separate, explicit opt-in — it is not covered by your general account consent. If you opt in, your chosen nickname (or full name, if you separately choose to display it) and your savings or achievement ranking become visible to other Skarrel users. You can leave the leaderboard at any time via Account settings, which will remove your entry from all leaderboard views.

7. Cookies & Analytics

The Service uses basic cookies and similar technologies to keep you logged in and to collect analytics about how the Service is used (e.g. which deals are viewed or saved most, which powers features like the "HOT" badge). You can control cookies through your browser settings, though some features of the Service may not function correctly without them.

8. Security

We take reasonable technical and organisational measures to protect your personal information, including:

Authentication and access control via Supabase Auth.

Row-level security policies so users can only access their own data.

No storage of raw payment card data — this is handled entirely by PayFast, a PCI DSS Level 1 compliant provider.

Restricted access to backend systems and service credentials.

No method of transmission or storage is 100% secure, and we cannot guarantee absolute security, but we are committed to promptly addressing any issues that arise.

9. Children's Privacy

The Service is not directed at, or intended for use by, children under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently collected such information, we will take steps to delete it.

10. Data Breach Response

In the event of a security compromise that may have affected your personal information, Skarrel will:

Assess and contain the incident as quickly as reasonably possible.

Notify the Information Regulator of South Africa as required under POPIA.

Notify affected users without unreasonable delay, describing what happened, what information may have been affected, and what steps are being taken.

Take reasonable steps to prevent similar incidents going forward.

Note: this is a basic outline — a fuller incident-response process (specific escalation steps, timelines, and responsibilities) should be documented internally before launch, even for a solo-operated service.

11. Information Officer & Complaints

Our designated Information Officer, responsible for POPIA compliance, is:

[Information Officer name] — [contact email] — [to be confirmed; required under POPIA even for a sole proprietor].

If you have concerns about how we handle your personal information that we haven't resolved satisfactorily, you may lodge a complaint with the Information Regulator of South Africa:

Website: inforegulator.org.za

Email: [complaints email — to be confirmed from the Regulator's current published contact details]

12. Changes to This Policy

We may update this Privacy Policy from time to time. If we make material changes, we will notify you via the Service or by email before the changes take effect. The "Last updated" date at the top of this Policy will reflect the most recent revision.

13. Contact Us

If you have questions about this Privacy Policy or how we handle your personal information, contact us via WhatsApp support within the Service, or at [privacy contact email].