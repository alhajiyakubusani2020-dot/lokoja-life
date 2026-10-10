# -*- coding: utf-8 -*-
"""Report content part A: Chapters 1-3 (Exec Summary, Competitor Profile, Sentiment).
Block grammar consumed by build_research_report.py. All text is emoji-free by design.
"""

A = []

# ============================ CHAPTER 1 ============================
A.append(("h1", "Executive Summary and Method"))

A.append(("body",
 "This report exists because an outside viewer told us, honestly: the project is good, but Lagos Life "
 "currently looks better. Rather than argue with that impression, we treated it as a research question. "
 "Over one working day we studied the real Lagos Life product from every angle the public internet allows, "
 "opened the game itself and played through its entire first-time experience on a phone-sized viewport, "
 "audited our own repository screen by screen, and captured equivalent screenshots of both products. "
 "This document records what we found, what it means, and what we should do about it. No code in Lokoja Life "
 "was modified during this phase, exactly as instructed."))

A.append(("body",
 "The headline finding is uncomfortable but precise. Lagos Life is not winning because of a superior engine, "
 "a bigger world, or deeper simulation; by our own engineering measures our 3D world, movement controller and "
 "economy are more ambitious. It is winning because of presentation and aliveness. Its very first screen is the "
 "living city itself, crowded with real players, live counters and working billboards. Its onboarding is a "
 "four-minute story that ends with the player standing inside their own 3D home with a concrete next action. "
 "Its phone is a delightful miniature iOS with a chat layer connected to real people. Every screen radiates "
 "the feeling that something is happening right now. Lokoja Life today is a well-engineered, visually coherent "
 "single-player world that quietly waits for the player to discover it. That difference, not 3D versus 2D, "
 "is what the feedback was measuring."))

A.append(("callout", ("5,874,313", "Total players shown on lagoslife.app/stats, captured 10 Oct 2026 (self-reported, unaudited)")))
A.append(("callout", ("130,287", "Players online at the same capture; 1,396,143 active that day; 35.2M visits all time")))
A.append(("callout", ("$10M", "Valuation 8 days after launch, from a $500K pre-seed by Vatar Inc (Techpoint Africa, 9 Oct 2026)")))

A.append(("h2", "Method and evidence discipline"))
A.append(("body",
 "Every factual claim in this report carries a source, and every source was opened and read rather than recalled "
 "from memory. We tier the evidence so the reader can weigh it. Tier A is official material: the lagoslife.app "
 "landing page, live stats page, Terms of Use, Game and Brand Disclaimer, and the Google Play listing, all "
 "captured on 10 October 2026. Tier B is independent press: Vanguard, Techpoint Africa, TechCabal, TechBrief "
 "Africa and Technext, published between 6 and 9 October 2026. Tier C is community signal: TikTok, Instagram, "
 "X and Nairaland items discovered through search, plus one creator interview (Fisayo Fosudo, 7 October). "
 "Tier D is fan infrastructure: three independent guide sites that had already documented the game's data "
 "in remarkable detail. Where numbers are the developer's own - player counts, revenue, tap-through rates - "
 "we say so explicitly, because none of them are independently audited."))

A.append(("body",
 "One disclosure, made deliberately. To answer the question of why players might prefer Lagos Life we needed "
 "to see more than its landing page, so we created a single throwaway research account (username lokoresearch01) "
 "on 10 October 2026 and walked the full new-player path: sign-up, character creation, the birth lottery, home "
 "selection, the welcome tour, the phone, the map, the jobs app and a venue sheet. We confirmed the 18+ gate "
 "during sign-up, made no real-money purchases, entered no third-party personal data, and used the account for "
 "observation only. All screenshots in this report were captured by us during that session, or of our own game "
 "on a local dev server, and are reproduced here solely for internal comparative analysis; all trademarks and "
 "assets remain the property of their respective owners, and nothing has been copied into Lokoja Life."))

