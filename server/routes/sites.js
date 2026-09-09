import express from 'express';
import { ZipArchive } from 'archiver';
import { db } from '../db.js';
import { renderSiteHtml } from '../siteRenderer.js';

export const sitesRouter = express.Router();

// List all sites
sitesRouter.get('/', (req, res) => {
  const sites = db.getAllSites();
  // Return summary for dashboard cards
  const summary = sites.map(s => {
    const submissions = db.getSubmissionsBySite(s.id);
    return {
      id: s.id,
      title: s.title,
      slug: s.slug,
      description: s.description,
      published: s.published,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      sectionsCount: s.sections ? s.sections.length : 0,
      submissionsCount: submissions.length,
      unreadSubmissionsCount: submissions.filter(sub => !sub.read).length,
      theme: s.theme,
      heroImage: s.sections?.find(sec => sec.type === 'hero')?.data?.image || null
    };
  });
  res.json(summary);
});

// Get site by ID
sitesRouter.get('/:id', (req, res) => {
  const site = db.getSiteById(req.params.id);
  if (!site) return res.status(404).json({ error: 'Site not found' });
  res.json(site);
});

// Create new site
sitesRouter.post('/', (req, res) => {
  const { title, slug, description, templateId } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  let newSiteData = { title, slug, description };

  // If created from an existing site or template
  if (templateId) {
    const templateSite = db.getSiteById(templateId) || db.getSiteBySlug(templateId);
    if (templateSite) {
      newSiteData.theme = JSON.parse(JSON.stringify(templateSite.theme));
      newSiteData.settings = JSON.parse(JSON.stringify(templateSite.settings));
      newSiteData.sections = JSON.parse(JSON.stringify(templateSite.sections));
    }
  }

  const created = db.createSite(newSiteData);
  res.status(201).json(created);
});

// Update site
sitesRouter.put('/:id', (req, res) => {
  const updated = db.updateSite(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Site not found' });
  res.json(updated);
});

// Delete site
sitesRouter.delete('/:id', (req, res) => {
  const deleted = db.deleteSite(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Site not found' });
  res.json({ success: true });
});

// Duplicate site
sitesRouter.post('/:id/duplicate', (req, res) => {
  const copy = db.duplicateSite(req.params.id);
  if (!copy) return res.status(404).json({ error: 'Site not found' });
  res.status(201).json(copy);
});

// Reset showcase demo sites
sitesRouter.post('/reset-demos', (req, res) => {
  const sites = db.resetToDefault();
  res.json({ success: true, count: sites.length });
});

// Export site as standalone ZIP file
sitesRouter.get('/:id/export', (req, res) => {
  const site = db.getSiteById(req.params.id);
  if (!site) return res.status(404).json({ error: 'Site not found' });

  const htmlContent = renderSiteHtml(site, true);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  res.attachment(`${site.slug}-website.zip`);

  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // Append index.html
  archive.append(htmlContent, { name: 'index.html' });

  // Append a helpful README.txt in English
  const readme = `Website exported with SiteCraft
=================================
Site Title: ${site.title}
Export Date: ${new Date().toISOString()}

How to view your site:
Simply double-click "index.html" to open it in any modern web browser!
You can also deploy these files directly to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, etc.).
`;
  archive.append(readme, { name: 'README.txt' });

  archive.finalize();
});
