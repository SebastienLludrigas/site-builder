import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createTempDataDir, removeTempDataDir } from './testUtils.js';

let db;
let tmpDir;

beforeAll(async () => {
  tmpDir = createTempDataDir();
  db = (await import('../db.js')).db;
});

afterAll(() => {
  removeTempDataDir(tmpDir);
});

describe('db.js', () => {
  it('seeds the sites file with the demo showcase sites on first read', () => {
    const sites = db.getAllSites();
    expect(Array.isArray(sites)).toBe(true);
    expect(sites.length).toBeGreaterThan(0);
  });

  it('creates a new site with a generated slug and default theme', () => {
    const site = db.createSite({ title: 'My Bakery' });
    expect(site.id).toMatch(/^site-/);
    expect(site.slug).toBe('my-bakery');
    expect(site.theme).toBeDefined();
    expect(site.sections).toEqual([]);
    expect(db.getSiteById(site.id)).toMatchObject({ title: 'My Bakery' });
  });

  it('slugifies accented and special characters safely', () => {
    const site = db.createSite({ title: 'Café Déjà-Vu!! 42' });
    expect(site.slug).toBe('cafe-deja-vu-42');
  });

  it('de-duplicates slugs by appending a counter', () => {
    const a = db.createSite({ title: 'Duplicate Name' });
    const b = db.createSite({ title: 'Duplicate Name' });
    expect(a.slug).toBe('duplicate-name');
    expect(b.slug).toBe('duplicate-name-1');
  });

  it('falls back to "my-site" when the title has no usable characters', () => {
    const site = db.createSite({ title: '!!!' });
    expect(site.slug).toBe('my-site');
  });

  it('updates a site and refreshes updatedAt', async () => {
    const site = db.createSite({ title: 'To Update' });
    await new Promise((r) => setTimeout(r, 5));
    const updated = db.updateSite(site.id, { title: 'Updated Title' });
    expect(updated.title).toBe('Updated Title');
    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(site.updatedAt).getTime()
    );
  });

  it('returns null when updating a non-existent site', () => {
    expect(db.updateSite('nope', { title: 'x' })).toBeNull();
  });

  it('avoids slug collisions when a site is updated with an existing slug', () => {
    const a = db.createSite({ title: 'Alpha Site' });
    const b = db.createSite({ title: 'Beta Site' });
    const updated = db.updateSite(b.id, { slug: a.slug });
    expect(updated.slug).not.toBe(a.slug);
    expect(updated.slug.startsWith(a.slug)).toBe(true);
  });

  it('duplicates a site with a fresh id, "(Copy)" title and unique slug', () => {
    const original = db.createSite({ title: 'Original', sections: [{ id: 's1', type: 'hero' }] });
    const copy = db.duplicateSite(original.id);
    expect(copy.id).not.toBe(original.id);
    expect(copy.title).toBe('Original (Copy)');
    expect(copy.slug).not.toBe(original.slug);
    expect(copy.sections).toEqual(original.sections);
  });

  it('returns null when duplicating a non-existent site', () => {
    expect(db.duplicateSite('nope')).toBeNull();
  });

  it('deletes a site and reports false for an unknown id', () => {
    const site = db.createSite({ title: 'To Delete' });
    expect(db.deleteSite(site.id)).toBe(true);
    expect(db.getSiteById(site.id)).toBeUndefined();
    expect(db.deleteSite(site.id)).toBe(false);
  });

  it('adds and lists submissions per site, tracking read state', () => {
    const site = db.createSite({ title: 'Contact Me' });
    const sub = db.addSubmission(site.id, site.slug, { name: 'Alice', email: 'a@x.com' });
    expect(sub.read).toBe(false);
    const subs = db.getSubmissionsBySite(site.id);
    expect(subs).toHaveLength(1);
    expect(subs[0].data.name).toBe('Alice');
  });

  it('deletes a submission', () => {
    const site = db.createSite({ title: 'Contact Me 2' });
    const sub = db.addSubmission(site.id, site.slug, { name: 'Bob' });
    db.deleteSubmission(sub.id);
    expect(db.getSubmissionsBySite(site.id)).toHaveLength(0);
  });

  it('resetToDefault restores the original showcase seed sites', () => {
    db.createSite({ title: 'Junk' });
    const reset = db.resetToDefault();
    const all = db.getAllSites();
    expect(all).toEqual(reset);
    expect(all.find((s) => s.title === 'Junk')).toBeUndefined();
  });
});