A.append(("h2", "Limitations, stated plainly"))
A.append(("bullet", [
 "Direct comment threads on Instagram, TikTok and Reddit could not be read without account logins, so player "
 "voice is reconstructed from search-indexed snippets, press interviews and guide-site summaries rather than "
 "raw threads. We did not invent any quotation, rating or count.",
 "All Lagos Life scale and revenue figures are self-reported on its own dashboard or in founder interviews. "
 "Press counting the same dashboards produced figures from 670,000 (Arise News, early October) to 4.3 million "
 "players (TechCabal, 8 October), which shows how soft these numbers are.",
 "The game is nine days old at the time of writing. Anything observed this week, including prices, features "
 "and even the economy itself, may already have changed; the founder ships updates daily.",
 "Our own product was audited through its code, its test suite (136 checks, all passing) and fresh screenshots "
 "at 390 px; we did not run formal user testing on either product.",
]))

# ============================ CHAPTER 2 ============================
A.append(("h1", "Deliverable 1 - Competitor Profile: Lagos Life"))

A.append(("h2", "Identity and delivery"))
A.append(("body",
 "Lagos Life is a free, browser-based, multiplayer life simulation set in a shared virtual Lagos, launched on "
 "1 October 2026 - Nigeria's Independence Day. It was created by Shalom Rayhamen, a UK-based Nigerian developer "
 "who posts as @Shalom_HeyEliy and operates the game personally per its Terms of Use. Within a week the operation "
 "formalised: Vatar, Inc. was incorporated in Delaware on 5 October and closed a $500,000 pre-seed at a $10 "
 "million valuation, with participation from Flutterwave CEO Olugbenga Agboola's fund Resilience17, Oo Nwoye, "
 "Terra Industries CEO Nathan Nwachuku and Mono CEO Abdulhamid Hassan (Techpoint Africa, 9 October). The Google "
 "Play listing, which went live around 8-10 October under developer GreatCallie, packages the same web game as "
 "an Android app; the founder has said native Android and iOS apps could arrive by the end of October. The "
 "Play Store entry is verified genuine - its screenshots are pixel-identical to the browser experience we "
 "played - and carries a Simulation category label, a 3+ rating with an 18+ age gate enforced in-game, and "
 "a 10 October 2026 update date, indicating a daily shipping cadence."))

A.append(("h2", "Verified scale (all self-reported)"))
A.append(("body",
 "The game's public stats page, updated every 30 seconds, showed the following when captured on 10 October 2026: "
 "130,287 players online, 1,396,143 active today, 1,539,123 active yesterday, 5,874,313 total players, 4,537,873 "
 "visits today and 35,210,661 visits all time. Press reports along the timeline: one million players within "
 "three days (Technext, 7 October, described as faster than ChatGPT's launch curve), roughly 2.5 million players "
 "and 23 million visits by day four with a peak of 122,000 concurrent users (Technext), and 4.3 million players "
 "by 8 October (TechCabal). Arise News counted over 670,000 total players at its own earlier checkpoint, which "
 "usefully illustrates that these figures are soft. The honest summary: this is one of the fastest-growing "
 "African consumer products ever observed, and the exact numbers matter less than the order of magnitude."))

A.append(("h2", "What the product actually is"))
A.append(("body",
 "Lagos Life is a Sims-style persistent world played with other real people. A new player signs up with a "
 "username and password (email optional), then builds a Sim through a five-step wizard: look (a rotatable 3D "
 "avatar with Nigerian hairstyles including Gele and Braids, outfits from Classic to Owambe, and fabric patterns "
 "including Ankara, Adire and Aso-oke); two personality traits chosen from ten that carry real mechanical effects "
 "(Hustler grows the Hustle skill faster and bosses notice; Lazy Bone's energy lasts longer but work suffers); "
 "one lifetime dream such as Oga at the Top, Lekki Landlord (net worth of one million naira), Afrobeats Star, "
 "Everybody's Padi (best friends with four people) or Yaba Unicorn (get a startup funded at CcHub); a birth "
 "lottery that assigns once per account either Nepo Baby (500,000 naira pocket money and a Lekki flat) or LAPO "
 "Baby (a 60,000 naira loan repaid at 12,000 naira per week); and a first home with explicit trade-offs - a "
 "UNILAG hall bunk at 1,200 naira weekly rent, a Mushin face-me-I-face-you room at 2,400, a Yaba self-contain "
 "at 6,000, or a locked Lekki mini-flat the game teases with the line: with LAPO money? Work your way here."))

