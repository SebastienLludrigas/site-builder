# 🌐 SiteCraft — Intuitive & Locally-Hosted Website Builder

SiteCraft is a modern, full-featured web application that enables non-technical users to design, edit, preview, and host fully functional websites locally without any remote cloud deployment.

---

## 🚀 Quick Start

### 1. Launch the Application
Start the backend server and serve the complete web application on port **3001**:

```bash
npm start
```

Or in development mode (with Vite hot module replacement):
```bash
npm run dev
```

Then open your browser at:
👉 **[http://localhost:3001](http://localhost:3001)**

---

## 🌟 Preloaded Showcase Demo Websites

The application comes preloaded with **4 complete and realistic showcase websites**, ready to be browsed and edited directly within the tool:

1. **🥐 [Delight Bakery & Cafe](http://localhost:3001/site/patisserie-delice)**
   - Artisan bakery & organic specialty coffee house.
   - *Features*: Menu showcase with tags and pricing, photo gallery, 5-star customer reviews, brunch reservation and custom cake order form.
   - *Design*: Elegant serif typography (Playfair Display), warm amber & honey palette, smooth rounded cards.

2. **⚡ [NovaPulse AI — Augmented Intelligence Platform](http://localhost:3001/site/novapulse-ai)**
   - High-tech B2B SaaS platform for enterprise data analytics and AI workflows.
   - *Features*: Live performance metrics, interactive pricing tiers with monthly / annual toggle (-25%), expandable FAQ accordion, enterprise demo request form.
   - *Design*: Futuristic dark mode theme with indigo & cyan accents, Outfit font, clean sharp borders.

3. **📷 [Elena Vance — Fine Art & Editorial Photography](http://localhost:3001/site/elena-vance-photo)**
   - Editorial portfolio of a fashion and fine art photographer based in Paris and Milan.
   - *Features*: Photo showcase with full-screen lightbox, categorized collections (Fashion, Portrait, Architecture), custom services, photoshoot booking form.
   - *Design*: Minimalist monochrome and gold editorial aesthetic, refined serif typography, crisp square cards.

4. **🚀 [Tech & Innovation Summit 2026](http://localhost:3001/site/sommet-tech-2026)**
   - Premier European conference for deep tech, generative AI, and quantum computing.
   - *Features*: **Live real-time ticking countdown timer**, keynote speakers grid, conference statistics, pass pricing tiers, newsletter subscription bar, sponsor and press contact form.
   - *Design*: Vibrant purple & pink theme, modern Space Grotesk typography.

---

## 🛠️ Application Features

### 1. Dashboard
- Comprehensive overview of all created sites with live thumbnail preview, last modified date, and publication status (Published / Draft).
- **One-Click Actions**:
  - 👁️ **Visit**: Opens the live hosted site (`/site/:slug`) in a new tab.
  - ✏️ **Edit**: Opens the visual WYSIWYG editor.
  - 📬 **Inbox**: View all contact messages and leads received via the site's forms, with an unread badge indicator.
  - 📋 **Duplicate**: Instantly clone an existing site.
  - 📥 **Export to ZIP**: Download a standalone, zero-dependency ZIP archive (`index.html` + assets) ready to be opened in any browser or hosted anywhere.
  - 🗑️ **Delete**: Safe removal with confirmation.
  - 🔄 **Restore Demos**: Reset the 4 official showcase websites at any time.

### 2. Intuitive Visual Editor (WYSIWYG)
- **Responsive Viewport Switcher**:
  - 💻 **Desktop** (100%)
  - 📱 **Tablet** (768px)
  - 📱 **Mobile** (375px)
- **Preview / Edit Mode**: Toggle instantly between editor controls and a clean visitor browsing preview.
- **Undo / Redo History Stack**: Experiment freely with full state rollback.
- **Rich Section Library**:
  - Navbar / Header with sticky branding, nav links, and CTA button.
  - Hero section (Split layout, Centered, Fullscreen background).
  - Features & Services grid (2, 3, or 4 columns).
  - About / Story section (Left or right image with key bullet points).
  - Photo Gallery with full-screen lightbox modal.
  - Restaurant Menu / Service catalog with prices, descriptions, and tags.
  - Pricing tables with interactive monthly / yearly billing toggle.
  - Testimonials & Customer reviews with star ratings and avatars.
  - Interactive FAQ accordion.
  - Live Countdown Timer (Days / Hours / Minutes / Seconds).
  - Key Statistics / Numbers counter.
  - Contact & Lead generation form.
  - Newsletter subscription bar.
  - Call-to-action (CTA) banner.
  - Footer with social media links and copyright notice.
- **Media & Image Picker**:
  - Curated royalty-free high-resolution Unsplash photo library categorized by themes (Food, Tech, Fashion, Events, Nature).
  - Local image file upload directly to disk (`uploads/` folder).
  - Direct external URL input.
- **Theme & Design Customization**:
  - Pre-built harmonized color palettes.
  - Custom color pickers (Primary, Accent, Background, Text).
  - Curated Google Fonts typography pairings (Inter, Playfair Display, Outfit, Space Grotesk, Plus Jakarta Sans).
  - Border radius customization (Square, Subtle, Modern, Rounded).

### 3. Local Hosting & Real Inbox
- Every site is served locally by the application on `http://localhost:3001/site/:slug`.
- Contact and booking forms actively submit data to the local server without third-party dependencies.
- Site owners can view all received inquiries in the **Local Inbox** (name, email, phone, requested service, message, timestamp) with quick email reply links.

---

## 📁 Project Architecture

```
site-builder/
├── data/
│   ├── sites.json          # Persisted site configurations and sections
│   └── submissions.json    # Received form submissions and contact leads
├── uploads/                # Locally uploaded image files
├── server/
│   ├── index.js            # Express server (API, local site host, SPA static fallback)
│   ├── db.js               # File-based JSON persistence layer with slug generation
│   ├── seedSites.js        # Detailed data for the 4 showcase demo sites
│   ├── siteRenderer.js     # Standalone responsive HTML/CSS/JS renderer for hosted sites & exports
│   └── routes/
│       ├── sites.js        # CRUD, duplicate, and standalone ZIP export routes
│       ├── submit.js       # Form submission handling and inbox API
│       └── upload.js       # Local image upload handler (Multer)
├── client/                 # React + Vite + Tailwind CSS frontend
│   ├── src/
│   │   ├── components/     # UI components, modals, editor drawer
│   │   ├── pages/          # Dashboard and visual Editor pages
│   │   └── data/           # Theme palettes and curated stock images
│   └── dist/               # Compiled client bundle served by Express
└── README.md
```
