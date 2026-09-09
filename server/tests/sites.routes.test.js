import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createTempDataDir, removeTempDataDir } from './testUtils.js';

let app;
let db;
let tmpDir;

beforeAll(async () => {
  tmpDir = createTempDataDir();
  db = (await import('../db.js')).db;
  const { sitesRouter } = await import('../routes/sites.js');

  app = express();
  app.use(express.json());
  app.use('/api/sites', sitesRouter);
});

afterAll(() => {
  removeTempDataDir(tmpDir);
});

describe('sites routes', () => {
  it('GET /api/sites returns a dashboard summary for every site', async () => {
    const res = await request(app).get('/api/sites');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    const summary = res.body[0];
    expect(summary).toHaveProperty('sectionsCount');
    expect(summary).toHaveProperty('submissionsCount');
    expect(summary).toHaveProperty('unreadSubmissionsCount');
  });

  it('POST /api/sites requires a title', async () => {
    const res = await request(app).post('/api/sites').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/i);
  });

  it('POST /api/sites creates a new site', async () => {
    const res = await request(app).post('/api/sites').send({ title: 'Fresh Site' });
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('fresh-site');
  });

  it('POST /api/sites with templateId clones theme/settings/sections', async () => {
    const template = db.createSite({
      title: 'Template Source',
      sections: [{ id: 's1', type: 'hero', data: { headline: 'Hi' } }]
    });
    const res = await request(app)
      .post('/api/sites')
      .send({ title: 'Cloned Site', templateId: template.id });
    expect(res.status).toBe(201);
    expect(res.body.sections).toEqual(template.sections);
    // Must be a deep copy, not the same reference
    expect(res.body.sections).not.toBe(template.sections);
  });

  it('GET /api/sites/:id 404s for an unknown site', async () => {
    const res = await request(app).get('/api/sites/does-not-exist');
    expect(res.status).toBe(404);
  });

  it('PUT /api/sites/:id updates an existing site', async () => {
    const created = await request(app).post('/api/sites').send({ title: 'Editable' });
    const res = await request(app)
      .put(`/api/sites/${created.body.id}`)
      .send({ title: 'Edited Title' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Edited Title');
  });

  it('PUT /api/sites/:id 404s for an unknown site', async () => {
    const res = await request(app).put('/api/sites/nope').send({ title: 'x' });
    expect(res.status).toBe(404);
  });

  it('POST /api/sites/:id/duplicate clones a site', async () => {
    const created = await request(app).post('/api/sites').send({ title: 'Dup Me' });
    const res = await request(app).post(`/api/sites/${created.body.id}/duplicate`);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Dup Me (Copy)');
  });

  it('DELETE /api/sites/:id removes a site and 404s on a second attempt', async () => {
    const created = await request(app).post('/api/sites').send({ title: 'Delete Me' });
    const first = await request(app).delete(`/api/sites/${created.body.id}`);
    expect(first.status).toBe(200);
    const second = await request(app).delete(`/api/sites/${created.body.id}`);
    expect(second.status).toBe(404);
  });

  it('GET /api/sites/:id/export streams a zip with the site slug in the filename', async () => {
    const created = await request(app).post('/api/sites').send({ title: 'Exportable' });
    const res = await request(app).get(`/api/sites/${created.body.id}/export`);
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toContain('exportable-website.zip');
  });

  it('POST /api/sites/reset-demos restores the seeded showcase sites', async () => {
    const res = await request(app).post('/api/sites/reset-demos');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const after = await request(app).get('/api/sites');
    expect(after.body.length).toBe(res.body.count);
  });
});