A.append(("body",
 "From there the loop is: live in your furnished 3D room; keep six needs green (hunger, energy, fun, social, "
 "hygiene, bladder) which decay on their own; work shifts through a phone Jobs app listing 32 careers at five "
 "levels each (160 positions, from 6,600 to 99,000 naira per shift per the fan wiki's data-driven tables); pay "
 "rent every Saturday; move around a city of 31 venues in Lagos with roughly 275 documented activities, plus "
 "Abuja with 69 places and 348 activities and Port Harcourt (both added 6 October); and above all, meet other "
 "players - chat publicly at venues, DM by username, form groups, visit houses, transfer money, and vote in a "
 "weekly governor election whose winner issues decrees with real gameplay effects (a captured notification read: "
 "minimum wage raise is now law in Lagos; everyone earns 15 percent more per shift, by Governor @Franka). "
 "Six of the eight reviewer-visible systems - jobs, needs, rent, transport with five modes (Trek, Keke, Danfo, "
 "Okada, Cab), socialising and city switching - were personally verified in our play session."))

A.append(("h2", "The social layer: the phone"))
A.append(("body",
 "The phone is the product's signature. It opens as a loving iPhone recreation on a Lagos-sunset gradient "
 "wallpaper, complete with status bar, a large clock reading Friday 9 October - Lagos, and a grid of colourful "
 "app icons: Jobs, Messages, Games, Contacts, Help and guide, Courses, Ride, Chowdeck (a real Nigerian delivery "
 "brand), Bank, Boutique, Forbes, Houses, Cars, Invite, Health, Invest, Assurance and LagosBet. Alongside the "
 "system apps sit third-party entries badged NEW - Meetumo, PopOut Tickets, Eleventhco, Nollywood, Bet Tips, "
 "versiah.com - which are paid app placements sold to brands, exactly as the Terms of Use describe under "
 "purchasing: virtual application placement on a player's in-game phone. Messages separates Chats from Groups, "
 "supports push notifications, and its empty state reads: no chats yet; meet real players around Lagos, or tap "
 "a house on the map, and say hi. The social layer is not a menu bolted onto a game; it is the game's reason "
 "to return, and the empty state itself pushes the player back into the world."))

A.append(("h2", "Economy, monetisation and live operations"))
A.append(("body",
 "The game monetises from day one through five streams (founder statements via Techpoint and TechCabal): "
 "advertising - virtual billboards rented to real businesses from about 5,000 naira per week at launch, rising "
 "to 50,000, plus sea plots at 18,000 and stats-page slots; music promotion; brand deals; football streaming; "
 "and optional wallet top-ups where players buy in-game naira with real money through Flutterwave. One reported "
 "campaign produced 3,686 taps from 9,826 app opens - a 38 percent tap-through that TechBrief Africa correctly "
 "frames as a single unaudited campaign rather than a benchmark. The economy has visibly strained under growth: "
 "the founder admitted there was too much money in the game, a cash-generation loophole spread trillions through "
 "player transfers, her fix flagged transfer-only accounts and zeroed some balances, and the team now sells "
 "expensive goods to wealthy players - we have created a class, we need to offer that class their value. "
 "Players have asked to withdraw real money; the Terms firmly refuse, defining Game Naira as non-redeemable. "
 "Live operations are constant: compensation gifts (we received 1,000,000 naira for patience during an outage "
 "day), a server-wide daily gem hunt with a next-prize counter, elections, and city launches."))

