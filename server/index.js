import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { db } from './db.js';
import { renderSiteHtml } from './siteRenderer.js';
import { sitesRouter } from './routes/sites.js';
import { submitRouter } from './routes/submit.js';
import { uploadRouter } from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/sites', sitesRouter);
app.use('/api/submit', submitRouter);
app.use('/api/submissions', submitRouter);
app.use('/api/upload', uploadRouter);

// Standalone Hosted Sites route: /site/:slug
app.get('/site/:slug', (req, res) => {
  const { slug } = req.params;
  const site = db.getSiteBySlug(slug);

  if (!site) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Site introuvable - SiteCraft</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
          .box { max-width: 480px; padding: 40px; background: #1e293b; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
          h1 { font-size: 24px; margin-bottom: 12px; }
          p { color: #94a3b8; font-size: 15px; margin-bottom: 24px; line-height: 1.5; }
          a { display: inline-block; background: #4f46e5; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="box">
          <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
          <h1>Site Introuvable</h1>
          <p>Le site "<strong>${slug}</strong>" n'existe pas ou a été renommé sur ce serveur local.</p>
          <a href="/">Retour au tableau de bord</a>
        </div>
      </body>
      </html>
    `);
  }

  // Render complete HTML
  const html = renderSiteHtml(site, false);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// Serve frontend if built (client/dist exists)
const clientDist = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/site')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 SiteCraft Backend & Local Hosting Server running on http://localhost:${PORT}`);
  console.log(`📂 Uploads directory: ${uploadsDir}`);
});
