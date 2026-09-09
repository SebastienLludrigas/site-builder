// Server-side HTML renderer for hosted sites and ZIP exports

export function renderSiteHtml(site, isExport = false) {
  const { title, description, theme, settings, sections, slug } = site;
  const t = theme || {};
  const s = settings || {};

  const primaryColor = t.primaryColor || '#4f46e5';
  const secondaryColor = t.secondaryColor || '#1e1b4b';
  const accentColor = t.accentColor || '#06b6d4';
  const bgColor = t.backgroundColor || '#ffffff';
  const textColor = t.textColor || '#0f172a';
  const fontHeading = t.fontHeading || 'Inter';
  const fontBody = t.fontBody || 'Inter';
  const favicon = s.favicon || '🌐';
  const heroImage = (sections || []).find(sec => sec.type === 'hero')?.data?.image || null;

  // Compute radius
  let radiusClass = '12px';
  if (t.borderRadius === 'rounded-none') radiusClass = '0px';
  if (t.borderRadius === 'rounded-lg') radiusClass = '8px';
  if (t.borderRadius === 'rounded-xl') radiusClass = '14px';
  if (t.borderRadius === 'rounded-2xl') radiusClass = '22px';
  if (t.borderRadius === 'rounded-full') radiusClass = '9999px';

  // Render individual sections
  const sectionsHtml = (sections || []).map(sec => renderSection(sec, { primaryColor, accentColor, bgColor, textColor, radiusClass, slug, isExport })).join('\n');

  return `<!DOCTYPE html>
<html lang="en" style="scroll-behavior: smooth;">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description || '')}">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${favicon}</text></svg>">

  <!-- Open Graph / social link previews -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description || '')}">
  <meta name="twitter:card" content="${heroImage ? 'summary_large_image' : 'summary'}">
  ${heroImage ? `<meta property="og:image" content="${escapeHtml(heroImage)}">\n  <meta name="twitter:image" content="${escapeHtml(heroImage)}">` : ''}
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --primary: ${primaryColor};
      --secondary: ${secondaryColor};
      --accent: ${accentColor};
      --bg: ${bgColor};
      --text: ${textColor};
      --radius: ${radiusClass};
      --font-heading: '${fontHeading}', sans-serif;
      --font-body: '${fontBody}', sans-serif;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      font-weight: 700;
      line-height: 1.25;
      color: var(--text);
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding-left: clamp(16px, 4vw, 32px);
      padding-right: clamp(16px, 4vw, 32px);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 600;
      border-radius: var(--radius);
      transition: all 0.2s ease;
      cursor: pointer;
      text-decoration: none;
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
      white-space: normal;
      text-align: center;
    }

    .btn-primary {
      background-color: var(--primary);
      color: #ffffff;
    }
    .btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.12);
    }

    .btn-secondary {
      background-color: rgba(125,125,125,0.12);
      color: var(--text);
      backdrop-filter: blur(8px);
    }
    .btn-secondary:hover {
      background-color: rgba(125,125,125,0.2);
      transform: translateY(-2px);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      background-color: rgba(125,125,125,0.1);
      color: var(--primary);
      border: 1px solid rgba(125,125,125,0.15);
      margin-bottom: 16px;
      letter-spacing: 0.02em;
    }

    .section-padding {
      padding-top: clamp(48px, 8vw, 84px);
      padding-bottom: clamp(48px, 8vw, 84px);
    }

    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto clamp(32px, 5vw, 56px) auto;
    }
    .section-header h2 {
      font-size: clamp(1.75rem, 3.5vw + 0.5rem, 2.5rem);
      margin-bottom: 14px;
      letter-spacing: -0.02em;
      word-break: break-word;
    }
    .section-header p {
      font-size: clamp(0.95rem, 1.5vw + 0.2rem, 1.15rem);
      opacity: 0.8;
      line-height: 1.6;
    }

    /* Cards */
    .card {
      background: rgba(125,125,125,0.05);
      border: 1px solid rgba(125,125,125,0.12);
      border-radius: var(--radius);
      padding: clamp(20px, 3.5vw, 32px);
      transition: all 0.25s ease;
      word-break: break-word;
    }
    .card:hover {
      border-color: rgba(125,125,125,0.25);
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.06);
    }

    /* Responsive Grid Layouts */
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 28px;
    }

    @media (max-width: 960px) {
      .grid-3 {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
      .grid-4 {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }
    }
    @media (max-width: 640px) {
      .grid-3, .grid-2 {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      .grid-4 {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }
    @media (max-width: 440px) {
      .grid-4 {
        grid-template-columns: 1fr;
      }
    }

    /* Navbar */
    .nav-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background-color: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid rgba(125,125,125,0.15);
      transition: all 0.2s ease;
    }
    body[data-dark="true"] .nav-bar {
      background-color: rgba(15, 23, 42, 0.9);
    }
    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: clamp(60px, 8vw, 72px);
    }
    .nav-logo {
      font-size: clamp(18px, 3vw, 22px);
      font-weight: 700;
      font-family: var(--font-heading);
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 24px;
      list-style: none;
    }
    .nav-link {
      font-size: 14px;
      font-weight: 500;
      opacity: 0.85;
      transition: opacity 0.2s, color 0.2s;
    }
    .nav-link:hover {
      opacity: 1;
      color: var(--primary);
    }
    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: var(--text);
      border-radius: 8px;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
    }
    .mobile-menu-btn:hover {
      background: rgba(125,125,125,0.1);
    }
    @media (max-width: 860px) {
      .nav-links, .nav-cta {
        display: none !important;
      }
      .mobile-menu-btn {
        display: flex !important;
      }
    }
    .mobile-drawer {
      display: none;
      flex-direction: column;
      padding: 20px 24px;
      background: var(--bg);
      border-bottom: 1px solid rgba(125,125,125,0.15);
      gap: 16px;
      animation: fadeIn 0.2s ease-out forwards;
    }
    .mobile-drawer.open {
      display: flex;
    }
    .mobile-drawer .nav-link {
      padding: 8px 0;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid rgba(125,125,125,0.1);
    }
    .mobile-drawer .btn {
      width: 100%;
      margin-top: 4px;
    }

    /* About Responsive Grid */
    .about-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: clamp(24px, 4vw, 48px);
      align-items: center;
    }
    .about-grid.image-left {
      grid-template-columns: 0.9fr 1.1fr;
    }
    .about-image-wrapper {
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 16px 32px rgba(0,0,0,0.1);
    }
    .about-image-wrapper img {
      width: 100%;
      height: clamp(240px, 35vw, 420px);
      object-fit: cover;
    }
    @media (max-width: 860px) {
      .about-grid, .about-grid.image-left {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      .about-grid.image-left .about-image-wrapper {
        order: 2;
      }
    }

    /* Contact Responsive Grid */
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: clamp(24px, 4vw, 48px);
      max-width: 1040px;
      margin: 0 auto;
    }
    .contact-inputs-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 860px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 28px;
      }
    }
    @media (max-width: 520px) {
      .contact-inputs-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
    }

    /* Newsletter Responsive Form */
    .newsletter-form {
      display: flex;
      gap: 12px;
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }
    @media (max-width: 540px) {
      .newsletter-form {
        flex-direction: column;
      }
      .newsletter-form .btn {
        width: 100%;
      }
    }

    /* Menu item responsive */
    .menu-item-card {
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    @media (max-width: 480px) {
      .menu-item-card {
        flex-direction: column;
        gap: 8px;
      }
    }

    /* Footer responsive */
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }
    @media (max-width: 640px) {
      .footer-content {
        flex-direction: column;
        text-align: center;
        align-items: center;
      }
      .footer-content > div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .footer-content p {
        text-align: center;
      }
    }

    /* Hero */
    .hero-split {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 48px;
      align-items: center;
      min-height: 80vh;
      padding: 60px 0;
    }
    .hero-centered {
      text-align: center;
      max-width: 860px;
      margin: 0 auto;
      min-height: 75vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 80px 0 60px 0;
    }
    .hero-full-bg {
      position: relative;
      min-height: 85vh;
      display: flex;
      align-items: center;
      background-size: cover;
      background-position: center;
      color: #ffffff;
      padding: 100px 0;
    }
    .hero-full-bg::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%);
    }
    .hero-full-bg .container {
      position: relative;
      z-index: 2;
    }
    .hero-title {
      font-size: clamp(2.2rem, 5vw + 0.5rem, 3.5rem);
      font-weight: 800;
      letter-spacing: -0.025em;
      line-height: 1.15;
      margin-bottom: 20px;
      word-break: break-word;
    }
    .hero-subtitle {
      font-size: clamp(1rem, 2vw + 0.2rem, 1.25rem);
      opacity: 0.85;
      margin-bottom: 32px;
      line-height: 1.6;
    }
    .hero-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    .hero-image-wrapper {
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    }
    .hero-image-wrapper img {
      width: 100%;
      height: clamp(240px, 40vw, 480px);
      object-fit: cover;
    }
    @media (max-width: 960px) {
      .hero-split {
        grid-template-columns: 1fr;
        min-height: auto;
        padding: 40px 0;
        gap: 32px;
      }
    }
    @media (max-width: 640px) {
      .hero-split {
        padding: 24px 0;
        gap: 24px;
      }
      .hero-buttons {
        flex-direction: column;
        width: 100%;
      }
      .hero-buttons .btn {
        width: 100%;
      }
      .hero-centered {
        padding: 48px 0 32px 0;
        min-height: auto;
      }
      .hero-full-bg {
        padding: 64px 0;
        min-height: auto;
      }
    }

    /* Accordion / FAQ */
    .faq-item {
      border: 1px solid rgba(125,125,125,0.15);
      border-radius: var(--radius);
      margin-bottom: 12px;
      overflow: hidden;
      background: rgba(125,125,125,0.03);
    }
    .faq-question {
      width: 100%;
      padding: 20px 24px;
      text-align: left;
      background: none;
      border: none;
      font-size: 17px;
      font-weight: 600;
      color: var(--text);
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .faq-question:hover {
      background: rgba(125,125,125,0.05);
    }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      padding: 0 24px;
      opacity: 0.85;
      line-height: 1.6;
    }
    .faq-item.active .faq-answer {
      max-height: 500px;
      padding-bottom: 20px;
    }
    .faq-icon {
      transition: transform 0.25s ease;
      flex-shrink: 0;
    }
    .faq-item.active .faq-icon {
      transform: rotate(180deg);
    }

    /* Pricing */
    .pricing-card {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .pricing-card.popular {
      border-color: var(--primary);
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transform: scale(1.03);
    }
    @media (max-width: 960px) {
      .pricing-card.popular {
        transform: none;
      }
      .pricing-grid {
        grid-template-columns: 1fr;
        max-width: 440px;
        margin-left: auto;
        margin-right: auto;
      }
    }
    .popular-tag {
      position: absolute;
      top: -12px;
      right: 24px;
      background: var(--primary);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 12px;
      border-radius: 9999px;
    }
    .price-value {
      font-size: 42px;
      font-weight: 800;
      margin: 16px 0;
      font-family: var(--font-heading);
    }
    .price-period {
      font-size: 14px;
      font-weight: 400;
      opacity: 0.7;
    }

    /* Countdown */
    .countdown-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      max-width: 580px;
      margin: 32px auto;
    }
    .countdown-box {
      background: rgba(125,125,125,0.08);
      border: 1px solid rgba(125,125,125,0.15);
      border-radius: var(--radius);
      padding: clamp(14px, 2.5vw, 20px);
      text-align: center;
    }
    .countdown-number {
      font-size: clamp(28px, 6vw, 44px);
      font-weight: 800;
      font-family: var(--font-heading);
      color: var(--primary);
      line-height: 1;
    }
    .countdown-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.7;
      margin-top: 8px;
    }
    @media (max-width: 640px) {
      .countdown-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        max-width: 320px;
      }
    }

    /* Stats fluid font */
    .stats-number {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 800;
      font-family: var(--font-heading);
      color: var(--primary);
      line-height: 1;
    }

    /* Forms */
    .form-group {
      margin-bottom: 18px;
    }
    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 6px;
      opacity: 0.9;
    }
    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid rgba(125,125,125,0.2);
      border-radius: var(--radius);
      background: rgba(125,125,125,0.04);
      color: var(--text);
      font-size: 15px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus, .form-textarea:focus, .form-select:focus {
      border-color: var(--primary);
      background: rgba(125,125,125,0.08);
    }
    .form-textarea {
      min-height: 120px;
      resize: vertical;
    }

    /* Toast Notification */
    .site-toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #10b981;
      color: #fff;
      padding: 14px 22px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s ease;
      z-index: 1000;
    }
    .site-toast.show {
      transform: translateY(0);
      opacity: 1;
    }

    /* Lightbox modal */
    .lightbox-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.85);
      z-index: 200;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .lightbox-modal.active {
      display: flex;
    }
    .lightbox-img {
      max-width: 90vw;
      max-height: 85vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .lightbox-close {
      position: absolute;
      top: 24px;
      right: 24px;
      color: #fff;
      font-size: 32px;
      background: none;
      border: none;
      cursor: pointer;
    }

    /* Local badge */
    .sitecraft-badge {
      position: fixed;
      bottom: 16px;
      left: 16px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      z-index: 90;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 1px solid rgba(255,255,255,0.1);
      transition: transform 0.2s;
    }
    .sitecraft-badge:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body data-dark="${isColorDark(bgColor) ? 'true' : 'false'}">

  ${sectionsHtml}

  ${s.showBranding !== false ? `
  <a href="/" class="sitecraft-badge" title="Built with SiteCraft">
    <span>✨ Built with <strong>SiteCraft</strong></span>
  </a>
  ` : ''}

  <div id="siteToast" class="site-toast">Message sent successfully!</div>

  <!-- Lightbox Modal -->
  <div id="lightboxModal" class="lightbox-modal" onclick="closeLightbox()">
    <button class="lightbox-close" onclick="closeLightbox()">&times;</button>
    <img id="lightboxImg" class="lightbox-img" src="" alt="Preview">
  </div>

  <script>
    // Mobile navigation toggle
    function toggleMobileMenu() {
      const drawer = document.getElementById('mobileDrawer');
      if (drawer) {
        drawer.classList.toggle('open');
      }
    }

    // FAQ Accordion
    function toggleFaq(button) {
      const item = button.closest('.faq-item');
      item.classList.toggle('active');
    }

    // Lightbox
    function openLightbox(src) {
      const modal = document.getElementById('lightboxModal');
      const img = document.getElementById('lightboxImg');
      if (modal && img) {
        img.src = src;
        modal.classList.add('active');
      }
    }
    function closeLightbox() {
      const modal = document.getElementById('lightboxModal');
      if (modal) modal.classList.remove('active');
    }

    // Pricing toggle (monthly / yearly)
    function togglePricingPeriod(isYearly) {
      document.querySelectorAll('[data-price-monthly]').forEach(el => {
        const monthly = el.getAttribute('data-price-monthly');
        const yearly = el.getAttribute('data-price-yearly');
        el.textContent = isYearly ? yearly : monthly;
      });
      document.querySelectorAll('.pricing-btn-period').forEach(btn => {
        btn.classList.toggle('active');
      });
    }

    // Countdown Timer logic
    document.querySelectorAll('[data-countdown-target]').forEach(wrapper => {
      const targetStr = wrapper.getAttribute('data-countdown-target');
      const targetDate = new Date(targetStr).getTime();

      function updateCountdown() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
          wrapper.innerHTML = "<div style='font-size: 20px; font-weight: 700; color: var(--primary);'>The event has started!</div>";
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const dEl = wrapper.querySelector('.cd-days');
        const hEl = wrapper.querySelector('.cd-hours');
        const mEl = wrapper.querySelector('.cd-minutes');
        const sEl = wrapper.querySelector('.cd-seconds');

        if (dEl) dEl.textContent = String(days).padStart(2, '0');
        if (hEl) hEl.textContent = String(hours).padStart(2, '0');
        if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
        if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
      }

      updateCountdown();
      setInterval(updateCountdown, 1000);
    });

    // Contact Form AJAX Handler
    function handleSiteFormSubmit(event, siteSlug) {
      event.preventDefault();
      const form = event.target;
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Send';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
      }

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => { payload[key] = value; });

      fetch('/api/submit/' + siteSlug, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
        form.reset();
        showToast(data.message || 'Your message has been sent successfully!');
      })
      .catch(err => {
        console.error(err);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
        showToast('Message saved locally!');
      });
    }

    function showToast(msg) {
      const toast = document.getElementById('siteToast');
      if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 4000);
      }
    }
  </script>
</body>
</html>`;
}

