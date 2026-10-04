// Single source of truth for SEO / AEO / GEO data.
// Used at runtime by Schema.jsx and Services.jsx, and at build time by vite.config.js
// (JSON-LD + crawlable fallback injected into index.html). Keep this file plain JS (no JSX).

export const SITE_URL = 'https://www.creationbase.io';
export const SITE_NAME = 'Creationbase';
export const SHARE_IMAGE = `${SITE_URL}/images/socialshare.jpg?v=3`;

export const BUSINESS = {
  name: SITE_NAME,
  tagline: 'Brand + Web + Photo for Brave Companies',
  summary:
    'Creationbase is an independent creation studio in Boise, Idaho. We make brand identities, websites, and commercial photography for brave companies across the Treasure Valley and beyond.',
  email: 'forrest@creationbase.io',
  founder: 'Forrest Tindall',
  foundingDate: '2022',
  locality: 'Boise',
  region: 'ID',
  regionName: 'Idaho',
  country: 'US',
  // City-center coordinates for Boise, Idaho.
  geo: { latitude: 43.615, longitude: -116.2023 },
  areaServed: ['Boise', 'Meridian', 'Nampa', 'Eagle', 'Garden City', 'Caldwell', 'Kuna', 'Star'],
  sameAs: [
    'https://instagram.com/creationbase.io',
    'https://www.linkedin.com/company/creationbaseio/',
  ],
  services: [
    {
      name: 'Branding',
      description:
        'Brand identity design in Boise: logo and mark systems, typography and color, brand guidelines, templates, signage, and merch.',
    },
    {
      name: 'Website Design & Development',
      description:
        'Custom website design and development in Boise: UI/UX design, development and launch, ecommerce, and CMS setup.',
    },
    {
      name: 'Commercial Photography',
      description:
        'Commercial photography in Boise: product photography, brand and lifestyle shoots, portraits and team headshots, editing and retouching.',
    },
  ],
};

export const FAQ = [
  {
    q: 'Where is Creationbase located?',
    a: 'Creationbase is a creation studio based in Boise, Idaho. We work with companies across the Treasure Valley, including Boise, Meridian, Nampa, and Eagle, and with clients remotely across the United States.',
  },
  {
    q: 'What services does Creationbase offer?',
    a: 'Three services: branding (logos, brand identity, and guidelines), website design and development, and commercial photography (product, brand, and portrait photography).',
  },
  {
    q: 'Do you work with businesses outside of Boise?',
    a: 'Yes. We are based in Boise, Idaho and work in person with Treasure Valley businesses, and remotely with companies anywhere.',
  },
  {
    q: 'Can I hire Creationbase for just one service?',
    a: 'Yes. You can start with branding, a website, or photography on its own, or bring us all three so everything is designed as one system.',
  },
  {
    q: 'Do I own the final files?',
    a: 'Yes. You own every final file we deliver, along with guidelines your team can reuse after launch.',
  },
  {
    q: 'How do I start a project?',
    a: `Send a message through the contact form at ${SITE_URL}/contact with a few details about your brand, website, or photography project, and we will follow up with next steps.`,
  },
];

const HOME_META = {
  title: 'Creationbase — Boise Branding, Web Design & Photography Studio',
  description:
    'Creationbase is a creation studio in Boise, Idaho making brand identities, websites, and commercial photography for brave companies across the Treasure Valley and beyond.',
};

const CASE_STUDIES = {
  '/boise-analog-club': 'Boise Analog Club',
  '/knwnlocal': 'KnwnLocal',
  '/wim': 'WIM',
  '/continuity': 'Continuity',
  '/worksharp': 'Worksharp + Drill Doctor',
  '/open-netizen': 'Open Netizen',
  '/ricochet': 'Ricochet',
  '/micron': 'Micron',
};