A.append(("h2", "Technology and delivery observations"))
A.append(("body",
 "Publicly observable facts only: the game runs in any modern mobile or desktop browser with no download, and "
 "spreads through links on X, WhatsApp, TikTok and Instagram; it supports add-to-home-screen with an in-game "
 "install banner calling itself faster to open, like a real app; infrastructure moved from Cloudflare's "
 "database to DigitalOcean to AWS with autoscaling within the first week, costing roughly 6,000 dollars per "
 "month according to the founder; reliability is imperfect - the fan guide maintains a fixes page for a "
 "Reconnecting to Lagos state; and the whole thing was built fast with AI-assisted tooling by a developer who "
 "credits The Sims 3 and the danfo driving game Lagos Run as inspirations. None of this is criticism; it is "
 "the operating model: build in weeks, ship daily, monetise the attention immediately, and fix in public."))

A.append(("table", {
 "caption": "Table 2.1 - Lagos Life fact sheet (all items verified against sources in Appendix A)",
 "widths": [0.28, 0.72],
 "header": ["Attribute", "Verified finding"],
 "rows": [
  ["Launch", "1 October 2026 (Independence Day); browser-only at launch"],
  ["Creator", "Shalom Rayhamen (@Shalom_HeyEliy), UK-based Nigerian developer; operator per Terms of Use"],
  ["Company", "Vatar, Inc. (Delaware, 5 Oct 2026); $500K pre-seed at $10M valuation (Techpoint, 9 Oct)"],
  ["Android app", "Play Store listing by GreatCallie live by 10 Oct 2026; wrapper of the web game"],
  ["Age gate", "18+ enforced at sign-up; Terms permit closure of underage accounts"],
  ["Cities", "Lagos plus Abuja and Port Harcourt (both added 6 Oct 2026)"],
  ["Venues", "31 places in Lagos, 69 in Abuja (fan-wiki counts); airport, refinery and one celebrity venue marked coming soon"],
  ["Careers", "32 careers x 5 levels; 6,600 to 99,000 naira per shift (fan wiki, game data)"],
  ["Needs", "Six meters: hunger, energy, fun, social, hygiene, bladder"],
  ["Transport", "Five modes with prices: Trek free, Keke 200, Danfo 200, Okada 300, Cab 650 naira (verified in venue sheet)"],
  ["Social", "Public venue chat, DMs by username, groups, house visits, player-to-player transfers, weekly elections"],
  ["Monetisation", "Billboards, sea plots, stats-page slots, branded venues and in-phone app placements; real-money naira top-ups via Flutterwave"],
  ["Withdrawals", "Refused by design; Game Naira is non-redeemable fictional currency"],
  ["Stats", "Self-reported dashboard: 5.87M players, 35.2M visits, 130K online (10 Oct 2026)"],
 ]}))

# ============================ CHAPTER 3 ============================
A.append(("h1", "Deliverable 2 - Player Sentiment Report"))

A.append(("h2", "How this section was built"))
A.append(("body",
 "Sentiment evidence comes from four channels: press interviews in which the creator repeats player behaviour "
 "and requests; search-indexed posts and captions on Instagram, TikTok, X and Facebook; a Nairaland discussion "
 "surface; and the fan-guide ecosystem, whose very existence within eight days is itself a retention signal. "
 "We could not open native comment threads without personal accounts, so themes below are anchored to specific "
 "platforms, dates and URLs rather than verbatim quotes. Where a claim traces only to the developer, it is "
 "labelled as such. No sentiment percentages are offered, because nothing in the evidence supports a number."))

A.append(("h2", "Recurring praise"))
A.append(("h3", "Theme 1 - It is finally a game about us"))
A.append(("body",
 "The dominant note across every channel is cultural recognition. Players celebrate seeing their own city, "
 "slang, food, music and hustle economics reflected back as gameplay - amala spots, the Shrine, Quilox, NEPA, "
 "danfo, spraying money at parties, LAPO loans. Vanguard's explainer (6-7 October) frames the whole game as "
 "recognisable Nigerian experiences turned into gameplay; an Instagram reel caption from 5 October begins "
 "Lagos Life is supposed to be a game, but somehow it... - the viral format of the sentence itself signals "
 "identification rather than evaluation; and Arise TV's segment (October) is literally titled how Lagos Life "
 "is capturing young Nigerians online. For our purposes the mechanism matters more than the volume: the "
 "praise is aimed at content and voice, not graphics. Lagos Life's 3D is charming but simple; its writing is "
 "what players screenshot and share."))

