// Pulls a deep roster of company names (tech especially) from a few public
// sources, cleans the names down to what people actually call them, and writes
// src/data/sketches/companies.json.
//
// Usage: node src/scripts/fetch-companies.js
//
// Sources
//   Wikidata        https://query.wikidata.org (companies, plus anything with an industry
//                   and headquarters or a stock listing, with articles on 25+ Wikipedias)
//   SEC EDGAR       https://www.sec.gov/files/company_tickers.json (the 1,000 largest
//                   US-listed companies; the file is ordered by market cap)
//   Y Combinator    https://github.com/yc-oss/api (YC's top companies)
//   + a hand-picked list of well-known tech names the sources above miss or mislabel

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '../data/sketches/companies.json');
const UA = { 'User-Agent': 'arbourtrary-sketch/1.0 (https://arbourtrary.com)' };

const WIKIDATA = 'https://query.wikidata.org/sparql';
const SEC = 'https://www.sec.gov/files/company_tickers.json';
const YC = 'https://yc-oss.github.io/api/companies/all.json';

// business, enterprise, company, public company, software company, technology company, ...
const COMPANY_TYPES = ['Q4830453', 'Q6881511', 'Q783794', 'Q891723', 'Q1058914', 'Q18388277', 'Q210167', 'Q2085381'];
const MIN_SITELINKS = 25;  // articles on this many Wikipedias ≈ famous enough to have heard of
const TOP_PUBLIC = 1000;

const WIKIDATA_QUERIES = {
    // one query per type, so none of them time out
    ...Object.fromEntries(COMPANY_TYPES.map(q => [`wikidata-${q}`, `SELECT ?label ?links WHERE {
        ?item wdt:P31 wd:${q}; wikibase:sitelinks ?links. FILTER(?links >= ${MIN_SITELINKS})
        ?item rdfs:label ?label FILTER(lang(?label) = "en") }`])),
    // anything with an industry and a headquarters
    'wikidata-industry': `SELECT DISTINCT ?label ?links WHERE {
        ?item wdt:P452 []; wdt:P159 []; wikibase:sitelinks ?links. FILTER(?links >= ${MIN_SITELINKS})
        ?item rdfs:label ?label FILTER(lang(?label) = "en") }`,
    // anything on a stock exchange
    'wikidata-listed': `SELECT DISTINCT ?label ?links WHERE {
        ?item wdt:P414 []; wikibase:sitelinks ?links. FILTER(?links >= ${MIN_SITELINKS})
        ?item rdfs:label ?label FILTER(lang(?label) = "en") }`,
};

// Well-known tech companies that aren't (or aren't labeled as companies) above
const HAND_PICKED = [
    'Vercel', 'Netlify', 'Supabase', 'Linear', 'Retool', 'Replit', 'Railway', 'Render', 'Heroku',
    'DigitalOcean', 'Fastly', 'Cloudflare', 'Akamai', 'Okta', 'Auth0', 'Clerk', 'Prisma', 'Neon',
    'PlanetScale', 'Convex', 'Resend', 'Postmark', 'Mailchimp', 'Twilio', 'SendGrid', 'Algolia',
    'Elastic', 'Confluent', 'HashiCorp', 'GitLab', 'GitHub', 'JetBrains', 'Docker', 'Sentry', 'PostHog',
    'Segment', 'Amplitude', 'Mixpanel', 'Datadog', 'Snyk', 'Figma', 'Notion', 'Airtable', 'Zapier',
    'Loom', 'Miro', 'Canva', 'Calendly', 'Webflow', 'Framer', 'Raycast', 'Obsidian', 'Todoist',
    'Evernote', 'Trello', 'Asana', 'ClickUp', 'Basecamp', 'Grammarly', 'Superhuman', 'Substack',
    'Medium', 'Patreon', 'Kickstarter', 'Ghost', 'OpenAI', 'Anthropic', 'Mistral', 'Cohere',
    'Perplexity', 'Cursor', 'Anysphere', 'Groq', 'Cerebras', 'Midjourney', 'Runway', 'ElevenLabs',
    'Stripe', 'Ramp', 'Brex', 'Mercury', 'Plaid', 'Gusto', 'Rippling', 'Deel', 'Chime', 'Affirm',
    'Klarna', 'Revolut', 'Monzo', 'Wise', 'Nubank', 'Robinhood', 'Coinbase', 'SpaceX', 'Anduril',
    'Waymo', 'Cruise', 'Zoox', 'Nuro', 'Rivian', 'Lucid', 'Polestar', 'Discord', 'Telegram', 'Signal',
    'Tinder', 'Bumble', 'Hinge', 'Strava', 'Peloton', 'Whoop', 'Oura', 'Fitbit', 'Sonos', 'Roku',
    'Hulu', 'Twitch', 'Vimeo', 'Tumblr', 'Quora', 'Yelp', 'Reddit', 'Pinterest', 'Snapchat',
    'Instagram', 'WhatsApp', 'TikTok', 'YouTube', 'LinkedIn', 'Twitter', 'Spotify', 'Netflix',
    'Shopify', 'Airbnb', 'Uber', 'Lyft', 'DoorDash', 'Instacart', 'Etsy', 'eBay', 'Zillow', 'Redfin',
    'Mozilla', 'Opera', 'Brave', 'DuckDuckGo', 'Proton', 'Dashlane', 'Slack', 'Zoom', 'Dropbox',
    'Atlassian', 'Salesforce', 'Workday', 'ServiceNow', 'Snowflake', 'Databricks', 'Palantir',
    'Oracle', 'Adobe', 'Intel', 'Nvidia', 'Tesla', 'Apple', 'Google', 'Amazon', 'Microsoft', 'Meta',
];

