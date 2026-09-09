import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { SEED_SITES } from './seedSites.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const SITES_FILE = path.join(DATA_DIR, 'sites.json');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize sites file with seeds if not present
function initializeDb() {
  if (!fs.existsSync(SITES_FILE)) {
    fs.writeFileSync(SITES_FILE, JSON.stringify(SEED_SITES, null, 2), 'utf-8');
  } else {
    try {
      const data = fs.readFileSync(SITES_FILE, 'utf-8');
      const sites = JSON.parse(data);
      if (!Array.isArray(sites) || sites.length === 0) {
        fs.writeFileSync(SITES_FILE, JSON.stringify(SEED_SITES, null, 2), 'utf-8');
      }
    } catch {
      fs.writeFileSync(SITES_FILE, JSON.stringify(SEED_SITES, null, 2), 'utf-8');
    }
  }

  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    // Seed a couple sample submissions so the inbox isn't empty on first glance!
    const sampleSubmissions = [
      {
        id: "sub-1",
        siteId: "site-patisserie-delice",
        siteSlug: "patisserie-delice",
        createdAt: "2026-09-08T10:15:00.000Z",
        data: {
          name: "Emily Reynolds",
          email: "emily.reynolds@example.com",
          phone: "+1 (555) 234-5678",
          service: "Brunch Table Reservation",
          message: "Hello! We would like to book a table for 4 this Sunday, September 13th at 11:30 AM to celebrate a birthday. Thank you in advance!"
        },
        read: true
      },
      {
        id: "sub-2",
        siteId: "site-novapulse-ai",
        siteSlug: "novapulse-ai",
        createdAt: "2026-09-09T09:30:00.000Z",
        data: {
          name: "Jonathan Vance",
          email: "j.vance@fintech-ventures.io",
          phone: "+1 (555) 889-0011",
          service: "Enterprise Demonstration",
          message: "Hello, we are a fintech team of 80 specialists and would love to evaluate your RAG analytics engine on our financial transaction streams. Would it be possible to schedule a demo call this Thursday?"
        },
        read: false
      }
    ];
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(sampleSubmissions, null, 2), 'utf-8');
  }
}

initializeDb();

function readSites() {
  try {
    const data = fs.readFileSync(SITES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading sites:', err);
    return [];
  }
}

function writeSites(sites) {
  fs.writeFileSync(SITES_FILE, JSON.stringify(sites, null, 2), 'utf-8');
}

function readSubmissions() {
  try {
    const data = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading submissions:', err);
    return [];
  }
}

function writeSubmissions(submissions) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
}

function slugify(text) {
  return String(text || '')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'my-site';
}

export const db = {
  getAllSites() {
    return readSites();
  },

  getSiteById(id) {
    const sites = readSites();
    return sites.find(s => s.id === id);
  },

  getSiteBySlug(slug) {
    const sites = readSites();
    return sites.find(s => s.slug === slug);
  },

  createSite(siteData) {
    const sites = readSites();
    let slug = siteData.slug ? slugify(siteData.slug) : slugify(siteData.title);
    
    // Ensure unique slug
    let baseSlug = slug;
    let counter = 1;
    while (sites.some(s => s.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newSite = {
      id: `site-${uuidv4()}`,
      title: siteData.title || "New Site",
      slug: slug,
      description: siteData.description || "A website created with SiteCraft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: true,
      theme: siteData.theme || {
        palette: "indigo",
        primaryColor: "#4f46e5",
        secondaryColor: "#1e1b4b",
        accentColor: "#06b6d4",
        backgroundColor: "#ffffff",
        textColor: "#0f172a",
        fontHeading: "Inter",
        fontBody: "Inter",
        borderRadius: "rounded-xl"
      },
      settings: siteData.settings || {
        favicon: "🌐",
        logoText: siteData.title || "My Site",
        showBranding: true,
        contactEmail: ""
      },
      sections: siteData.sections || []
    };

    sites.unshift(newSite);
    writeSites(sites);
    return newSite;
  },

  updateSite(id, updateData) {
    const sites = readSites();
    const index = sites.findIndex(s => s.id === id);
    if (index === -1) return null;

    // Check slug collision if slug is modified
    if (updateData.slug && updateData.slug !== sites[index].slug) {
      let slug = slugify(updateData.slug);
      let baseSlug = slug;
      let counter = 1;
      while (sites.some(s => s.id !== id && s.slug === slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    sites[index] = {
      ...sites[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    writeSites(sites);
    return sites[index];
  },

  deleteSite(id) {
    const sites = readSites();
    const filtered = sites.filter(s => s.id !== id);
    if (filtered.length === sites.length) return false;
    writeSites(filtered);
    return true;
  },

  duplicateSite(id) {
    const sites = readSites();
    const original = sites.find(s => s.id === id);
    if (!original) return null;

    const copy = JSON.parse(JSON.stringify(original));
    copy.id = `site-${uuidv4()}`;
    copy.title = `${original.title} (Copy)`;
    
    let baseSlug = slugify(`${original.slug}-copy`);
    let slug = baseSlug;
    let counter = 1;
    while (sites.some(s => s.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    copy.slug = slug;
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();

    sites.unshift(copy);
    writeSites(sites);
    return copy;
  },

  resetToDefault() {
    writeSites(SEED_SITES);
    return SEED_SITES;
  },

  // Submissions
  getAllSubmissions() {
    return readSubmissions();
  },

  getSubmissionsBySite(siteId) {
    const subs = readSubmissions();
    return subs.filter(s => s.siteId === siteId || s.siteSlug === siteId);
  },

  addSubmission(siteId, siteSlug, data) {
    const subs = readSubmissions();
    const newSub = {
      id: `sub-${uuidv4()}`,
      siteId,
      siteSlug,
      createdAt: new Date().toISOString(),
      data,
      read: false
    };
    subs.unshift(newSub);
    writeSubmissions(subs);
    return newSub;
  },

  deleteSubmission(submissionId) {
    const subs = readSubmissions();
    const filtered = subs.filter(s => s.id !== submissionId);
    writeSubmissions(filtered);
    return true;
  }
};