A.append(("h3", "Theme 2 - Other real people are the product"))
A.append(("body",
 "The second recurring theme is aliveness. The landing page sells it before signup - 132k online now, 29.2 "
 "million visits, real avatars walking the map with username tags - and the game keeps those counters visible "
 "during play. The Facebook explainers (7 October) emphasise meeting and making friends inside the world; the "
 "fan guides document house visits, chatting and money transfers as core activities rather than extras; and "
 "the official accounts' reply patterns push players toward meetups and the weekly election. Multiple press "
 "pieces converge on the same judgement: the shared world, not the simulation depth, is what distinguishes "
 "Lagos Life from a traditional single-player life simulator (Vanguard, 7 October)."))

A.append(("h3", "Theme 3 - Zero-friction access"))
A.append(("body",
 "Praise also concentrates on the delivery model: no download, no store, no storage anxiety, play within "
 "seconds of tapping a link (Technext, 7 October, notes this removed the app-store tax that killed earlier "
 "Nigerian games). The TikTok ecosystem around the game consists largely of how-to tutorials - how to add "
 "Lagos Life to your home screen on Android (4 October), how to get the game on iPhone (5 October) - showing "
 "an audience that needed hand-holding and got it from the community itself. The in-game install banner and "
 "the new Android wrapper both respond to this demand directly."))

A.append(("h2", "Recurring complaints and friction"))
A.append(("bullet", [
 "Economy imbalance and resets. The founder herself reports the economy was flooded through a loophole; some "
 "players held trillions; the fix zeroed transfer-only accounts (Techpoint, 9 October; Fosudo interview, "
 "7 October). Every reset creates its own aggrieved group.",
 "Connection reliability. The fan guide's most-visited troubleshooting page is for a Reconnecting to Lagos "
 "state and login failures from Instagram in-app browsers - real friction for exactly the viral traffic the "
 "game lives on.",
 "Waiting-based pacing. The Play Store description frames everything as costing in-game minutes the city has "
 "a limited supply of; guides describing shift schedules and Saturday rent imply waiting is a designed "
 "scarcity, which some players clearly love and others will find slow.",
 "Trust and safety surroundings. TechBrief Africa (7 October) warns there is no official APK and that fake "
 "files circulate - a direct consequence of viral demand outrunning official channels; the Terms reveal "
 "device fingerprinting and enforcement machinery that implies meaningful moderation load in an 18+ social "
 "space.",
 "Withdrawal expectations. Players repeatedly ask whether game naira can become real money; the answer is no, "
 "and managing that expectation is an ongoing reputational task (Techpoint, 9 October).",
]))

A.append(("h2", "Observed feature requests and how fast they were granted"))
A.append(("body",
 "The most instructive sentiment pattern is velocity. Players asked for more cities on day one; Abuja and Port "
 "Harcourt shipped on day six. Players wanted an app; a Play Store wrapper appeared by day eight to ten. "
 "Players wanted to feel wealthy; luxury goods for the new class were added. Players ask for withdrawals; that "
 "one is refused, and no redeem-code system exists (the fan wiki explicitly warns that sites offering Lagos "
 "Life codes are fabricating them). The lesson for us is not the specific features - it is that publicly "
 "shipping visible responses to player requests within days is itself a driver of the community's goodwill "
 "and content creation."))

A.append(("h2", "Sentiment cautions"))
A.append(("body",
 "Three cautions govern how much weight to put on all of the above. First, hype-cycle distortion: TechBrief "
 "Africa and Arise both explicitly warn that week-one numbers and enthusiasm decay, and the real test is "
 "thirty-day retention, which nobody can see yet. Second, single-source economics: the 38 percent tap-through, "
 "the 46,900 dollar first-four-days revenue and every player count originate from the developer's own "
 "dashboards and statements. Third, audience skew: an 18+ gate and viral TikTok distribution mean the visible "
 "commentariat is young, urban and online-first; it does not represent the whole potential market for a "
 "Nigerian life sim, which is good news for a game like ours that can serve different strengths."))