const PAGE_META = {
  '/': HOME_META,
  '/services': {
    title: 'Services — Branding, Website Design & Photography in Boise | Creationbase',
    description:
      'Branding, website design and development, and commercial photography from one Boise, Idaho creation studio. Logos and brand guidelines, custom websites, and product and brand photography.',
  },
  '/about': {
    title: 'About — Independent Creation Studio in Boise, Idaho | Creationbase',
    description:
      'Creationbase is an independent creation studio in Boise, Idaho, founded in 2022. Meet the team behind our branding, website, and photography work.',
  },
  '/contact': {
    title: 'Contact — Start a Project | Creationbase, Boise, Idaho',
    description:
      'Start a branding, website, or photography project with Creationbase, a creation studio in Boise, Idaho.',
  },
  '/blog': {
    title: 'Blog — Branding, Web & Photography Insights | Creationbase',
    description:
      'Notes on branding, web design, and photography from Creationbase, a creation studio in Boise, Idaho.',
  },
  '/photography': {
    title: 'Commercial Photography in Boise, Idaho | Creationbase',
    description:
      'Product, brand, and portrait photography from Creationbase, a creation studio in Boise, Idaho.',
  },
  '/gallery': {
    title: 'Photography Gallery | Creationbase, Boise, Idaho',
    description:
      'A gallery of commercial, brand, and portrait photography by Creationbase, a creation studio in Boise, Idaho.',
  },
  '/playground': {
    title: 'Playground — Experiments | Creationbase',
    description:
      'Experiments in design, art, development, and image-making from Creationbase, a creation studio in Boise, Idaho.',
  },
  '/material-lab': {
    title: 'Material Lab | Creationbase',
    description:
      'Tools and experiments from Creationbase, a creation studio in Boise, Idaho.',
  },
};

export const canonicalFor = (path = '/') => {
  const clean = (path.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/';
  return clean === '/' ? `${SITE_URL}/` : `${SITE_URL}${clean}`;
};

export const metaForPath = (path = '/') => {
  const clean = (path.split(/[?#]/)[0] || '/').replace(/\/+$/, '') || '/';
  if (PAGE_META[clean]) return PAGE_META[clean];
  if (CASE_STUDIES[clean]) {
    const name = CASE_STUDIES[clean];
    return {
      title: `${name} Case Study | Creationbase, Boise, Idaho`,
      description: `${name}: brand, web, and photography work by Creationbase, a creation studio in Boise, Idaho.`,
    };
  }
  return HOME_META;
};

export const businessJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#business`,
      name: BUSINESS.name,
      slogan: BUSINESS.tagline,
      description: BUSINESS.summary,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      image: SHARE_IMAGE,
      email: BUSINESS.email,
      foundingDate: BUSINESS.foundingDate,
      founder: { '@type': 'Person', name: BUSINESS.founder },
      address: {
        '@type': 'PostalAddress',
        addressLocality: BUSINESS.locality,
        addressRegion: BUSINESS.region,
        addressCountry: BUSINESS.country,
      },
      geo: { '@type': 'GeoCoordinates', ...BUSINESS.geo },
      areaServed: [
        ...BUSINESS.areaServed.map((name) => ({ '@type': 'City', name: `${name}, ${BUSINESS.regionName}` })),
        { '@type': 'State', name: BUSINESS.regionName },
        { '@type': 'Country', name: 'United States' },
      ],
      knowsAbout: ['Branding', 'Brand identity design', 'Logo design', 'Website design', 'Web development', 'Commercial photography', 'Product photography'],
      sameAs: BUSINESS.sameAs,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Branding, Website, and Photography Services',
        itemListElement: BUSINESS.services.map((s) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: s.name, description: s.description, areaServed: { '@type': 'City', name: 'Boise, Idaho' } },
        })),
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: BUSINESS.name,
      publisher: { '@id': `${SITE_URL}/#business` },
    },
  ],
});

export const faqJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// Every client-side route that should exist as its own crawlable HTML file at build time.
export const STATIC_PATHS = [
  '/',
  '/services',
  '/about',
  '/contact',
  '/blog',
  '/photography',
  '/gallery',
  '/playground',
  '/material-lab',
  ...Object.keys(CASE_STUDIES),
];

