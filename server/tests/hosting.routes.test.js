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
  const { hostingRouter } = await import('../routes/hosting.js');

  app = express();
  app.use('/site', hostingRouter);

  site = db.createSite({
    title: 'Hosted Test Site',
    sections: [{ id: 'h1', type: 'hero', data: { title: 'Welcome' } }]
  });
});

afterAll(() => {
  removeTempDataDir(tmpDir);
});

describe('hosting route (/site/:slug)', () => {
  it('renders a friendly 404 page for an unknown slug', async () => {
    const res = await request(app).get('/site/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.text).toContain('Site Not Found');
  });

  it('serves the rendered site HTML for a known slug', async () => {
    const res = await request(app).get(`/site/${site.slug}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(res.text).toContain('Hosted Test Site');
    expect(res.text).toContain('Welcome');
  });

  it('increments the view counter on every visit', async () => {
    await request(app).get(`/site/${site.slug}`);
    await request(app).get(`/site/${site.slug}`);
    const summary = db.getSiteById(site.id);
    expect(summary.views).toBeGreaterThanOrEqual(2);
  });

  it('does not increment views for an unknown slug', async () => {
    const before = db.getSiteById(site.id).views;
    await request(app).get('/site/still-unknown');
    const after = db.getSiteById(site.id).views;
    expect(after).toBe(before);
  });
});
