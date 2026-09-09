import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Creates an isolated temp data directory and points SITECRAFT_DATA_DIR at it
 * *before* db.js is imported, so each test file gets its own sites.json /
 * submissions.json sandbox instead of touching the real data/ folder.
 */
export function createTempDataDir() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sitecraft-test-'));
  process.env.SITECRAFT_DATA_DIR = tmpDir;
  return tmpDir;
}

export function removeTempDataDir(tmpDir) {
  if (tmpDir && fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

export function minimalSite(overrides = {}) {
  return {
    id: 'site-test-1',
    title: 'Test Site',
    slug: 'test-site',
    description: 'A test site',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    published: true,
    theme: {
      palette: 'indigo',
      primaryColor: '#4f46e5',
      secondaryColor: '#1e1b4b',
      accentColor: '#06b6d4',
      backgroundColor: '#ffffff',
      textColor: '#0f172a',
      fontHeading: 'Inter',
      fontBody: 'Inter',
      borderRadius: 'rounded-xl'
    },
    settings: {
      favicon: '🌐',
      logoText: 'Test Site',
      showBranding: true,
      contactEmail: ''
    },
    sections: [],
    ...overrides
  };
}
