import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

export const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format (please use JPG, PNG, WebP, GIF, or SVG)'));
    }
  }
});

uploadRouter.post('/', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const status = err instanceof multer.MulterError ? 400 : 415;
      return res.status(status).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  });
});
