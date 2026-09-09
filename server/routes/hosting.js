import express from 'express';
import { db } from '../db.js';
import { renderSiteHtml } from '../siteRenderer.js';

export const hostingRouter = express.Router();

function renderNotFoundPage(slug) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Site Not Found - SiteCraft</title>
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
        <h1>Site Not Found</h1>
        <p>The site "<strong>${slug}</strong>" does not exist or was renamed on this local server.</p>
        <a href="/">Back to Dashboard</a>
      </div>
    </body>
    </html>
  `;
}

// Standalone hosted site: GET /site/:slug
hostingRouter.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const site = db.getSiteBySlug(slug);

  if (!site) {
    res.status(404).send(renderNotFoundPage(slug));
    return;
  }

  db.incrementViews(site.id);

  const html = renderSiteHtml(site, false);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});
