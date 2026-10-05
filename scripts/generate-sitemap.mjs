import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Load .env files if present
function loadEnv() {
  for (const file of ['.env.local', '.env.production', '.env']) {
    const envPath = resolve(root, file);
    if (existsSync(envPath)) {
      const lines = readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) process.env[key] = value.trim();
        }
      }
    }
  }
}

loadEnv();

const BASE = 'https://www.carkinne.com';
const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.warn('⚠️ Warning: Missing Supabase credentials for sitemap generation. Skipping dynamic URLs.');
  process.exit(0);
}

try {
  const res = await fetch(`${url}/rest/v1/cars?select=slug,updated_at&limit=1000`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });

  if (!res.ok) {
    console.error(`❌ Supabase error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const cars = await res.json();
  const sitemapPath = resolve(root, 'public/sitemap.xml');
  
  const staticUrls = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/cars', priority: '0.9', changefreq: 'daily' },
    { loc: '/electric-cars', priority: '0.8', changefreq: 'weekly' },
    { loc: '/emi-calculator', priority: '0.8', changefreq: 'monthly' },
    { loc: '/showrooms', priority: '0.8', changefreq: 'weekly' },
    { loc: '/blog', priority: '0.7', changefreq: 'daily' },
    { loc: '/offers', priority: '0.7', changefreq: 'weekly' },
    { loc: '/ev-charging', priority: '0.7', changefreq: 'weekly' },
    { loc: '/budget-finder', priority: '0.6', changefreq: 'monthly' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/advertise', priority: '0.5', changefreq: 'monthly' },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const s of staticUrls) {
    xml += `  <url>\n    <loc>${BASE}${s.loc}</loc>\n    <priority>${s.priority}</priority>\n    <changefreq>${s.changefreq}</changefreq>\n  </url>\n`;
  }

  for (const c of cars) {
    if (!c.slug) continue;
    const lastmod = (c.updated_at || new Date().toISOString()).slice(0, 10);
    xml += `  <url>\n    <loc>${BASE}/cars/${c.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.7</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
  }

  xml += `</urlset>\n`;

  writeFileSync(sitemapPath, xml, 'utf8');
  console.log(`✅ Sitemap successfully generated with ${staticUrls.length} static URLs + ${cars.length} car URLs (${staticUrls.length + cars.length} total).`);
} catch (err) {
  console.error('❌ Sitemap generation failed:', err);
  process.exit(1);
}
