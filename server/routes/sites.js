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
  if (!site) return res.status(404).json({ error: 'Site introuvable' });
  res.json(site);
});

// Create new site
sitesRouter.post('/', (req, res) => {
  const { title, slug, description, templateId } = req.body;
  if (!title) return res.status(400).json({ error: 'Le titre est obligatoire' });

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
  if (!updated) return res.status(404).json({ error: 'Site introuvable' });
  res.json(updated);
});

// Delete site
sitesRouter.delete('/:id', (req, res) => {
  const deleted = db.deleteSite(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Site introuvable' });
  res.json({ success: true });
});

// Duplicate site
sitesRouter.post('/:id/duplicate', (req, res) => {
  const copy = db.duplicateSite(req.params.id);
  if (!copy) return res.status(404).json({ error: 'Site introuvable' });
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
  if (!site) return res.status(404).json({ error: 'Site introuvable' });

  const htmlContent = renderSiteHtml(site, true);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  res.attachment(`${site.slug}-website.zip`);

  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });

  archive.pipe(res);

  // Append index.html
  archive.append(htmlContent, { name: 'index.html' });

  // Append a helpful README.txt
  const readme = `Site exporté avec SiteCraft
=================================
Nom du site: ${site.title}
Date d'exportation: ${new Date().toLocaleString('fr-FR')}

Comment visualiser votre site :
Double-cliquez simplement sur le fichier "index.html" pour l'ouvrir dans n'importe quel navigateur web !
Vous pouvez également envoyer ce fichier à n'importe quel hébergeur (GitHub Pages, Netlify, Vercel, OVH, etc.).
`;
  archive.append(readme, { name: 'README.txt' });

  archive.finalize();
});