function renderSection(section, ctx) {
  const { type, data } = section;
  const d = data || {};

  switch (type) {
    case 'navbar':
      return renderNavbar(d, ctx);
    case 'hero':
      return renderHero(d, ctx);
    case 'features':
      return renderFeatures(d, ctx);
    case 'about':
      return renderAbout(d, ctx);
    case 'gallery':
      return renderGallery(d, ctx);
    case 'menu':
      return renderMenu(d, ctx);
    case 'pricing':
      return renderPricing(d, ctx);
    case 'testimonials':
      return renderTestimonials(d, ctx);
    case 'faq':
      return renderFaq(d, ctx);
    case 'countdown':
      return renderCountdown(d, ctx);
    case 'stats':
      return renderStats(d, ctx);
    case 'contact':
      return renderContact(d, ctx);
    case 'newsletter':
      return renderNewsletter(d, ctx);
    case 'ctaBanner':
      return renderCtaBanner(d, ctx);
    case 'footer':
      return renderFooter(d, ctx);
    default:
      return `<!-- Section type ${type} -->`;
  }
}

function renderNavbar(d, ctx) {
  const links = d.links || [];
  const cta = d.ctaButton || {};

  return `
  <nav class="nav-bar">
    <div class="container nav-container">
      <a href="#hero" class="nav-logo">
        ${escapeHtml(d.logoText || 'Site')}
      </a>
      <ul class="nav-links">
        ${links.map(l => `<li><a href="${escapeHtml(l.href)}" class="nav-link">${escapeHtml(l.label)}</a></li>`).join('')}
      </ul>
      ${cta.show !== false && cta.text ? `
        <div class="nav-cta">
          <a href="${escapeHtml(cta.href || '#contact')}" class="btn btn-primary" style="padding: 9px 18px; font-size: 14px;">
            ${escapeHtml(cta.text)}
          </a>
        </div>
      ` : ''}
      <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>
    </div>
    <div id="mobileDrawer" class="mobile-drawer">
      ${links.map(l => `<a href="${escapeHtml(l.href)}" class="nav-link" onclick="toggleMobileMenu()">${escapeHtml(l.label)}</a>`).join('')}
      ${cta.show !== false && cta.text ? `
        <a href="${escapeHtml(cta.href || '#contact')}" class="btn btn-primary" onclick="toggleMobileMenu()">
          ${escapeHtml(cta.text)}
        </a>
      ` : ''}
    </div>
  </nav>
  `;
}

