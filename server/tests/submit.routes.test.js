import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createTempDataDir, removeTempDataDir } from './testUtils.js';

let app;
let db;
let tmpDir;
let site;

beforeAll(async () => {
  tmpDir = createTempDataDir();
  db = (await import('../db.js')).db;
  const { submitRouter } = await import('../routes/submit.js');

  app = express();
  app.use(express.json());
  app.use('/api/submit', submitRouter);
  app.use('/api/submissions', submitRouter);

  site = db.createSite({ title: 'Contact Test Site' });
});

afterAll(() => {
  removeTempDataDir(tmpDir);
});

describe('submit routes', () => {
  it('POST /api/submit/:siteSlug 404s for an unknown site', async () => {
    const res = await request(app).post('/api/submit/does-not-exist').send({ name: 'x' });
    expect(res.status).toBe(404);
  });

  it('POST /api/submit/:siteSlug records a lead against the site', async () => {
    const res = await request(app)
      .post(`/api/submit/${site.slug}`)
      .send({ name: 'Jane Doe', email: 'jane@example.com', message: 'Hi there' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.submissionId).toMatch(/^sub-/);
  });

  it('GET /api/submissions?siteId= filters submissions for one site', async () => {
    const res = await request(app).get(`/api/submissions?siteId=${site.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].data.name).toBe('Jane Doe');
  });

  it('GET /api/submissions with no query returns every submission', async () => {
    const otherSite = db.createSite({ title: 'Second Site' });
    await request(app).post(`/api/submit/${otherSite.slug}`).send({ name: 'Bob' });

    const res = await request(app).get('/api/submissions');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('DELETE /api/submissions/:id removes a submission', async () => {
    const created = await request(app)
      .post(`/api/submit/${site.slug}`)
      .send({ name: 'Temp' });
    const res = await request(app).delete(`/api/submissions/${created.body.submissionId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const remaining = await request(app).get(`/api/submissions?siteId=${site.id}`);
    expect(remaining.body.find((s) => s.id === created.body.submissionId)).toBeUndefined();
  });
});
