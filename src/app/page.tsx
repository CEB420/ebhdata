import { ButtonLink } from "@/components/Button";
import { CodePane } from "@/components/Code";
import { SiteShell } from "@/components/Footer";
import { GrowBlock } from "@/components/GrowBlock";
import { HeroPhoto } from "@/components/HeroPhoto";
import { PricingCards } from "@/components/Pricing";
import { Headline, Reveal } from "@/components/Reveal";
import { CHAMPION_STATS, TEAMS, TEAM_PROFILES, teamBySlug } from "@/lib/data";
import { predict } from "@/lib/prediction";
import { TRIAL_DAYS } from "@/lib/plans";
import { snippet } from "@/lib/snippets";

const topRated = [...TEAMS].sort((x, y) => y.rating - x.rating).slice(0, 5);
const showcase = predict(teamBySlug("gen-g"), teamBySlug("t1"), 5);
const topChampion = CHAMPION_STATS.champions[0];
const lplProfile = TEAM_PROFILES.find((p) => p.estimated.length > 0)!;

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mx-auto mb-12 max-w-[760px] text-center md:mb-14">
      <Headline>{title}</Headline>
      <Reveal>
        <p className="subline t-md mt-4 md:mt-5">{sub}</p>
      </Reveal>
    </div>
  );
}

function FeatureCard({ title, text, children, delay }: { title: string; text: string; children: React.ReactNode; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="card card-lift flex h-full flex-col">
        <div className="aspect-[1.08] overflow-hidden rounded-[20px]">{children}</div>
        <div className="px-4 pt-5 pb-5">
          <h3 className="t-h6">{title}</h3>
          <p className="t-sm mt-2 text-gray-2">{text}</p>
        </div>
      </article>
    </Reveal>
  );
}