function renderHero(d, ctx) {
  const layout = d.layout || 'split';

  if (layout === 'centered') {
    return `
    <section id="hero" class="section-padding">
      <div class="container hero-centered">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h1 class="hero-title">${escapeHtml(d.title || '')}</h1>
        <p class="hero-subtitle">${escapeHtml(d.subtitle || '')}</p>
        <div class="hero-buttons">
          ${d.primaryBtn?.text ? `<a href="${escapeHtml(d.primaryBtn.href || '#')}" class="btn btn-primary">${escapeHtml(d.primaryBtn.text)}</a>` : ''}
          ${d.secondaryBtn?.text ? `<a href="${escapeHtml(d.secondaryBtn.href || '#')}" class="btn btn-secondary">${escapeHtml(d.secondaryBtn.text)}</a>` : ''}
        </div>
        ${d.image ? `
        <div class="hero-image-wrapper" style="margin-top: 48px; width: 100%; max-width: 1000px;">
          <img src="${escapeHtml(d.image)}" alt="${escapeHtml(d.title || '')}" loading="eager">
        </div>
        ` : ''}
      </div>
    </section>
    `;
  }

  if (layout === 'full-bg') {
    return `
    <section id="hero" class="hero-full-bg" style="background-image: url('${escapeHtml(d.image || '')}');">
      <div class="container" style="text-align: center; max-width: 900px; margin: 0 auto;">
        ${d.badge ? `<span class="badge" style="background: rgba(255,255,255,0.2); color: #ffffff; border-color: rgba(255,255,255,0.3);">${escapeHtml(d.badge)}</span>` : ''}
        <h1 class="hero-title">${escapeHtml(d.title || '')}</h1>
        <p class="hero-subtitle">${escapeHtml(d.subtitle || '')}</p>
        <div class="hero-buttons" style="justify-content: center;">
          ${d.primaryBtn?.text ? `<a href="${escapeHtml(d.primaryBtn.href || '#')}" class="btn btn-primary">${escapeHtml(d.primaryBtn.text)}</a>` : ''}
          ${d.secondaryBtn?.text ? `<a href="${escapeHtml(d.secondaryBtn.href || '#')}" class="btn btn-secondary" style="background: rgba(255,255,255,0.2); color: #fff;">${escapeHtml(d.secondaryBtn.text)}</a>` : ''}
        </div>
      </div>
    </section>
    `;
  }

  // Default 'split'
  return `
  <section id="hero" class="section-padding">
    <div class="container hero-split">
      <div>
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h1 class="hero-title">${escapeHtml(d.title || '')}</h1>
        <p class="hero-subtitle">${escapeHtml(d.subtitle || '')}</p>
        <div class="hero-buttons">
          ${d.primaryBtn?.text ? `<a href="${escapeHtml(d.primaryBtn.href || '#')}" class="btn btn-primary">${escapeHtml(d.primaryBtn.text)}</a>` : ''}
          ${d.secondaryBtn?.text ? `<a href="${escapeHtml(d.secondaryBtn.href || '#')}" class="btn btn-secondary">${escapeHtml(d.secondaryBtn.text)}</a>` : ''}
        </div>
      </div>
      <div class="hero-image-wrapper">
        <img src="${escapeHtml(d.image || '')}" alt="${escapeHtml(d.title || '')}" loading="eager">
        ${d.statsBadge?.count ? `
        <div style="position: absolute; bottom: 20px; right: 20px; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 12px 20px; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
          <div style="font-size: 22px; font-weight: 800; color: var(--accent);">${escapeHtml(d.statsBadge.count)}</div>
          <div style="font-size: 12px; opacity: 0.9;">${escapeHtml(d.statsBadge.label)}</div>
        </div>
        ` : ''}
      </div>
    </div>
  </section>
  `;
}

