import { useEffect } from 'react';
import { CATCHES } from './catches-data.js';
import { fishBlue } from './sprites.js';

// ── PixelGlyph — inline SVG renderer for pixel art ──────────────────────
// Reads the same { palette, pixels[] } shape as sprites.js so any sprite
// can be dropped in directly.

function PixelGlyph({ glyph, scale = 4, ariaLabel, className, style }) {
  if (!glyph || !glyph.pixels) return null;
  const { palette, pixels } = glyph;
  const h = pixels.length;
  const w = pixels[0].length;
  const rects = [];
  for (let r = 0; r < h; r++) {
    const row = pixels[r];
    for (let c = 0; c < row.length; c++) {
      const ch = row[c];
      const color = palette[ch];
      if (!color) continue;
      rects.push(
        <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={color} />
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * scale}
      height={h * scale}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      className={className}
      style={{ shapeRendering: 'crispEdges', display: 'block', ...style }}>
      {rects}
    </svg>
  );
}

// Hockey puck, side view. Solid black cylinder with a top sheen and a
// faint shadow on the ice underneath. Trademark-free.
const glyphPuck = {
  palette: {
    '.': null,
    o: '#050505',  // outline (near-black)
    p: '#1a1a1a',  // puck body
    P: '#3a3a3a',  // top sheen highlight
    s: '#1a2438',  // shadow on the ice
  },
  pixels: [
    '................',
    '...oooooooooo...',
    '..oPPPPPPPPPPo..',
    '.oppppppppppppo.',
    'oppppppppppppppo',
    'oppppppppppppppo',
    'oppppppppppppppo',
    '.oppppppppppppo.',
    '..oooooooooooo..',
    '...ssssssssss...',
  ],
};

const glyphController = {
  palette: {
    '.': null, o: '#0a0a0a', g: '#3a3a44', G: '#5a5a66', D: '#0a0a0a',
    y: '#f4d048', b: '#4a7fc0', r: '#c44d3a', e: '#3aa84a',
  },
  pixels: [
    '....oooooooooooo....',
    '..ooggggggggggggoo..',
    '.oggGggggggggGgGggo.',
    'oggDDDggggggggyggggo',
    'oggDgDgggggggbgrgggo',
    'oggDDDggggggggegggGo',
    'oggGgGgggggggggggGgo',
    '.oggGggGOggOGggggGgo',
    '..ooggggggggggggggo.',
    '....oooooooooooo....',
  ],
};

// ── Layout helpers ──────────────────────────────────────────────────────

function ZineSection({ number, eyebrow, title, children, id }) {
  return (
    <section className="zine-section" id={id}>
      <header className="zine-section-head">
        <div className="zine-section-tag">
          <span className="zine-section-number">{number}</span>
        </div>
        <div className="zine-section-eyebrow">{eyebrow}</div>
        <h2 className="zine-section-title">{title}</h2>
      </header>
      <div className="zine-section-body">{children}</div>
    </section>
  );
}

// JobCard renders a company block. For a single role, pass `role` + `span`.
// For a promotion / multi-role stint, pass `positions: [{ role, span, current? }]`
// — newest first — and the card draws a LinkedIn-style timeline so the
// promotion is visible at a glance.
function JobCard({ company, companyHref, role, span, location, positions, summary, bullets }) {
  const items = positions || [{ role, span, current: true }];
  const showTimeline = items.length > 1;

  const companyEl = companyHref ? (
    <a href={companyHref} target="_blank" rel="noreferrer" className="zine-link">
      {company}<span className="zine-link-arrow" aria-hidden="true">↗</span>
    </a>
  ) : company;

  return (
    <article className="zine-job">
      <header className="zine-job-head">
        <div className="zine-job-company">{companyEl}</div>
        {!showTimeline && (
          <>
            <div className="zine-job-role">{items[0].role}</div>
            <div className="zine-job-span">
              <span>{items[0].span}</span>
              {location && <span className="zine-job-loc"> · {location}</span>}
            </div>
          </>
        )}
        {showTimeline && location && (
          <div className="zine-job-location">{location}</div>
        )}
      </header>

      {summary && <p className="zine-job-summary">{summary}</p>}

      {showTimeline && (
        <ol className="zine-timeline">
          {items.map((p, i) => (
            <li
              key={i}
              className={`zine-timeline-item ${p.current ? 'is-current' : ''}`}>
              <div className="zine-timeline-marker" aria-hidden="true" />
              <div className="zine-timeline-content">
                <div className="zine-timeline-role">{p.role}</div>
                <div className="zine-timeline-span">{p.span}</div>
              </div>
            </li>
          ))}
        </ol>
      )}
      {bullets && bullets.length > 0 && (
        <ul className="zine-job-bullets">
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </article>
  );
}

function InterestRow({ glyph, title, children }) {
  return (
    <div className="zine-interest">
      <div className="zine-interest-glyph">
        {glyph ? <PixelGlyph glyph={glyph} scale={5} /> : null}
      </div>
      <div className="zine-interest-text">
        <h3 className="zine-interest-title">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function SkillsGroups() {
  const skills = CATCHES.find((c) => c.id === 'skills');
  const groups = (skills && skills.groups) || [];
  return (
    <div className="zine-skills">
      {groups.map((g, i) => (
        <div key={i} className="zine-skill-group">
          <div className="zine-skill-label">{g.label}</div>
          <div className="zine-skill-chips">
            {g.items.map((it, j) => (
              <span key={j} className="zine-chip">{it}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ContactGrid() {
  const items = [
    { kind: 'email',    label: 'email',    value: 'austinwestbury@live.com',          href: 'mailto:austinwestbury@live.com' },
    { kind: 'github',   label: 'github',   value: 'github.com/TrueAndTrue',           href: 'https://github.com/TrueAndTrue',    external: true },
    { kind: 'linkedin', label: 'linkedin', value: 'linkedin.com/in/austin-westbury',  href: 'https://linkedin.com/in/austin-westbury', external: true },
    { kind: 'phone',    label: 'phone',    value: '(613) 539-6695',                   href: 'tel:+16135396695' },
  ];
  const iconFor = (k) => ({ email: '✉', github: '◆', linkedin: 'in', phone: '☏' })[k] || '·';
  return (
    <div className="zine-contact">
      {items.map((it) => (
        <a key={it.label}
           className={`zine-contact-card zine-contact--${it.kind}`}
           href={it.href}
           target={it.external ? '_blank' : undefined}
           rel={it.external ? 'noreferrer' : undefined}>
          <div className="zine-contact-icon">{iconFor(it.kind)}</div>
          <div className="zine-contact-text">
            <div className="zine-contact-label">{it.label}</div>
            <div className="zine-contact-value">{it.value}</div>
          </div>
          <div className="zine-contact-arrow" aria-hidden="true">→</div>
        </a>
      ))}
    </div>
  );
}

// When `standalone` is true, this page IS the site (no lake behind it),
// so we hide the "back to the lake" affordances and skip the modal
// semantics. Used on mobile / undersized viewports.
export default function About({ open, onClose, standalone = false }) {
  useEffect(() => {
    if (!open || standalone) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, standalone]);

  if (!open) return null;

  return (
    <div
      className={`zine-overlay ${standalone ? 'is-standalone' : ''}`}
      role={standalone ? undefined : 'dialog'}
      aria-modal={standalone ? undefined : 'true'}
      aria-labelledby="zine-title">
      <header className="zine-bar">
        {!standalone ? (
          <button className="zine-back" onClick={onClose}>
            <span className="zine-back-arrow" aria-hidden="true">←</span>
            <span>back to the lake</span>
          </button>
        ) : <div />}
        <div className="zine-bar-mid">austin westbury · about</div>
        <div className="zine-bar-end">
          <a href="/uploads/Austin-Westbury-Resume.pdf" download className="zine-bar-pdf">
            resume.pdf <span aria-hidden="true">↓</span>
          </a>
        </div>
      </header>

      <article className="zine">
        <header className="zine-hero">
          <h1 id="zine-title" className="zine-title">
            Hi, I'm Austin.
          </h1>
          <p className="zine-lede">
            Senior Software Engineer based in Ontario, Canada. 5+ years building distributed systems that don't catch fire at 2am, and the occasional NHL stats database for fun.
          </p>
          <p className="zine-lede zine-lede-secondary">
            Deeply product-minded, I care as much about the business impact of what we ship as the craft that goes into shipping it. I'll happily kill a feature when it isn't pulling its weight. Scoping the architecture for a hard problem is one of my favorite parts of the job. AI-augmented dev workflows are deep in my hotkeys these days, and I've put real work into helping teammates do the same without writing slop.
          </p>
        </header>

        <ZineSection number="01" eyebrow="The work" title="What I'm shipping" id="work">
          <JobCard
            company="Live Summer"
            companyHref="https://summeros.com"
            location="New York, USA · remote"
            positions={[
              { role: 'Senior Software Engineer', span: 'Jun 2025 — present', current: true },
              { role: 'Software Engineer',        span: 'Nov 2022 — Jun 2025' },
            ]}
            summary="Property-management platform for short-term rentals. Reservations, properties, automation, financials — the plumbing that keeps a host's calendar from catching fire at 2am."
            bullets={[
              "Architected an event-driven webhook system processing millions of events daily on AWS Lambda, SQS, and EventBridge.",
              "Cut infrastructure costs 40%+ by tuning serverless compute, queue throughput, and Postgres query plans.",
              "Designed the Node.js backend and Postgres schemas with Prisma — type-safe data access end to end.",
              "Drove team-wide adoption of Claude Code. Onboarded every engineer, set guardrails, measured the velocity lift.",
              "Led architecture and technical direction. Mentored through code review, pairing, and design docs.",
            ]}
          />
          <JobCard
            company="RugBurn LLC"
            role="Software Engineer · leading 3 engineers"
            span="Jul 2021 — May 2022"
            location="San Diego, USA"
            summary="Analytical tooling on top of Ethereum — wallet behaviour, token flows. The kind of forensics that's now table stakes but back then was held together with The Graph and grit."
            bullets={[
              "Shipped an NFT marketplace, minting contracts, and a governance DApp on Ethereum mainnet.",
              "Coordinated three engineers across overlapping product launches. My first real taste of running multiple tracks instead of just shipping my own work.",
            ]}
          />
        </ZineSection>

        <ZineSection number="02" eyebrow="Built for the love of it" title="Side projects" id="projects">
          <article className="zine-project">
            <header className="zine-project-head">
              <div className="zine-project-name">
                <a href="https://anhls.com" target="_blank" rel="noreferrer" className="zine-link">
                  ANHLS<span className="zine-link-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="zine-project-subtitle">NHL analytics platform · solo · ongoing</div>
            </header>
            <p className="zine-para">
              I love hockey almost as much as I love fishing, and the mainstream stats sites all show me the same boring leaderboards. ANHLS queries <strong>6M+ rows</strong> of play-by-play data to answer the weird questions instead. For example, which defenseman is quietly carrying their D-pair on entries, what a goalie's GSAx looks like against high-danger chances <em>only on the road</em>, that kind of thing.
            </p>
            <p className="zine-para">
              Solo project. Design, data pipeline, frontend, deploy, the whole thing. It's the project that proves to me the "boring data plumbing" skills from work scale beautifully to nerdy passion projects.
            </p>
            <dl className="zine-project-meta">
              <div><dt>Stack</dt><dd>Svelte · Postgres · Python ETL</dd></div>
              <div><dt>Scale</dt><dd>6,000,000+ rows · sub-100ms queries</dd></div>
              <div><dt>Audience</dt><dd>me, mostly · also Habs Twitter</dd></div>
            </dl>
          </article>
          <p className="zine-aside">
            A few smaller toys live on <a href="https://github.com/TrueAndTrue" target="_blank" rel="noreferrer">github.com/TrueAndTrue</a> if you want to poke around.
          </p>
        </ZineSection>

        <ZineSection number="03" eyebrow="The tackle box" title="What I actually reach for" id="skills">
          <p className="zine-para">
            I try to pick the boring obvious tool first and only reach for the exotic one when the boring tool stops paying rent. Most of my career has been Node + Postgres + a serverless cloud with a little mix of python, and that's been more than enough to ship the hard things.
          </p>
          <SkillsGroups />
        </ZineSection>

        <ZineSection number="04" eyebrow="When I'm not at the keyboard" title="The other stuff" id="life">
          <InterestRow glyph={fishBlue} title="Fishing">
            <p>
              Whenever the lake lets me. Mostly bass, smallies in particular, on jerkbaits and bottom-bouncers depending on the season. Best one I've caught was a nine-pound smallmouth at dusk on a lake I won't name. Ask me in person.
            </p>
            <p>
              If you've made it this far through a fishing-themed portfolio, you can probably guess this part already.
            </p>
          </InterestRow>
          <InterestRow glyph={glyphPuck} title="Habs til I die">
            <p>
              Born into it. Watching the Canadiens lose with the same dignity every season is its own kind of meditation. <em>Sainte flanelle</em>, bleu-blanc-rouge, the whole deal.
            </p>
            <p>
              The best part of building ANHLS was finally being able to argue on the internet with actual numbers instead of vibes. It hasn't fixed the team but it has fixed a few of my arguments.
            </p>
          </InterestRow>
          <InterestRow glyph={glyphController} title="Games">
            <p>
              Currently rotating: Sid Meier's Civ 7, Terraria, and Slay the Spire 2. Less competitive multiplayer than I used to be, now it's just a way to unwind.
            </p>
          </InterestRow>
        </ZineSection>

        <ZineSection number="05" eyebrow="Say hi" title="Get in touch" id="contact">
          <p className="zine-para">
            Best way to reach me is email. I read everything, even cold ones. GitHub is where the open code lives. LinkedIn for the formal stuff. If you'd rather have the whole thing on one printable page, the resume PDF is in the top right.
          </p>
          <ContactGrid />
          <div className="zine-cta-row">
            <a href="/uploads/Austin-Westbury-Resume.pdf" download className="zine-cta zine-cta--primary">
              <span className="zine-cta-icon">↓</span>
              <span>Download resume.pdf</span>
            </a>
            {!standalone && (
              <button className="zine-cta zine-cta--secondary" onClick={onClose}>
                <span>or go back to the lake</span>
                <span className="zine-cta-icon">→</span>
              </button>
            )}
          </div>
        </ZineSection>

        <footer className="zine-foot">
          <div className="zine-foot-row">
            <span className="zine-foot-name">austin westbury</span>
            <span className="zine-foot-sep">·</span>
            <span>ontario, canada</span>
            <span className="zine-foot-sep">·</span>
            <span>still casts</span>
          </div>
          <div className="zine-foot-credit">
            made with too much coffee · pixel art by hand
          </div>
        </footer>
      </article>
    </div>
  );
}
