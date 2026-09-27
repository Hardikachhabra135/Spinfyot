import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  try {
    const servicesPath = path.join(__dirname, '../src/data/services.js');
    const content = fs.readFileSync(servicesPath, 'utf8');
    const slugRegex = /slug:\s*['"]([^'"]+)['"]/g;
    const slugs = [];
    let match;
    while ((match = slugRegex.exec(content)) !== null) {
      slugs.push(match[1]);
    }

    const routes = [
      '/',
      '/services',
      '/testimonials',
      '/contact',
      '/blog'
    ];

    for (const slug of slugs) {
      routes.push(`/services/${slug}`);
    }

    // Fetch blogs
    console.log('Fetching blogs from API...');
    let success = false;
    for (let i = 0; i < 5; i++) {
      try {
        const res = await fetch('https://spinfyot-api.onrender.com/api/public/blogs');
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          if (data.success && data.data) {
            for (const blog of data.data) {
              if (blog.slug && blog.status !== 'draft') {
                routes.push(`/blog/${blog.slug}`);
              }
            }
          }
          success = true;
          break; // successfully parsed and added
        } catch (err) {
          console.warn(`API returned non-JSON (attempt ${i+1}/5). Retrying in 10s...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
      } catch (err) {
        console.warn(`Failed to fetch blogs (attempt ${i+1}/5): ${err.message}. Retrying in 10s...`);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    if (!success) {
      console.error('Failed to load blogs for sitemap after 5 attempts.');
    }

    let sitemap_xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    for (const route of routes) {
      sitemap_xml += `  <url>\n    <loc>https://spinfyot.com${route}</loc>\n  </url>\n`;
    }
    sitemap_xml += '</urlset>';

    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap_xml, 'utf8');
    console.log('Successfully generated sitemap.xml with dynamic blogs!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