// Brand names people use instead of the legal name
const ALIASES = {
    'Alphabet': 'Google',
    'Meta Platforms': 'Meta',
    'International Business Machines': 'IBM',
    'Taiwan Semiconductor Manufacturing': 'TSMC',
};

// Legal suffixes and noise to strip from names
const SUFFIXES = [
    'incorporated', 'inc', 'corporation', 'corp', 'company', 'co', 'companies', 'holdings', 'holding',
    'group', 'plc', 'ltd', 'limited', 'llc', 'lp', 'sa', 'se', 'ag', 'nv', 'ab', 'asa', 'spa', 'gmbh',
    'technologies', 'technology', 'systems', 'markets', 'international', 'class a', 'class b', 'class c',
];

function cleanName(raw) {
    let name = raw
        .replace(/\[[^\]]*\]/g, '')        // footnote markers
        .replace(/\([^)]*\)/g, '')         // parentheticals
        .replace(/\/[^/]*\//g, '')         // SEC state tags like /DE/
        .replace(/,/g, ' ')
        .replace(/\.(?=\s|$)/g, ' ')       // trailing periods, but keep "JD.com"
        .replace(/\s+/g, ' ')
        .trim();

    name = name.replace(/^the /i, '');
    let changed = true;
    while (changed) {
        changed = false;
        for (const s of SUFFIXES) {
            const re = new RegExp(`\\s+${s}$`, 'i');
            if (re.test(name) && name.split(' ').length > 1) {
                name = name.replace(re, '').trim();
                changed = true;
            }
        }
    }
    name = name.replace(/\s*&\s*$/, '').trim();
    return ALIASES[name] || name;
}

// SEC names are all caps; "NVIDIA" → "Nvidia"
const titleCase = s => s === s.toUpperCase() ? s.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase()) : s;

async function fetchJSON(url, headers = UA) {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
}

// CSV is much smaller than JSON, and Wikidata sometimes times out mid-response,
// so try a few times
async function fetchWikidata(query, tries = 3) {
    const url = `${WIKIDATA}?query=${encodeURIComponent(query)}`;
    try {
        const res = await fetch(url, { headers: { ...UA, Accept: 'text/csv' } });
        const csv = await res.text();
        if (!res.ok || csv.includes('TimeoutException')) throw new Error(`Wikidata ${res.status}`);
        // rows are `label,links`, where label may be "quoted, with ""escapes"""
        return csv.trim().split(/\r?\n/).slice(1).map(row => {
            const m = row.match(/^(?:"((?:[^"]|"")*)"|([^,]*)),(\d+)$/);
            return m && { name: (m[1] ?? m[2]).replace(/""/g, '"'), fame: +m[3] };
        }).filter(Boolean);
    } catch (err) {
        if (tries <= 1) throw err;
        await new Promise(r => setTimeout(r, 5000));
        return fetchWikidata(query, tries - 1);
    }
}

async function main() {
    const sourced = {};
    // hand-picked first so its spellings win
    sourced['hand-picked'] = HAND_PICKED.map(name => ({ name }));
    sourced['wikidata'] = [];
    for (const query of Object.values(WIKIDATA_QUERIES)) sourced['wikidata'].push(...await fetchWikidata(query));
    sourced['yc'] = (await fetchJSON(YC)).filter(c => c.top_company).map(c => ({ name: c.name }));
    sourced['sec'] = Object.values(await fetchJSON(SEC)).slice(0, TOP_PUBLIC).map(c => ({ name: titleCase(c.title) }));

    // merge, keyed on letters only so "eBay" and "EBAY" collapse; first spelling wins
    const companies = new Map();
    for (const [source, entries] of Object.entries(sourced)) {
        console.log(`${source}: ${entries.length}`);
        for (const { name: raw, fame = 0 } of entries) {
            const name = cleanName(raw);
            // all-lowercase labels are concepts ("retail"), not companies
            if (name === name.toLowerCase()) continue;
            // plain letters and spaces only: no "Dunkin'", "Kobo360", "E-Plus", "Kästle"
            if (!/^[A-Za-z]+( [A-Za-z]+)*$/.test(name)) continue;
            const key = name.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
            if (key.length < 3) continue;
            if (!companies.has(key)) companies.set(key, { name, fame: 0, sources: [] });
            const entry = companies.get(key);
            entry.fame = Math.max(entry.fame, fame);
            if (!entry.sources.includes(source)) entry.sources.push(source);
        }
    }

    const list = [...companies.values()].sort((a, b) => a.name.localeCompare(b.name));
    // one company per line keeps the file diffable
    writeFileSync(OUT, `[\n${list.map(c => JSON.stringify(c)).join(',\n')}\n]\n`);
    console.log(`\n${list.length} companies → ${OUT}`);
}

main();