function RatingsShot() {
  const max = topRated[0].rating;
  const min = 1800;
  return (
    <div className="flex h-full flex-col justify-center bg-gray-4 p-5">
      <div className="rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(53,99,240,0.08)]">
        <div className="t-xs mb-3 flex justify-between text-gray-2">
          <span>Team</span>
          <span>Rating</span>
        </div>
        <ul className="flex flex-col gap-3">
          {topRated.map((t, i) => (
            <li key={t.slug} className="flex items-center gap-3">
              <span className="t-xs w-3 text-gray-3 tabular-nums">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="t-sm truncate font-semibold">{t.name}</span>
                  <span className="t-sm text-gray-2 tabular-nums">{Math.round(t.rating)}</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-gray-4">
                  <div className="h-full rounded-full bg-secondary/80" style={{ width: `${((t.rating - min) / (max - min)) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PredictionShot() {
  const pa = Math.round(showcase.series * 100);
  return (
    <div className="flex h-full flex-col justify-between bg-primary p-6 text-white">
      <span className="t-xs w-fit rounded-full bg-white/15 px-2.5 py-1">BO5 · Fearless</span>
      <div>
        <div className="text-[84px] leading-none font-semibold tracking-[-0.05em] tabular-nums">{pa}%</div>
        <div className="t-sm mt-3 text-white/80">Gen.G over T1</div>
        <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/20">
          <div className="rounded-full bg-white" style={{ width: `${pa}%` }} />
        </div>
      </div>
    </div>
  );
}

function ChampionShot() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#e4e9ff_100%)] p-6 text-center">
      <div className="text-[96px] leading-none font-semibold tracking-[-0.05em] text-secondary tabular-nums">
        {Math.round(topChampion.presence * 100)}%
      </div>
      <div className="t-sm mt-4 text-gray-2">
        {topChampion.champion} presence · {CHAMPION_STATS.league} {CHAMPION_STATS.patch}
      </div>
    </div>
  );
}

function ProfileShot() {
  const rows = [
    { label: "Gold diff @15", value: `+${lplProfile.gold_diff_15}`, est: lplProfile.estimated.includes("gold_diff_15") },
    { label: "XP diff @15", value: `+${lplProfile.xp_diff_15}`, est: lplProfile.estimated.includes("xp_diff_15") },
    { label: "First dragon", value: `${Math.round(lplProfile.first_dragon_rate! * 100)}%`, est: false },
    { label: "First tower", value: `${Math.round(lplProfile.first_tower_rate! * 100)}%`, est: false },
  ];
  return (
    <div className="rounded-2xl bg-dark p-4 ring-1 ring-white/8">
      <div className="mb-4 flex items-center justify-between">
        <span className="t-sm font-semibold text-white">{lplProfile.team_name}</span>
        <span className="t-xs text-gray-3">
          {lplProfile.league} · {lplProfile.period}
        </span>
      </div>
      <ul className="flex flex-col divide-y divide-white/8">
        {rows.map((r) => (
          <li key={r.label} className="t-sm flex items-center justify-between py-2.5">
            <span className="text-gray-3">{r.label}</span>
            <span className="flex items-center gap-2 text-white tabular-nums">
              {r.est && <span className="t-xs rounded-full bg-[#f5b53d]/15 px-2 py-0.5 text-[#f5c46b]">estimated</span>}
              {r.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EndpointsShot() {
  const endpoints = ["/ratings", "/predictions", "/champions", "/teams/{team}/profile"];
  return (
    <div className="rounded-2xl bg-dark p-4 ring-1 ring-white/8">
      <div className="t-xs mb-3 font-mono text-gray-3">Authorization: Bearer ebh_live_••••4f2a</div>
      <ul className="flex flex-col gap-2">
        {endpoints.map((e) => (
          <li key={e} className="flex items-center gap-3 rounded-xl bg-white/4 px-3 py-2.5">
            <span className="rounded-md bg-[#22c55e]/15 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[#4ade80]">GET</span>
            <span className="truncate font-mono text-[13px] text-white">{e}</span>
            <span className="ml-auto font-mono text-[12px] text-gray-3">200</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const ICON_FEATURES = [
  {
    title: "Updated every match day",
    text: "New games land in Ratings and stats the same day.",
    icon: <path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8l1-5.5z" fill="#f5c046" />,
  },
  {
    title: "50+ leagues since 2020",
    text: "From LCK and LPL to academy leagues and Worlds.",
    icon: (
      <g stroke="#7f9cff" strokeWidth="1.3" fill="none">
        <circle cx="8" cy="8" r="6" />
        <path d="M2 8h12M8 2c1.8 1.7 2.6 3.7 2.6 6S9.8 12.3 8 14M8 2C6.2 3.7 5.4 5.7 5.4 8s.8 4.3 2.6 6" />
      </g>
    ),
  },
  {
    title: "Python, R, JS and cURL",
    text: "Copy a working snippet with your key already filled in.",
    icon: <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  },
];

function KeyShot() {
  return (
    <div className="frame mx-auto max-w-[920px] text-left">
      <div className="rounded-[16px] bg-white p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="t-xs text-gray-2">Your API key</div>
            <div className="mt-1 font-mono text-[15px] text-dark md:text-[17px]">ebh_live_7Qm2xVtA9kLp3RzWc8NdYf4f2a</div>
          </div>
          <span className="t-sm inline-flex h-9 items-center rounded-full bg-gray-4 px-4">Copy</span>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl bg-code">
          <div className="flex gap-1 border-b border-white/8 px-3 py-2">
            {["Python", "R", "JavaScript", "cURL"].map((l, i) => (
              <span key={l} className={`rounded-full px-3 py-1.5 text-[13px] ${i === 0 ? "bg-white/10 text-white" : "text-gray-3"}`}>
                {l}
              </span>
            ))}
          </div>
          <CodePane code={snippet("python", "/ratings", { league: "LCK" }, "ebh_live_7Qm2…4f2a")} className="p-5" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SiteShell>
      <HeroPhoto>
        <section className="container-page relative pt-16 pb-[min(34vw,360px)] text-center md:pt-24">
          <Reveal>
            <a href="#product" className="t-sm inline-flex items-center gap-2.5 rounded-full bg-white p-1 pr-4 shadow-[var(--ring)]">
              <span className="rounded-full bg-dark px-2.5 py-1 text-white">New</span>
              League of Legends esports is live
            </a>
          </Reveal>
          <Headline as="h1" className="t-hero mx-auto mt-5 max-w-[900px]">
            Pro play, quantified.
          </Headline>
          <Reveal delay={120}>
            <p className="subline t-lg mt-5">Ratings, predictions and draft stats for League of Legends esports.</p>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/signup?plan=pro" arrow>
                Start {TRIAL_DAYS}-day trial
              </ButtonLink>
              <ButtonLink href="/docs#playground" variant="ghost">
                Try the playground
              </ButtonLink>
            </div>
          </Reveal>
        </section>
      </HeroPhoto>

      {/* Toolkit */}
      <section id="product" className="container-page section-y scroll-mt-16">
        <SectionHeader title="Everything an analyst needs" sub="Derived from 75,000+ pro games since 2020." />
        <div className="mx-auto grid max-w-[1080px] gap-5 md:grid-cols-3">
          <FeatureCard title="Ratings for every team" text="Strength and uncertainty per Team, adjusted for region." delay={0}>
            <RatingsShot />
          </FeatureCard>
          <FeatureCard title="Any matchup, on demand" text="Win probabilities for BO1, BO3 and BO5, Fearless included." delay={80}>
            <PredictionShot />
          </FeatureCard>
          <FeatureCard title="Draft stats per patch" text="Pick, ban and win rates per champion, patch and league." delay={160}>
            <ChampionShot />
          </FeatureCard>
        </div>
      </section>

      {/* Dark feature block */}
      <section className="px-3 md:px-5">
        <GrowBlock className="mx-auto max-w-[1160px] rounded-[32px] bg-dark">
          <div className="mx-auto max-w-[1000px] px-5 py-20 md:px-10 md:py-28">
            <div className="mx-auto mb-12 max-w-[640px] text-center md:mb-14">
              <Headline className="t-h2 text-white">Go deeper than the scoreboard</Headline>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { title: "Team Profiles", text: "Early-game and objective tendencies, with estimates clearly flagged.", shot: <ProfileShot /> },
                { title: "One key, every endpoint", text: "A single API key unlocks every product you subscribe to.", shot: <EndpointsShot /> },
              ].map((c, i) => (
                <Reveal key={c.title} delay={i * 80}>
                  <article className="h-full rounded-[24px] bg-gray-1 p-1 ring-2 ring-white/6">
                    <div className="rounded-[20px] bg-[#1b1b1d] p-4 md:p-5">{c.shot}</div>
                    <div className="px-4 pt-5 pb-5">
                      <h3 className="t-h6 text-white">{c.title}</h3>
                      <p className="t-sm mt-2 text-gray-3">{c.text}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
              {ICON_FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <div className="grid size-8 place-items-center rounded-lg bg-gray-1 ring-1 ring-white/8">
                    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                      {f.icon}
                    </svg>
                  </div>
                  <h3 className="t-h6 mt-4 text-white">{f.title}</h3>
                  <p className="t-sm mt-2 text-gray-3">{f.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </GrowBlock>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container-page section-y scroll-mt-16">
        <SectionHeader title="Simple, monthly pricing" sub={`Every plan starts with a ${TRIAL_DAYS}-day free trial.`} />
        <PricingCards />
      </section>

      {/* Final CTA */}
      <section className="wash overflow-hidden pt-20 md:pt-28">
        <div className="container-page text-center">
          <Headline className="t-h2 mx-auto max-w-[640px]">Your API key is two minutes away</Headline>
          <Reveal>
            <p className="subline t-md mt-4">Sign up, start your trial, paste the snippet.</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-7 flex justify-center">
              <ButtonLink href="/signup?plan=pro">Get started</ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={180} className="mt-14 -mb-24 md:mt-16 md:-mb-20">
            <KeyShot />
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
