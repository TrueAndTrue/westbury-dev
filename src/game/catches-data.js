// One per lantern. Single source of truth for resume content + slot positions.

export const CATCHES = [
  {
    id: 'experience',
    kind: 'experience',
    shortLabel: 'Experience',
    subLabel: '4+ years · 2 companies',
    icon: '⚙',
    glow: '#ffe890',
    rarity: 'common',
    slot: { x: 45, y: 84 },
    title: "Where I've worked",
    eyebrow: 'The professional history',
    body: [
      "Two stops so far. The throughline is event-driven systems, type-safe data access, and small high-trust teams.",
    ],
    jobs: [
      {
        company: 'Live Summer',
        companyHref: 'https://summeros.com',
        location: 'New York, USA · remote',
        positions: [
          { role: 'Senior Software Engineer', span: 'Jun 2025 to present', current: true },
          { role: 'Software Engineer',        span: 'Nov 2022 to Jun 2025' },
        ],
        summary: "Property-management platform for short-term rental and hospitality operators. Reservations, guest comms, automation, payouts. The plumbing that keeps a host's calendar from catching fire at 2am.",
        bullets: [
          "Architected an event-driven webhook system processing millions of events daily on AWS Lambda, SQS, and EventBridge.",
          "Cut infrastructure costs 40%+ by tuning serverless compute, queue throughput, and Postgres query plans.",
          "Designed the Node.js backend and Postgres schemas with Prisma, for type-safe data access end to end.",
          "Drove team-wide adoption of Claude Code. Onboarded every engineer, set guardrails, measured the velocity lift.",
          "Lead architecture and technical direction. Mentor through code review, pairing, and design docs.",
        ],
        stack: 'Node.js · TypeScript · Postgres · Prisma · AWS',
      },
      {
        company: 'RugBurn LLC',
        location: 'San Diego, USA',
        positions: [
          { role: 'Software Engineer · leading 3 engineers', span: 'Jul 2021 to May 2022', current: false },
        ],
        summary: "Analytical tooling on top of Ethereum, focused on wallet behaviour and token flows. The kind of forensics that's now table stakes but back then was held together with The Graph and grit.",
        bullets: [
          "Shipped an NFT marketplace, minting contracts, and a governance DApp on Ethereum mainnet.",
          "Coordinated three engineers across concurrent launches; learned to write smaller PRs and bigger design docs.",
        ],
        stack: 'React · Solidity · Ethers · The Graph',
      },
    ],
  },
  {
    id: 'anhls',
    kind: 'project',
    shortLabel: 'ANHLS',
    subLabel: 'NHL analytics · side project',
    icon: '★',
    glow: '#b8f0c8',
    rarity: 'uncommon',
    slot: { x: 22, y: 118 },
    title: 'ANHLS: NHL analytics',
    eyebrow: 'Side project · ongoing',
    body: [
      "I love hockey almost as much as I love fishing, and mainstream stats sites all show me the same boring leaderboards. ANHLS (advanced NHL stats) queries 6M+ rows of play-by-play data so I can answer the weird questions instead. For example, how many times a single skater has shot on (or scored against) a specific goalie across their careers, or pulling up players all the way back to the 1910s.",
      "Built it solo. It's the project that proves to me that 'boring data plumbing' skills from work scale beautifully to nerdy passion projects.",
    ],
    bullets: [
      "6M+ rows of play-by-play, queried in milliseconds.",
      "Surfaces stats and splits that the mainstream platforms don't expose.",
      "Solo project: design, data pipeline, frontend, deploy.",
    ],
    meta: [
      { label: 'Stack', value: 'Svelte · Postgres · Python ETL' },
      { label: 'Rows', value: '6,000,000+' },
    ],
  },
  {
    id: 'skills',
    kind: 'skills',
    shortLabel: 'The Tackle Box',
    subLabel: 'Languages, cloud, data',
    icon: '⚡',
    glow: '#f8d878',
    rarity: 'common',
    slot: { x: 88, y: 130 },
    title: 'The Tackle Box',
    eyebrow: 'What I actually use',
    body: [
      "I try to pick the boring obvious tool first and only reach for the exotic one when the boring tool stops paying rent. Most of my career has been Node + Postgres + a serverless cloud with a little mix of python, and that's been more than enough to ship the hard things.",
    ],
    groups: [
      {
        label: 'Languages & frameworks',
        items: ['TypeScript', 'JavaScript', 'Python', 'Node.js', 'React', 'React Native', 'Next.js', 'NestJS', 'Django'],
      },
      {
        label: 'Cloud & infra',
        items: ['AWS Lambda', 'SQS', 'SNS', 'S3', 'EventBridge', 'API Gateway', 'RDS', 'Serverless', 'Event-driven', 'Microservices'],
      },
      {
        label: 'Data & APIs',
        items: ['PostgreSQL', 'MongoDB', 'Prisma', 'TypeORM', 'GraphQL', 'REST', 'WebSockets'],
      },
      {
        label: 'Practices & tools',
        items: ['Git', 'CI/CD', 'Docker', 'Jest', 'Cypress', 'TailwindCSS', 'Redux', 'Agile/Scrum', 'Claude Code'],
      },
    ],
  },
  {
    id: 'about',
    kind: 'about',
    shortLabel: 'About me',
    subLabel: '(the actual person)',
    icon: '♥',
    glow: '#ffb0c4',
    rarity: 'common',
    slot: { x: 200, y: 78 },
    title: "Hi, I'm Austin.",
    eyebrow: 'Ontario, Canada',
    body: [
      "Senior Software Engineer, 5+ years building distributed systems that don't catch fire at 2am. Scoping the architecture for a hard problem is one of my favorite parts of the job. I care as much about the business impact of what we ship as the craft that goes into shipping it.",
      "Product-minded. I'd rather kill a feature than ship something that confuses the user. I run AI-augmented workflows day-to-day (Claude Code is in my hotkeys), and I've put real work into helping teammates do the same without writing slop.",
      "Off the keyboard: I fish whenever the lake lets me. I game (currently rotating: Sid Meier's Civ 7, Terraria, and Slay the Spire 2).",
    ],
    meta: [
      { label: 'Based', value: 'Ontario, Canada' },
      { label: 'Pronouns', value: 'he/him' },
      { label: 'Open to', value: 'Senior SWE/cloud roles, mostly remote' },
    ],
  },
  {
    id: 'contact',
    kind: 'contact',
    shortLabel: 'Contact',
    subLabel: 'email · github · linkedin',
    icon: '✉',
    glow: '#a8c8f8',
    rarity: 'common',
    slot: { x: 178, y: 102 },
    title: "Let's talk.",
    eyebrow: 'I read everything',
    body: [
      "Best way to reach me is email. I read everything that lands, even cold ones. GitHub is where the open code lives. LinkedIn for the formal stuff.",
    ],
    actions: [
      { label: 'austinwestbury@live.com', href: 'mailto:austinwestbury@live.com', kind: 'email' },
      { label: 'github.com/TrueAndTrue', href: 'https://github.com/TrueAndTrue', kind: 'github' },
      { label: 'linkedin.com/in/austin-westbury', href: 'https://linkedin.com/in/austin-westbury', kind: 'linkedin' },
      { label: '(613) 539-6695', href: 'tel:+16135396695', kind: 'phone' },
    ],
  },
  {
    id: 'resume',
    kind: 'resume',
    shortLabel: 'resume.pdf',
    subLabel: 'the whole thing on one page',
    icon: '▤',
    glow: '#fff4c0',
    rarity: 'common',
    slot: { x: 215, y: 128 },
    title: 'Resume (one page, no surprises)',
    eyebrow: 'PDF · 85kb',
    body: [
      "If you'd rather have the whole thing in front of you on one page, here it is. Same content as the lanterns, sorted into a normal recruiter-friendly layout.",
    ],
    actions: [
      { label: 'Download resume.pdf', href: '/uploads/Austin-Westbury-Resume.pdf', kind: 'download' },
      { label: 'Open in new tab', href: '/uploads/Austin-Westbury-Resume.pdf', kind: 'external' },
    ],
  },
  {
    id: 'rare',
    kind: 'rare',
    shortLabel: '???',
    subLabel: 'a rare catch',
    icon: '✦',
    glow: '#d4a8ff',
    rarity: 'rare',
    slot: { x: 120, y: 108 },
    title: 'The Hat-Trick',
    eyebrow: 'Legendary catch · the last lantern',
    body: [
      "You found the rare one. Three quick things about me that don't fit anywhere else on a resume:",
      "① Once woke up at 2am with the answer to an architecture problem my team had been stuck on for a week. Sketched it out on my phone before going back to sleep, shipped it three days later. Sometimes I need to remind my brain to clock out haha.",
      "② Best fish I've ever caught was a 9-pound smallmouth on a spinner at a lake I won't name. (Ask me in person.)",
      "③ I will absolutely talk about how Claude Code changed the way I review my own work. It's not just autocomplete, it's completely shifted what matters for an engineer in the past few years.",
    ],
  },
];

// Award order — the story arc. About first (meet me), experience second
// (what I do for work), anhls (what I build for love), skills (the tools),
// contact (let's talk), resume (formal version), rare last (easter egg
// guaranteed after all others are caught).
export const CATCH_AWARD_ORDER = [
  'about', 'experience', 'anhls', 'skills', 'contact', 'resume', 'rare',
];
