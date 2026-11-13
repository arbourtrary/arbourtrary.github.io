// Finds single-word anagrams of every company in src/data/sketches/companies.json
// (run fetch-companies.js first), writes src/data/sketches/company-anagrams.json
// and company-anagrams-sketch.json (the play order), and rewrites the appendix in static/data/sketches/company-anagrams.txt.
//
// Usage: node src/scripts/find-company-anagrams.js
//
// Words: SCOWL size 50 (http://wordlist.aspell.net), a standard-size dictionary,
// kept only if they're among the most common words on the web, and ordered by Peter Norvig's counts from the Google Web Trillion
// Word Corpus (https://norvig.com/ngrams/) so the most common anagram comes first.

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const IN = join(__dirname, '../data/sketches/companies.json');
const OUT = join(__dirname, '../data/sketches/company-anagrams.json');
const SKETCH_OUT = join(__dirname, '../data/sketches/company-anagrams-sketch.json');
const NOTES = join(__dirname, '../../static/data/sketches/company-anagrams.txt');

const SCOWL = 'http://app.aspell.net/create?max_size=50&spelling=US&max_variant=0&diacritic=strip&download=wordlist&encoding=utf-8&format=inline';
const UNIGRAMS = 'https://norvig.com/ngrams/count_1w.txt';

const MIN_LETTERS = 4;
const MAX_RANK = 70000;    // web frequency rank; past this, words get obscure

// nothing crude in a public sketch
const BLOCKED = new Set(['porn', 'anal', 'anus', 'rape', 'raped', 'rapes', 'nazi', 'nazis', 'whore',
    'slut', 'sluts', 'cock', 'dick', 'dicks', 'fuck', 'shit', 'cunt', 'tits', 'boobs', 'horny', 'nude',
    'nudes', 'penis', 'pussy', 'semen', 'sperm', 'orgy', 'erotic', 'condom', 'condoms', 'bitch', 'piss',
    'negro', 'negros', 'sodomy', 'scrota', 'scrotum', 'genital', 'genitals', 'enema', 'enemas', 'herpes',
    'lovemaking', 'copulates', 'harelip', 'toerags', 'poop', 'peed', 'asses', 'ballsy']);

// Words that pass the filters above but still aren't ones people know
const OBSCURE_WORDS = new Set(['cotes', 'bani', 'sateen', 'synod', 'oaten', 'comer', 'hock', 'loge',
    'atria', 'lathes', 'staves', 'mange', 'lariat', 'rube', 'posit', 'sate', 'teas', 'alms', 'castor',
    'cored', 'oldies', 'soiled', 'novices', 'mired', 'sewn', 'pars', 'raps', 'tarp', 'reagent']);

// Companies left off on purpose
const SKIP_COMPANIES = new Set([
    // controversial: weapons and defense, tobacco, pipelines, and the like
    'Anduril', 'Leidos', 'Thales', 'Rostec', 'Altria', 'Koch', 'Hooters', 'Enbridge', 'Shein', 'Palantir',
    // generic words more than companies
    'Times', 'Time', 'News', 'North', 'Icon', 'Caper', 'Rare', 'Sire', 'Spar', 'Senate', 'Credo', 'Presto',
    'Bolt', 'Toro', 'Oklo', 'White Rose', 'ELBO',
    // big at home, but unlikely to reach a software engineer in the US
    'BelAZ', 'Roshen', 'RATP', 'Posti', 'Orlen', 'Lifan', 'Elron', 'Sokol', 'Pesa', 'DESY', 'Derbi',
    'Dobro', 'Rado', 'La Poste', 'Das Erste', 'Mediaset', 'Toho', 'Atos', 'Vale', 'Vestas', 'Midea',
    'Engie', 'Iveco', 'Ineos', 'Denso', 'Aniplex', 'Berluti', 'Brembo', 'Spyker Cars', 'Tamron', 'Aspyr',
    'POSCO', 'Linde', 'Amcor', 'Ameren', 'Cintas', 'Copart', 'Costar', 'DOVER', 'Eaton', 'EMCOR',
    'Entegris', 'Graco', 'Insulet', 'Magna', 'MSCI', 'PENTAIR', 'Resona', 'STERIS', 'Tenaris', 'Tradeweb',
    'Bain', 'Tesco', 'Dyson',
]);

