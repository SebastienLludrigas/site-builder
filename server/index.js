import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { sitesRouter } from './routes/sites.js';
import { submitRouter } from './routes/submit.js';
import { uploadRouter } from './routes/upload.js';
import { hostingRouter } from './routes/hosting.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const uploadsDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/sites', sitesRouter);
app.use('/api/submit', submitRouter);
app.use('/api/submissions', submitRouter);
app.use('/api/upload', uploadRouter);

// Standalone Hosted Sites route: /site/:slug
app.use('/site', hostingRouter);

// Serve frontend if built (client/dist exists)
const clientDist = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api') && !req.path.startsWith('/uploads') && !req.path.startsWith('/site')) {
      return res.sendFile(path.join(clientDist, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 SiteCraft Backend & Local Hosting Server running on http://localhost:${PORT}`);
  console.log(`📂 Uploads directory: ${uploadsDir}`);
});