function renderFeatures(d, ctx) {
  const items = d.items || [];
  const gridClass = d.layout === '4-cols' ? 'grid-4' : (d.layout === '2-cols' ? 'grid-2' : 'grid-3');

  return `
  <section id="features" class="section-padding" style="background: rgba(125,125,125,0.02);">
    <div class="container">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Features')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}
      </div>
      <div class="${gridClass}">
        ${items.map(item => `
          <div class="card">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(125,125,125,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--primary);">
              ${renderIcon(item.icon || 'Sparkles')}
            </div>
            <h3 style="font-size: 19px; margin-bottom: 10px;">${escapeHtml(item.title || '')}</h3>
            <p style="font-size: 14.5px; opacity: 0.8; line-height: 1.6;">${escapeHtml(item.description || '')}</p>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderAbout(d, ctx) {
  const bullets = d.bulletPoints || [];
  const isLeft = d.layout === 'image-left';

  return `
  <section id="about" class="section-padding">
    <div class="container">
      <div class="about-grid ${isLeft ? 'image-left' : 'image-right'}">
        ${isLeft ? `
        <div class="about-image-wrapper">
          <img src="${escapeHtml(d.image || '')}" alt="${escapeHtml(d.title || '')}" loading="lazy">
          ${d.highlightCard?.number ? `
          <div style="position: absolute; bottom: 20px; left: 20px; background: var(--primary); color: #fff; padding: 12px 20px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <div style="font-size: 24px; font-weight: 800; line-height: 1;">${escapeHtml(d.highlightCard.number)}</div>
            <div style="font-size: 11px; font-weight: 500; opacity: 0.9;">${escapeHtml(d.highlightCard.label)}</div>
          </div>
          ` : ''}
        </div>
        ` : ''}
        <div>
          ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
          <h2 style="font-size: clamp(1.75rem, 3.5vw, 2.25rem); margin-bottom: 20px; letter-spacing: -0.02em;">${escapeHtml(d.title || '')}</h2>
          <p style="font-size: 16px; opacity: 0.85; line-height: 1.7; margin-bottom: 24px;">${escapeHtml(d.text || '')}</p>
          ${bullets.length > 0 ? `
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px;">
            ${bullets.map(b => `
              <li style="display: flex; align-items: flex-start; gap: 10px; font-size: 15px;">
                <span style="color: var(--primary); font-size: 18px; line-height: 1;">✓</span>
                <span>${escapeHtml(b)}</span>
              </li>
            `).join('')}
          </ul>
          ` : ''}
        </div>
        ${!isLeft ? `
        <div class="about-image-wrapper">
          <img src="${escapeHtml(d.image || '')}" alt="${escapeHtml(d.title || '')}" loading="lazy">
          ${d.highlightCard?.number ? `
          <div style="position: absolute; bottom: 20px; right: 20px; background: var(--primary); color: #fff; padding: 12px 20px; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
            <div style="font-size: 24px; font-weight: 800; line-height: 1;">${escapeHtml(d.highlightCard.number)}</div>
            <div style="font-size: 11px; font-weight: 500; opacity: 0.9;">${escapeHtml(d.highlightCard.label)}</div>
          </div>
          ` : ''}
        </div>
        ` : ''}
      </div>
    </div>
  </section>
  `;
}

function renderGallery(d, ctx) {
  const items = d.items || [];
  const filters = d.filterCategories || [];

  return `
  <section id="gallery" class="section-padding" style="background: rgba(125,125,125,0.02);">
    <div class="container">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Gallery')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}
      </div>

      <div class="grid-3">
        ${items.map(item => `
          <div class="card" style="padding: 0; overflow: hidden; cursor: pointer;" onclick="openLightbox('${escapeHtml(item.image || '')}')">
            <div style="overflow: hidden; height: 260px;">
              <img src="${escapeHtml(item.image || '')}" alt="${escapeHtml(item.title || '')}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            </div>
            <div style="padding: 18px 20px;">
              ${item.category ? `<span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--primary); letter-spacing: 0.05em;">${escapeHtml(item.category)}</span>` : ''}
              <h3 style="font-size: 16px; margin-top: 4px;">${escapeHtml(item.title || '')}</h3>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderMenu(d, ctx) {
  const categories = d.categories || [];

  return `
  <section id="menu" class="section-padding">
    <div class="container">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Our Menu')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}
      </div>

      <div style="display: flex; flex-direction: column; gap: 48px;">
        ${categories.map(cat => `
          <div>
            <h3 style="font-size: 24px; margin-bottom: 24px; padding-bottom: 8px; border-bottom: 2px solid var(--primary); display: inline-block;">
              ${escapeHtml(cat.name)}
            </h3>
            <div class="grid-2">
              ${(cat.items || []).map(item => `
                <div class="card menu-item-card">
                  <div>
                    <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                      <h4 style="font-size: 17px;">${escapeHtml(item.name)}</h4>
                      ${item.tag ? `<span class="badge" style="margin-bottom: 0; padding: 2px 8px; font-size: 11px;">${escapeHtml(item.tag)}</span>` : ''}
                    </div>
                    <p style="font-size: 13.5px; opacity: 0.8; margin-top: 6px;">${escapeHtml(item.description || '')}</p>
                  </div>
                  <div style="font-size: 18px; font-weight: 700; color: var(--primary); white-space: nowrap;">
                    ${escapeHtml(item.price)}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderPricing(d, ctx) {
  const plans = d.plans || [];
  const hasToggle = d.hasPeriodToggle !== false;

  return `
  <section id="pricing" class="section-padding" style="background: rgba(125,125,125,0.02);">
    <div class="container">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Pricing')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}

        ${hasToggle ? `
        <div style="display: inline-flex; align-items: center; background: rgba(125,125,125,0.1); padding: 4px; border-radius: 9999px; margin-top: 24px;">
          <button type="button" class="btn btn-secondary pricing-btn-period active" onclick="togglePricingPeriod(false)" style="padding: 8px 18px; font-size: 13px; border-radius: 9999px; box-shadow: none;">Monthly</button>
          <button type="button" class="btn btn-secondary pricing-btn-period" onclick="togglePricingPeriod(true)" style="padding: 8px 18px; font-size: 13px; border-radius: 9999px; box-shadow: none; display: flex; align-items: center; gap: 6px;">
            <span>Yearly</span>
            <span style="background: var(--primary); color: #fff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 9999px;">${escapeHtml(d.yearlyDiscountText || '-20%')}</span>
          </button>
        </div>
        ` : ''}
      </div>

      <div class="grid-3 pricing-grid" style="align-items: stretch;">
        ${plans.map(p => `
          <div class="card pricing-card ${p.popular ? 'popular' : ''}">
            ${p.popular ? `<span class="popular-tag">Popular</span>` : ''}
            <h3 style="font-size: 22px;">${escapeHtml(p.name)}</h3>
            <p style="font-size: 14px; opacity: 0.8; margin-top: 4px; min-height: 40px;">${escapeHtml(p.description || '')}</p>
            
            <div class="price-value">
              <span data-price-monthly="${escapeHtml(p.priceMonthly)}" data-price-yearly="${escapeHtml(p.priceYearly || p.priceMonthly)}">${escapeHtml(p.priceMonthly)}</span>
              <span class="price-period"> / month</span>
            </div>

            <a href="${escapeHtml(p.buttonHref || '#contact')}" class="btn ${p.popular ? 'btn-primary' : 'btn-secondary'}" style="width: 100%; margin-bottom: 28px;">
              ${escapeHtml(p.buttonText || 'Get Started')}
            </a>

            <div style="border-top: 1px solid rgba(125,125,125,0.15); padding-top: 20px; margin-top: auto;">
              <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; opacity: 0.8;">Included in this plan:</div>
              <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
                ${(p.features || []).map(f => `
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--primary); font-weight: bold;">✓</span>
                    <span>${escapeHtml(f)}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderTestimonials(d, ctx) {
  const items = d.items || [];

  return `
  <section id="testimonials" class="section-padding">
    <div class="container">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Customer Reviews')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}
      </div>

      <div class="grid-3">
        ${items.map(item => `
          <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="color: #f59e0b; font-size: 18px; margin-bottom: 14px;">
                ${'★'.repeat(item.rating || 5)}
              </div>
              <p style="font-size: 15px; font-style: italic; opacity: 0.9; line-height: 1.6; margin-bottom: 24px;">
                « ${escapeHtml(item.quote || '')} »
              </p>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              ${item.avatar ? `<img src="${escapeHtml(item.avatar)}" alt="${escapeHtml(item.author || '')}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover;">` : ''}
              <div>
                <h4 style="font-size: 15px;">${escapeHtml(item.author || '')}</h4>
                <p style="font-size: 12px; opacity: 0.7;">${escapeHtml(item.role || '')}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderFaq(d, ctx) {
  const items = d.items || [];

  return `
  <section id="faq" class="section-padding">
    <div class="container" style="max-width: 800px;">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Frequently Asked Questions')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}
      </div>

      <div>
        ${items.map(item => `
          <div class="faq-item">
            <button class="faq-question" type="button" onclick="toggleFaq(this)">
              <span>${escapeHtml(item.question)}</span>
              <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <div class="faq-answer">
              <p>${escapeHtml(item.answer)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderCountdown(d, ctx) {
  return `
  <section id="countdown" class="section-padding" style="background: rgba(125,125,125,0.03); text-align: center;">
    <div class="container">
      ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
      <h2 style="font-size: 36px; margin-bottom: 12px;">${escapeHtml(d.title || 'Countdown Timer')}</h2>
      ${d.subtitle ? `<p style="font-size: 17px; opacity: 0.85;">${escapeHtml(d.subtitle)}</p>` : ''}

      <div class="countdown-grid" data-countdown-target="${escapeHtml(d.targetDate || '2026-12-31T00:00:00')}">
        <div class="countdown-box">
          <div class="countdown-number cd-days">00</div>
          <div class="countdown-label">Days</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-number cd-hours">00</div>
          <div class="countdown-label">Hours</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-number cd-minutes">00</div>
          <div class="countdown-label">Minutes</div>
        </div>
        <div class="countdown-box">
          <div class="countdown-number cd-seconds">00</div>
          <div class="countdown-label">Seconds</div>
        </div>
      </div>

      ${d.note ? `<p style="font-size: 14px; opacity: 0.8; margin-top: 16px;">${escapeHtml(d.note)}</p>` : ''}
      ${d.ctaButton?.text ? `
        <div style="margin-top: 24px;">
          <a href="${escapeHtml(d.ctaButton.href || '#pricing')}" class="btn btn-primary">${escapeHtml(d.ctaButton.text)}</a>
        </div>
      ` : ''}
    </div>
  </section>
  `;
}

function renderStats(d, ctx) {
  const items = d.items || [];

  return `
  <section id="stats" class="section-padding" style="border-top: 1px solid rgba(125,125,125,0.1); border-bottom: 1px solid rgba(125,125,125,0.1);">
    <div class="container">
      ${d.title ? `<h3 style="text-align: center; font-size: 20px; opacity: 0.85; margin-bottom: 40px;">${escapeHtml(d.title)}</h3>` : ''}
      <div class="grid-4 stats-grid" style="text-align: center;">
        ${items.map(item => `
          <div>
            <div class="stats-number">
              ${escapeHtml(item.number)}
            </div>
            <div style="font-size: 14px; opacity: 0.8; margin-top: 8px;">
              ${escapeHtml(item.label)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>
  `;
}

function renderContact(d, ctx) {
  const fields = d.formFields || ['name', 'email', 'message'];
  const services = d.servicesList || [];

  return `
  <section id="contact" class="section-padding">
    <div class="container">
      <div class="section-header">
        ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
        <h2>${escapeHtml(d.title || 'Contact Us')}</h2>
        ${d.subtitle ? `<p>${escapeHtml(d.subtitle)}</p>` : ''}
      </div>

      <div class="contact-grid">
        <div class="card" style="height: fit-content;">
          <h3 style="font-size: 20px; margin-bottom: 20px;">Contact Information</h3>
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${d.address ? `
              <div>
                <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.6;">Address</div>
                <div style="font-size: 15px; margin-top: 4px;">${escapeHtml(d.address)}</div>
              </div>
            ` : ''}
            ${d.phone ? `
              <div>
                <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.6;">Phone</div>
                <div style="font-size: 15px; margin-top: 4px;"><a href="tel:${escapeHtml(d.phone)}" style="color: var(--primary);">${escapeHtml(d.phone)}</a></div>
              </div>
            ` : ''}
            ${d.email ? `
              <div>
                <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.6;">Email</div>
                <div style="font-size: 15px; margin-top: 4px;"><a href="mailto:${escapeHtml(d.email)}" style="color: var(--primary);">${escapeHtml(d.email)}</a></div>
              </div>
            ` : ''}
            ${d.openingHours ? `
              <div>
                <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; opacity: 0.6;">Opening Hours</div>
                <div style="font-size: 15px; margin-top: 4px;">${escapeHtml(d.openingHours)}</div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="card">
          <form onsubmit="handleSiteFormSubmit(event, '${escapeHtml(ctx.slug)}')">
            ${fields.includes('name') ? `
              <div class="form-group">
                <label class="form-label" for="contact-name">Full Name *</label>
                <input type="text" id="contact-name" name="name" class="form-input" placeholder="Your name" required>
              </div>
            ` : ''}

            <div class="contact-inputs-row">
              ${fields.includes('email') ? `
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address *</label>
                  <input type="email" id="contact-email" name="email" class="form-input" placeholder="you@example.com" required>
                </div>
              ` : ''}
              ${fields.includes('phone') ? `
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone Number</label>
                  <input type="tel" id="contact-phone" name="phone" class="form-input" placeholder="+1 (555) 000-0000">
                </div>
              ` : ''}
            </div>

            ${fields.includes('service') && services.length > 0 ? `
              <div class="form-group">
                <label class="form-label" for="contact-service">Subject / Service</label>
                <select id="contact-service" name="service" class="form-select">
                  ${services.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('')}
                </select>
              </div>
            ` : ''}

            ${fields.includes('message') ? `
              <div class="form-group">
                <label class="form-label" for="contact-message">Your Message *</label>
                <textarea id="contact-message" name="message" class="form-textarea" placeholder="Tell us how we can help you..." required></textarea>
              </div>
            ` : ''}

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 8px;">
              ${escapeHtml(d.submitButtonText || 'Send Message')}
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
  `;
}

function renderNewsletter(d, ctx) {
  return `
  <section id="newsletter" class="section-padding" style="background: rgba(125,125,125,0.03);">
    <div class="container" style="max-width: 700px; text-align: center;">
      ${d.badge ? `<span class="badge">${escapeHtml(d.badge)}</span>` : ''}
      <h2 style="font-size: clamp(1.5rem, 3vw, 2rem); margin-bottom: 12px;">${escapeHtml(d.title || 'Stay in the Loop')}</h2>
      <p style="font-size: 16px; opacity: 0.85; margin-bottom: 28px;">${escapeHtml(d.subtitle || '')}</p>

      <form onsubmit="handleSiteFormSubmit(event, '${escapeHtml(ctx.slug)}')" class="newsletter-form">
        <input type="hidden" name="service" value="Newsletter">
        <input type="email" name="email" class="form-input" placeholder="${escapeHtml(d.placeholder || 'Your email address')}" required style="flex: 1;">
        <button type="submit" class="btn btn-primary" style="white-space: nowrap;">
          ${escapeHtml(d.buttonText || "Subscribe")}
        </button>
      </form>
      ${d.disclaimer ? `<p style="font-size: 12px; opacity: 0.6; margin-top: 12px;">${escapeHtml(d.disclaimer)}</p>` : ''}
    </div>
  </section>
  `;
}

function renderCtaBanner(d, ctx) {
  return `
  <section class="section-padding" style="background: var(--primary); color: #fff; text-align: center;">
    <div class="container" style="max-width: 800px;">
      <h2 style="color: #fff; font-size: clamp(1.75rem, 4vw, 2.25rem); margin-bottom: 16px;">${escapeHtml(d.title || "Take Action Today")}</h2>
      <p style="color: rgba(255,255,255,0.9); font-size: 18px; margin-bottom: 32px;">${escapeHtml(d.subtitle || '')}</p>
      <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
        ${d.buttonText ? `<a href="${escapeHtml(d.buttonHref || '#contact')}" class="btn" style="background: #fff; color: var(--primary); font-weight: 700;">${escapeHtml(d.buttonText)}</a>` : ''}
        ${d.secondaryButtonText ? `<a href="${escapeHtml(d.secondaryButtonHref || '#')}" class="btn" style="background: rgba(255,255,255,0.2); color: #fff;">${escapeHtml(d.secondaryButtonText)}</a>` : ''}
      </div>
    </div>
  </section>
  `;
}

function renderFooter(d, ctx) {
  const socials = d.socialLinks || [];

  return `
  <footer style="border-top: 1px solid rgba(125,125,125,0.15); padding: clamp(32px, 6vw, 50px) 0 30px 0; background: rgba(125,125,125,0.02);">
    <div class="container">
      <div class="footer-content">
        <div>
          <div style="font-size: 20px; font-weight: 700; font-family: var(--font-heading); margin-bottom: 6px;">
            ${escapeHtml(d.logoText || '')}
          </div>
          <p style="font-size: 13.5px; opacity: 0.7; max-width: 400px;">
            ${escapeHtml(d.description || '')}
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
          ${socials.map(s => `
            <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" style="font-size: 14px; font-weight: 500; opacity: 0.8; transition: opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
              ${escapeHtml(s.platform)}
            </a>
          `).join('')}
        </div>
      </div>

      <div style="border-top: 1px solid rgba(125,125,125,0.1); margin-top: 32px; padding-top: 24px; text-align: center; font-size: 13px; opacity: 0.6;">
        ${escapeHtml(d.copyright || 'All rights reserved.')}
      </div>
    </div>
  </footer>
  `;
}

function renderIcon(iconName) {
  // Simple clean SVG icon mapper
  switch (iconName) {
    case 'Wheat':
    case 'Coffee':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`;
    case 'Clock':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
    case 'Database':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`;
    case 'Cpu':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`;
    case 'ShieldCheck':
    case 'Shield':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>`;
    case 'Rocket':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path></svg>`;
    case 'Camera':
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;
    default:
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
  }
}

function isColorDark(hex) {
  if (!hex || !hex.startsWith('#')) return false;
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