// Hand-picked pairs that open the sketch, in order; the word listed leads,
// then any other anagrams, then every other company plays after
const FEATURED = [
    ['Vercel', 'clever'],
    ['Renault', 'neutral'],
    ['Siemens', 'nemesis'],
    ['Atlassian', 'assailant'],
    ['Pontiac', 'caption'],
    ['Replit', 'triple'],
    ['Cartier', 'erratic'],
    ['Ericsson', 'necrosis'],
    ['Stripe', 'priest'],
    ['Redfin', 'friend'],
    ['Lacoste', 'lactose'],
    ['Vimeo', 'movie'],
    ['DirecTV', 'verdict'],
    ['Docker', 'rocked'],
    ['Converse', 'conserve'],
    ['Tesla', 'steal'],
    ['Velcro', 'clover'],
    ['Proton', 'pronto'],
    ['Nespresso', 'responses'],
    ['Red Hat', 'thread'],
    ['Verisign', 'revising'],
    ['Wayfair', 'fairway'],
    ['Agilent', 'gelatin'],
    ['Ricoh', 'choir'],
    ['Geely', 'elegy'],
    ['Garmin', 'margin'],
    ['Framer', 'farmer'],
    ['Staples', 'pastels'],
    ['Wired', 'weird'],
    ['Carlyle', 'clearly'],
    ['Pearson', 'persona'],
    ['Atmel', 'metal'],
    ['Braun', 'urban'],
    ['Atari', 'tiara'],
    ['Supreme', 'presume'],
    ['Signal', 'aligns'],
    ['Maersk', 'makers'],
    ['Naver', 'raven'],
    ['Carvana', 'caravan'],
    ['Tecmo', 'comet'],
    ['Palm', 'lamp'],
    ['Adobe', 'abode'],
    ['Meta', 'team'],
    ['Sony', 'nosy'],
    ['Slack', 'lacks'],
];

async function fetchText(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.text();
}

const letters = s => s.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '');
const signature = s => [...s].sort().join('');

// sorted letters → common dictionary words with those letters, most common first
async function loadWords() {
    const [scowl, uni] = await Promise.all([SCOWL, UNIGRAMS].map(fetchText));
    const rank = new Map(uni.split('\n').map((line, i) => [line.split('\t')[0], i]));
    // lowercase only: no proper nouns, abbreviations or possessives
    const words = scowl.split('\n')
        .filter(w => /^[a-z]+$/.test(w) && w.length >= MIN_LETTERS && !BLOCKED.has(w) && !OBSCURE_WORDS.has(w))
        .filter(w => rank.get(w) < MAX_RANK)
        .sort((a, b) => (rank.get(a) ?? Infinity) - (rank.get(b) ?? Infinity));
    const bySignature = new Map();
    for (const word of words) {
        const sig = signature(word);
        if (!bySignature.has(sig)) bySignature.set(sig, []);
        bySignature.get(sig).push({ word });
    }
    return bySignature;
}

async function main() {
    const companies = JSON.parse(readFileSync(IN, 'utf8'));
    const bySignature = await loadWords();

    const results = [];
    for (const company of companies) {
        const target = letters(company.name);
        if (target.length < MIN_LETTERS || SKIP_COMPANIES.has(company.name)) continue;
        // the name itself isn't an anagram ("Target" → "target")
        const words = (bySignature.get(signature(target)) || []).filter(w => w.word !== target);
        if (!words.length) continue;
        results.push({
            name: company.name,
            fame: company.fame,
            sources: company.sources,
            words: words.map(w => w.word),
        });
    }

    // best known companies first
    results.sort((a, b) => b.fame - a.fame || a.name.localeCompare(b.name));
    for (const r of results.slice(0, 60)) console.log(`${r.name.padEnd(28)} ${r.words.join(', ')}`);

    // featured pairs have to come from the list itself
    for (const [name, word] of FEATURED) {
        if (!results.some(r => r.name === name && r.words.includes(word))) throw new Error(`Not in the list: ${name} / ${word}`);
    }

    // play order for the sketch: featured first, then everyone else
    const featured = FEATURED.map(([name, word]) => {
        const r = results.find(r => r.name === name);
        return { name, words: [word, ...r.words.filter(w => w !== word)] };
    });
    const rest = results
        .filter(r => !FEATURED.some(([name]) => name === r.name))
        .map(r => ({ name: r.name, words: r.words }));
    writeFileSync(SKETCH_OUT, JSON.stringify([...featured, ...rest], null, '\t'));
    writeFileSync(OUT, `[\n${results.map(r => JSON.stringify(r)).join(',\n')}\n]\n`);
    console.log(`\n${results.length} of ${companies.length} companies have single-word anagrams → ${OUT}`);

    writeAppendix(results);
}

// Swap the list between the appendix markers in the notes, alphabetically
function writeAppendix(results) {
    const START = '<!-- appendix:start -->';
    const END = '<!-- appendix:end -->';
    const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    // two left-aligned columns, each as wide as its longest entry
    const cell = 'margin: 0;';
    const word = 'margin: 0; color: var(--color-2);';
    const rows = [...results]
        .sort((a, b) => a.name.localeCompare(b.name))
        // the sketch picks up clicks on data-company and plays that company
        .map(r => `<p style="${cell}"><a href="#" data-company="${escape(r.name)}">${escape(r.name)}</a></p><p style="${word}">${r.words.join(', ')}</p>`)
        .join('\n');
    const table = `<div style="display: grid; grid-template-columns: max-content 1fr; column-gap: 40px; row-gap: 6px; margin-left: 30px;">\n${rows}\n</div>`;
    const notes = readFileSync(NOTES, 'utf8');
    const before = notes.slice(0, notes.indexOf(START) + START.length);
    const after = notes.slice(notes.indexOf(END));
    writeFileSync(NOTES, `${before}\n${table}\n${after}`);
    console.log(`appendix → ${NOTES}`);
}

main();
