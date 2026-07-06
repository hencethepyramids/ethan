// Project / case-study data. Mirrors the posts shape so it can later be served
// from the API the same way the blog is.

export const PROJECTS = [
  {
    slug: 'agent-orchestrator',
    n: '01',
    title: 'Agent Orchestrator',
    cat: 'AI',
    year: '2026',
    tagline: 'A multi-agent system that routes tools, memory, and guardrails on Azure OpenAI.',
    role: 'Design & engineering',
    stack: ['Azure OpenAI', 'C# / .NET', 'React', 'Redis'],
    body: [
      { type: 'p', text: 'Agent Orchestrator coordinates a set of specialized agents behind a single interface — routing each request to the right tools, sharing memory, and enforcing guardrails before anything reaches a user.' },
      { type: 'h', text: 'The problem' },
      { type: 'p', text: 'A single monolithic prompt could not handle the range of tasks reliably. Responses drifted, tools were misused, and there was no clean way to add capabilities without regressions.' },
      { type: 'h', text: 'The approach' },
      { type: 'p', text: 'I split the work into focused agents with explicit tool contracts, added a router that picks the right one, and wrapped everything in a validation layer that fails safely. Memory is shared through a typed store rather than stuffed into the prompt.' },
      { type: 'quote', text: 'Predictability beat raw capability every time. The boring infrastructure is what made it shippable.' },
    ],
  },
  {
    slug: 'realtime-platform',
    n: '02',
    title: 'Realtime Platform',
    cat: 'Full-stack',
    year: '2025',
    tagline: 'A collaborative product with live sync, role-based access, and an audit trail.',
    role: 'Full-stack engineering',
    stack: ['React', 'C# / .NET', 'PostgreSQL', 'SignalR'],
    body: [
      { type: 'p', text: 'A multi-user platform where everything updates live — presence, edits, and permissions — without the UI ever feeling out of sync.' },
      { type: 'h', text: 'Live without the chaos' },
      { type: 'p', text: 'Realtime is easy to demo and hard to make trustworthy. I modeled every loading, empty, and conflict state up front so the interface degrades gracefully when the connection or the data misbehaves.' },
      { type: 'quote', text: 'The frontend and the .NET services were treated as one system, with the API contract as a shared design artifact.' },
    ],
  },
  {
    slug: 'vuln-scanner',
    n: '03',
    title: 'Vuln Scanner',
    cat: 'Security',
    year: '2026',
    tagline: 'An automated scanning and reporting pipeline for internal services.',
    role: 'Security tooling',
    stack: ['Python', 'C# / .NET', 'Docker'],
    body: [
      { type: 'p', text: 'A pipeline that continuously scans internal services, triages findings, and produces reports that engineers will actually read.' },
      { type: 'h', text: 'Signal over noise' },
      { type: 'p', text: 'Most scanners drown teams in findings. The win here was ranking and deduplicating results so the report surfaces what matters and routes it to the right owner automatically.' },
      { type: 'quote', text: 'Thinking like an attacker made the defensive tooling sharper — and the other way around.' },
    ],
  },
  {
    slug: 'copilot-suite',
    n: '04',
    title: 'Copilot Suite',
    cat: 'AI',
    year: '2025',
    tagline: 'Custom copilots wired into real business workflows with Copilot Studio.',
    role: 'AI engineering',
    stack: ['Copilot Studio', 'Power Platform', 'Azure'],
    body: [
      { type: 'p', text: 'A set of productized copilots embedded directly in the tools a team already uses, grounded in their own data.' },
      { type: 'h', text: 'Grounded and governed' },
      { type: 'p', text: 'The hard part was not the model — it was retrieval quality, permissions, and making refusals feel like a clear product surface rather than a dead end.' },
    ],
  },
  {
    slug: 'api-gateway',
    n: '05',
    title: 'API Gateway',
    cat: 'Full-stack',
    year: '2025',
    tagline: 'A high-throughput service with end-to-end encryption and audit logging.',
    role: 'Backend engineering',
    stack: ['C# / .NET', 'PostgreSQL', 'Redis'],
    body: [
      { type: 'p', text: 'A gateway that fronts internal services with authentication, rate limiting, encryption, and a complete audit trail.' },
      { type: 'h', text: 'Fast and accountable' },
      { type: 'p', text: 'Throughput mattered, but so did being able to answer “who did what, when.” Every request is traceable without leaking sensitive data into the logs.' },
    ],
  },
]

export const getProject = (slug) => PROJECTS.find((p) => p.slug === slug)
