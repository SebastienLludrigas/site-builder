import { describe, it, expect, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadRouter } from '../routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

const app = express();
app.use('/api/upload', uploadRouter);

const writtenFiles = [];

afterEach(() => {
  while (writtenFiles.length) {
    const file = writtenFiles.pop();
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
});

describe('upload route', () => {
  it('rejects a request with no file', async () => {
    const res = await request(app).post('/api/upload');
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no file/i);
  });

  it('rejects unsupported file formats with a JSON error instead of crashing', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('image', Buffer.from('not an image'), 'malware.exe');
    expect(res.status).toBe(415);
    expect(res.body.error).toMatch(/unsupported file format/i);
  });

  it('stores a valid image and returns its public URL', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('image', Buffer.from([0x89, 0x50, 0x4e, 0x47]), 'photo.png');

    expect(res.status).toBe(200);
    expect(res.body.url).toMatch(/^\/uploads\/image-.*\.png$/);
    expect(res.body.size).toBeGreaterThan(0);

    writtenFiles.push(path.join(UPLOADS_DIR, res.body.filename));
  });
});