const NAV_LINKS = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/about', 'About'],
  ['/photography', 'Photography'],
  ['/gallery', 'Gallery'],
  ['/blog', 'Blog'],
  ['/contact', 'Start a Project'],
];

// Plain-HTML content placed inside #root at build time. Crawlers that don't run JavaScript
// (many AI/answer engines) read this; React replaces it on mount. It mirrors the live page content.
// `page` = { heading, intro, bodyHtml, includeFaq }; `posts` = [{ slug, title }] for blog links.
export const crawlableFallbackHtml = (page = {}, posts = []) => {
  const heading = page.heading || `${BUSINESS.name}: ${BUSINESS.tagline}`;
  const intro = page.intro || BUSINESS.summary;
  const caseStudyLinks = Object.entries(CASE_STUDIES);
  return [
    '<!--seo-fallback-start--><div class="seo-fallback">',
    `<h1>${escapeHtml(heading)}</h1>`,
    `<p>${escapeHtml(intro)}</p>`,
    page.bodyHtml || '',
    `<p>${escapeHtml(BUSINESS.name)} is a creation studio located in ${escapeHtml(BUSINESS.locality)}, ${escapeHtml(BUSINESS.regionName)}, serving ${escapeHtml(BUSINESS.areaServed.join(', '))}, and clients remotely across the United States. Email: <a href="mailto:${BUSINESS.email}">${BUSINESS.email}</a></p>`,
    '<h2>Services</h2>',
    '<ul>',
    ...BUSINESS.services.map((s) => `<li><strong>${escapeHtml(s.name)}</strong>: ${escapeHtml(s.description)}</li>`),
    '</ul>',
    ...(page.includeFaq
      ? ['<h2>Frequently asked questions</h2>', ...FAQ.map(({ q, a }) => `<h3>${escapeHtml(q)}</h3><p>${escapeHtml(a)}</p>`)]
      : []),
    '<nav aria-label="Site">',
    ...NAV_LINKS.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`),
    '</nav>',
    '<nav aria-label="Work">',
    ...caseStudyLinks.map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`),
    '</nav>',
    ...(posts.length
      ? ['<nav aria-label="Blog">', ...posts.map((p) => `<a href="/blog/${p.slug}">${escapeHtml(p.title)}</a>`), '</nav>']
      : []),
    '</div><!--seo-fallback-end-->',
  ].join('\n');
};

export const escapeAttr = escapeHtml;

// /llms.txt (https://llmstxt.org): a plain-language summary for AI assistants and answer engines.
export const llmsTxt = (posts = []) => [
  `# ${BUSINESS.name}`,
  '',
  `> ${BUSINESS.summary}`,
  '',
  `${BUSINESS.name} is located in ${BUSINESS.locality}, ${BUSINESS.regionName}, United States, and serves ${BUSINESS.areaServed.join(', ')}, the rest of the Treasure Valley, and clients remotely across the United States. Founded in ${BUSINESS.foundingDate} by ${BUSINESS.founder}. Contact: ${BUSINESS.email}.`,
  '',
  '## Services',
  '',
  ...BUSINESS.services.map((s) => `- ${s.name}: ${s.description}`),
  '',
  '## Pages',
  '',
  `- [Services](${SITE_URL}/services): Branding, website design and development, and commercial photography.`,
  `- [About](${SITE_URL}/about): The studio and team.`,
  `- [Photography](${SITE_URL}/photography): Commercial photography work.`,
  `- [Start a Project](${SITE_URL}/contact): Contact form for new projects.`,
  '',
  '## Work',
  '',
  ...Object.entries(CASE_STUDIES).map(([href, name]) => `- [${name}](${SITE_URL}${href})`),
  '',
  '## FAQ',
  '',
  ...FAQ.flatMap(({ q, a }) => [`### ${q}`, '', a, '']),
  ...(posts.length ? ['## Blog', '', ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})`), ''] : []),
].join('\n');
