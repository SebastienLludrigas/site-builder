import express from 'express';
import { db } from '../db.js';

export const submitRouter = express.Router();

// Public submission endpoint for hosted sites
submitRouter.post('/:siteSlug', (req, res) => {
  const { siteSlug } = req.params;
  const site = db.getSiteBySlug(siteSlug);
  if (!site) {
    return res.status(404).json({ error: 'Site introuvable' });
  }

  const formData = req.body || {};
  const submission = db.addSubmission(site.id, site.slug, formData);

  res.json({
    success: true,
    message: 'Merci ! Votre message a bien été transmis au propriétaire du site.',
    submissionId: submission.id
  });
});

// Admin endpoint to view submissions
submitRouter.get('/', (req, res) => {
  const { siteId } = req.query;
  if (siteId) {
    return res.json(db.getSubmissionsBySite(siteId));
  }
  return res.json(db.getAllSubmissions());
});

// Delete a submission
submitRouter.delete('/:id', (req, res) => {
  const deleted = db.deleteSubmission(req.params.id);
  res.json({ success: deleted });
});
