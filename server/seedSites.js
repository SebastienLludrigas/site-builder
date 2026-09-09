export const SEED_SITES = [
  {
    id: "site-patisserie-delice",
    title: "Atelier Pastry & Café Délice",
    slug: "patisserie-delice",
    description: "Artisanal French bakery, golden AOP butter pastries, and specialty coffee in Paris.",
    createdAt: "2026-09-01T08:00:00.000Z",
    updatedAt: "2026-09-09T17:30:00.000Z",
    published: true,
    theme: {
      palette: "amber",
      primaryColor: "#b45309",
      secondaryColor: "#78350f",
      accentColor: "#f59e0b",
      backgroundColor: "#fffbf5",
      textColor: "#292524",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
      borderRadius: "rounded-2xl"
    },
    settings: {
      favicon: "🥐",
      logoText: "Atelier Délice",
      showBranding: true,
      contactEmail: "hello@patisserie-delice.com"
    },
    sections: [
      {
        id: "nav-1",
        type: "navbar",
        data: {
          logoText: "Atelier Délice",
          logoIcon: "Croissant",
          links: [
            { label: "Home", href: "#hero" },
            { label: "Craft & Values", href: "#features" },
            { label: "Story", href: "#about" },
            { label: "Menu", href: "#menu" },
            { label: "Gallery", href: "#gallery" },
            { label: "Reviews", href: "#testimonials" },
            { label: "Contact", href: "#contact" }
          ],
          ctaButton: {
            show: true,
            text: "Book a Table",
            href: "#contact"
          }
        }
      },
      {
        id: "hero-1",
        type: "hero",
        data: {
          layout: "split",
          badge: "✨ Voted Best Croissant in Paris 2025",
          title: "The Art of Fine Pastry & Artisanal Coffee",
          subtitle: "Every dawn, we knead organic stone-ground flours and shape golden, flaky pastries enriched with pure Normandy AOP churn butter.",
          image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
          primaryBtn: { text: "Explore the Menu", href: "#menu" },
          secondaryBtn: { text: "Visit our Café", href: "#contact" },
          statsBadge: { count: "100%", label: "Organic & Artisanal" }
        }
      },
      {
        id: "features-1",
        type: "features",
        data: {
          badge: "Craftsmanship",
          title: "Our Artisanal Commitments",
          subtitle: "A passion for authentic flavor, with zero compromise on the quality of our ingredients.",
          layout: "4-cols",
          items: [
            {
              icon: "Wheat",
              title: "100% Organic Flours",
              description: "Stone-ground by our partner miller in the Parisian countryside for nutrient-rich flavor."
            },
            {
              icon: "Clock",
              title: "10-Year Live Sourdough",
              description: "Slow 24-hour natural fermentation for effortless digestibility and deep aromatic complexity."
            },
            {
              icon: "Sparkles",
              title: "AOP Churn Butter",
              description: "Pure Charentes-Poitou and Normandy butter delivering an incomparably crisp, golden lamination."
            },
            {
              icon: "Coffee",
              title: "Specialty Coffee",
              description: "Ethically sourced organic beans, freshly roasted in Paris every single week."
            }
          ]
        }
      },
      {
        id: "about-1",
        type: "about",
        data: {
          layout: "image-right",
          badge: "Our Story",
          title: "Two Generations of Passion for Flaky Crusts",
          text: "Founded in 2012 by pastry chef Julien Martin, Atelier Délice was born from a simple desire: bring true delight back to Parisian mornings and teatimes with delicacies baked right before your eyes, honoring timeless French bakery traditions.",
          bulletPoints: [
            "Daily live sourdough nurtured with pure filtered water and raw local honey",
            "Continuous baking throughout the day for warm, crispy baguettes anytime you visit",
            "Sunlit tea room and leafy courtyard terrace nestled in the heart of the 9th arrondissement"
          ],
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
          highlightCard: {
            number: "14",
            label: "Years of Excellence"
          }
        }
      },
      {
        id: "menu-1",
        type: "menu",
        data: {
          badge: "Delicacies",
          title: "Our Signature Creations",
          subtitle: "Handcrafted fresh every morning in our open bakery workshop.",
          categories: [
            {
              name: "Artisanal Viennoiserie",
              items: [
                { name: "Pure Butter Croissant", description: "Caramelized puff pastry, delicate crunch, and tender honeycomb crumb", price: "€2.20", tag: "Bestseller" },
                { name: "Hazelnut Praline Pain au Chocolat", description: "Three batons of 65% dark chocolate and house-made roasted praline core", price: "€2.80" },
                { name: "Cardamom & Raw Sugar Bun", description: "Nordic-inspired delicacy reimagined with rich caramelized AOP churn butter", price: "€3.50", tag: "Chef's Pick" },
                { name: "Orange Blossom Brioche", description: "Pillowy and golden, crowned with crunchy pearl sugar crystals", price: "€3.90" }
              ]
            },
            {
              name: "Fine Haute Pastry",
              items: [
                { name: "Raspberry & Pistachio Tartlet", description: "Crisp shortcrust, velvety Iranian pistachio ganache, fresh handpicked berries", price: "€6.50", tag: "Signature" },
                { name: "72% Dark Chocolate Craquelin Éclair", description: "Tender choux pastry, intense Guanaja chocolate cream, mirror glaze", price: "€5.40" },
                { name: "Piedmont Hazelnut Paris-Brest", description: "Flowing pure praline center, airy mousseline, and roasted hazelnut crunch", price: "€6.80" },
                { name: "Bourbon Vanilla Millefeuille", description: "Caramelized inverted puff pastry and rich Madagascar vanilla diplomate cream", price: "€7.00" }
              ]
            },
            {
              name: "Coffee & Hot Beverages",
              items: [
                { name: "Organic Oat Milk Flat White", description: "Double shot espresso blend from Ethiopia/Colombia with velvety microfoam", price: "€4.50" },
                { name: "House Spiced Artisan Chai Latte", description: "Organic black tea infused with ginger, cinnamon, black pepper, and cardamom", price: "€4.80" },
                { name: "Valrhona Grand Cru Hot Chocolate", description: "70% single-origin melted dark chocolate topped with fresh Bourbon chantilly", price: "€5.20" }
              ]
            }
          ]
        }
      },
      {
        id: "gallery-1",
        type: "gallery",
        data: {
          badge: "Photo Journal",
          title: "Moments from the Workshop",
          subtitle: "A daily glimpse of our fresh bakes and warm tea room atmosphere.",
          layout: "grid",
          items: [
            {
              image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
              title: "Freshly baked morning croissants",
              category: "Viennoiserie"
            },
            {
              image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
              title: "Modern dark chocolate gateau",
              category: "Pastry"
            },
            {
              image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
              title: "Stone-ground rustic sourdough loaves",
              category: "Bakery"
            },
            {
              image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
              title: "Specialty espresso extraction",
              category: "Coffee"
            },
            {
              image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
              title: "Sunlit tea room interior",
              category: "Ambiance"
            },
            {
              image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
              title: "Fresh strawberry tartlets",
              category: "Pastry"
            }
          ]
        }
      },
      {
        id: "testimonials-1",
        type: "testimonials",
        data: {
          badge: "Testimonials",
          title: "What Our Regulars Say",
          subtitle: "Over 1,200 five-star reviews from neighborhood food lovers and travelers.",
          items: [
            {
              author: "Camille Dupont",
              role: "Local Food Critic",
              rating: 5,
              quote: "Their AOP butter croissant is simply the best I have tasted anywhere in Paris in ten years. Crispy and golden outside, airy and melting within!",
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
            },
            {
              author: "Thomas Laurent",
              role: "Architect & Daily Regular",
              rating: 5,
              quote: "I come by every morning to work for an hour in the tea room. Bright atmosphere, cheerful staff, and the flat white is pulled to pure perfection.",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
            },
            {
              author: "Sophie de Montmirail",
              role: "Loyal Patron since 2018",
              rating: 5,
              quote: "We order every family celebration cake here. The raspberry-pistachio tart was an absolute sensation among our 30 party guests last weekend.",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
            }
          ]
        }
      },
      {
        id: "contact-1",
        type: "contact",
        data: {
          badge: "Reservations & Orders",
          title: "Visit Us or Place an Order",
          subtitle: "For bespoke celebration cakes or weekend brunch table reservations, drop us a line or visit in person.",
          address: "28 Rue des Martyrs, 75009 Paris, France",
          phone: "+33 1 42 68 90 12",
          email: "hello@patisserie-delice.com",
          openingHours: "Tuesday to Sunday: 7:30 AM – 7:30 PM (Closed Mondays)",
          formFields: ["name", "email", "phone", "service", "message"],
          servicesList: ["Brunch Table Reservation", "Custom Celebration Cake", "Private Event / Catering", "General Inquiry"],
          submitButtonText: "Send My Request",
          successMessage: "Thank you for your message! Our pastry chef will reply within a few hours."
        }
      },
      {
        id: "footer-1",
        type: "footer",
        data: {
          logoText: "Atelier Délice",
          description: "Artisanal French bakery, fine pastry, and organic specialty tea room in Paris 9th. Handcrafted with passion every single day.",
          socialLinks: [
            { platform: "Instagram", url: "https://instagram.com" },
            { platform: "Facebook", url: "https://facebook.com" },
            { platform: "TikTok", url: "https://tiktok.com" }
          ],
          copyright: "© 2026 Atelier Délice Paris. All rights reserved."
        }
      }
    ]
  },
  {
    id: "site-novapulse-ai",
    title: "NovaPulse AI — Augmented Intelligence Platform",
    slug: "novapulse-ai",
    description: "Next-generation analytics SaaS: real-time predictive models and conversational AI copilot for modern teams.",
    createdAt: "2026-09-02T11:00:00.000Z",
    updatedAt: "2026-09-09T18:15:00.000Z",
    published: true,
    theme: {
      palette: "indigo",
      primaryColor: "#6366f1",
      secondaryColor: "#0f172a",
      accentColor: "#06b6d4",
      backgroundColor: "#090d16",
      textColor: "#f8fafc",
      fontHeading: "Outfit",
      fontBody: "Inter",
      borderRadius: "rounded-xl"
    },
    settings: {
      favicon: "⚡",
      logoText: "NovaPulse AI",
      showBranding: true,
      contactEmail: "contact@novapulse.ai"
    },
    sections: [
      {
        id: "nav-2",
        type: "navbar",
        data: {
          logoText: "NovaPulse AI",
          logoIcon: "Zap",
          links: [
            { label: "Product", href: "#hero" },
            { label: "Performance", href: "#stats" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
            { label: "FAQ", href: "#faq" },
            { label: "Contact", href: "#contact" }
          ],
          ctaButton: {
            show: true,
            text: "Start Free Trial",
            href: "#pricing"
          }
        }
      },
      {
        id: "hero-2",
        type: "hero",
        data: {
          layout: "centered",
          badge: "⚡ NovaPulse 3.5 — Multimodal Inference Models Active",
          title: "Transform Raw Data Streams into Instant Strategic Decisions",
          subtitle: "Connect your databases, CRM, and cloud workspaces. NovaPulse automatically spots key anomalies, compiles executive briefings, and answers complex queries in plain natural language.",
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          primaryBtn: { text: "Start 14-Day Free Trial", href: "#pricing" },
          secondaryBtn: { text: "Book an Architecture Demo", href: "#contact" },
          statsBadge: { count: "99.98%", label: "Guaranteed Uptime" }
        }
      },
      {
        id: "stats-2",
        type: "stats",
        data: {
          title: "Battle-Tested Analytics Power at Global Scale",
          items: [
            { number: "10x", label: "Time saved synthesizing cross-platform data" },
            { number: "99.9%", label: "Model precision across structured extractions" },
            { number: "500+", label: "Fast-scaling tech companies & teams connected" },
            { number: "< 45ms", label: "Average inference latency per analytical query" }
          ]
        }
      },
      {
        id: "features-2",
        type: "features",
        data: {
          badge: "Technology",
          title: "An Infrastructure Engineered for Velocity",
          subtitle: "Deploy enterprise generative AI capabilities once reserved for hyperscalers in under 15 minutes.",
          layout: "3-cols",
          items: [
            {
              icon: "Database",
              title: "Universal Connectors",
              description: "1-click native integrations with PostgreSQL, Snowflake, BigQuery, Notion, Stripe, and HubSpot."
            },
            {
              icon: "Cpu",
              title: "RAG & Semantic Retrieval",
              description: "Query PDF archives, contracts, and conversation logs with exact source citations on every token."
            },
            {
              icon: "ShieldCheck",
              title: "SOC2 & GDPR Compliant",
              description: "Sovereign European cloud hosting, AES-256 end-to-end encryption, and strict zero data retention training."
            },
            {
              icon: "TrendingUp",
              title: "Proactive Anomaly Alerts",
              description: "Instant intelligent notifications the moment revenue metrics or churn signals deviate from baseline models."
            },
            {
              icon: "Layers",
              title: "Automated Workflows",
              description: "Build intelligent trigger-action chains based on custom KPI thresholds and automated schedules."
            },
            {
              icon: "Terminal",
              title: "REST API & Webhooks",
              description: "Control NovaPulse programmatically with our thoroughly documented Python and TypeScript SDKs."
            }
          ]
        }
      },
      {
        id: "pricing-2",
        type: "pricing",
        data: {
          badge: "Investment",
          title: "Transparent, Predictable Pricing for High-Growth Teams",
          subtitle: "Start your 14-day risk-free trial with zero upfront commitment. Scale seamlessly as your data evolves.",
          hasPeriodToggle: true,
          plans: [
            {
              name: "Starter",
              priceMonthly: "$49 /mo",
              priceYearly: "$39 /mo",
              description: "Perfect for early-stage startups and agile engineering squads.",
              popular: false,
              buttonText: "Start Free Starter Trial",
              buttonHref: "#contact",
              features: [
                "Up to 5 team members",
                "5,000,000 data tokens / month",
                "3 universal database connectors",
                "Automated weekly executive digest",
                "Standard email support (24h SLA)"
              ]
            },
            {
              name: "Professional",
              priceMonthly: "$149 /mo",
              priceYearly: "$119 /mo",
              description: "Our most popular package for scaling data, product, and ops teams.",
              popular: true,
              buttonText: "Start Free Pro Trial",
              buttonHref: "#contact",
              features: [
                "Up to 25 team members",
                "50,000,000 data tokens / month",
                "Unlimited data connectors",
                "Sub-second RAG retrieval engine",
                "Real-time custom anomaly alerts",
                "Full REST API & webhook access",
                "Priority support with shared Slack channel"
              ]
            },
            {
              name: "Enterprise",
              priceMonthly: "$499 /mo",
              priceYearly: "$399 /mo",
              description: "Dedicated infrastructure, custom model weights, and guaranteed enterprise SLAs.",
              popular: false,
              buttonText: "Talk to Solutions Team",
              buttonHref: "#contact",
              features: [
                "Unlimited team seats",
                "Dedicated private VPC deployment",
                "Custom fine-tuning on internal corpus",
                "99.99% uptime SLA guarantee",
                "Dedicated solutions architect & 24/7 hotline",
                "SSO / SAML authentication & compliance audits"
              ]
            }
          ]
        }
      },
      {
        id: "faq-2",
        type: "faq",
        data: {
          badge: "Assurance",
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know about our data privacy, security, and onboarding.",
          items: [
            {
              question: "How does NovaPulse connect to our proprietary databases?",
              answer: "NovaPulse uses secure read-only connectors via IP whitelisting or SSH tunneling. We never store raw customer records without explicit configuration; queries are executed ephemerally through encrypted RAG embeddings."
            },
            {
              question: "Are our enterprise data used to train public models?",
              answer: "Never. Our contracts strictly enforce a zero-training policy. Your proprietary data and internal prompts remain entirely isolated within your dedicated encrypted tenant."
            },
            {
              question: "Can we export our analytics reports and models?",
              answer: "Yes. You can export complete datasets and visual dashboards anytime in JSON, CSV, or formatted PDF, or query them downstream via our REST API."
            },
            {
              question: "How quickly can our team get started?",
              answer: "Most teams connect their first database and run their first predictive query in under 15 minutes without writing a single line of backend code."
            }
          ]
        }
      },
      {
        id: "contact-2",
        type: "contact",
        data: {
          badge: "Get in Touch",
          title: "Schedule an Enterprise Architecture Review",
          subtitle: "Speak directly with our senior AI engineers to evaluate latency, security compliance, and ROI for your stack.",
          address: "NovaPulse HQ, 45 Rue de Courcelles, 75008 Paris, France",
          phone: "+33 1 89 20 44 00",
          email: "contact@novapulse.ai",
          openingHours: "Monday to Friday: 9:00 AM – 7:00 PM CET",
          formFields: ["name", "email", "phone", "service", "message"],
          servicesList: ["Live Enterprise Demo", "VPC & Security Assessment", "Partnership & Reseller Program", "General Technical Question"],
          submitButtonText: "Schedule Call",
          successMessage: "Thank you! An enterprise solution engineer will reach out within 2 business hours."
        }
      },
      {
        id: "footer-2",
        type: "footer",
        data: {
          logoText: "NovaPulse AI",
          description: "Augmented intelligence platform empowering modern companies to make confident, data-driven decisions.",
          socialLinks: [
            { platform: "LinkedIn", url: "https://linkedin.com" },
            { platform: "Twitter", url: "https://x.com" },
            { platform: "GitHub", url: "https://github.com" }
          ],
          copyright: "© 2026 NovaPulse Technologies SAS. All rights reserved."
        }
      }
    ]
  },
  {
    id: "site-elena-vance-photo",
    title: "Elena Vance — Fine Art & Editorial Photography",
    slug: "elena-vance-photo",
    description: "Editorial fashion photography, fine art portraiture, and visual art direction based in Paris & Milan.",
    createdAt: "2026-09-03T14:00:00.000Z",
    updatedAt: "2026-09-09T17:50:00.000Z",
    published: true,
    theme: {
      palette: "neutral",
      primaryColor: "#18181b",
      secondaryColor: "#71717a",
      accentColor: "#d4af37",
      backgroundColor: "#fafafa",
      textColor: "#18181b",
      fontHeading: "Playfair Display",
      fontBody: "Plus Jakarta Sans",
      borderRadius: "rounded-none"
    },
    settings: {
      favicon: "📷",
      logoText: "ELENA VANCE",
      showBranding: true,
      contactEmail: "studio@elenavance.com"
    },
    sections: [
      {
        id: "nav-3",
        type: "navbar",
        data: {
          logoText: "ELENA VANCE",
          logoIcon: "Camera",
          links: [
            { label: "Portfolio", href: "#gallery" },
            { label: "Vision", href: "#about" },
            { label: "Services", href: "#features" },
            { label: "Reviews", href: "#testimonials" },
            { label: "Contact", href: "#contact" }
          ],
          ctaButton: {
            show: true,
            text: "Book a Shoot",
            href: "#contact"
          }
        }
      },
      {
        id: "hero-3",
        type: "hero",
        data: {
          layout: "split",
          badge: "Winner — Creative Photography Awards 2025",
          title: "Capturing the Raw Poetry of Light and Human Emotion",
          subtitle: "Art direction, editorial fashion narratives, and intimate portraits balanced between natural daylight and classic medium-format film.",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80",
          primaryBtn: { text: "View Portfolio", href: "#gallery" },
          secondaryBtn: { text: "Get in Touch", href: "#contact" },
          statsBadge: { count: "12 Years", label: "International Experience" }
        }
      },
      {
        id: "gallery-3",
        type: "gallery",
        data: {
          badge: "Selected Works",
          title: "Visual Archive",
          subtitle: "A journey through natural shadows, sculptured light, and organic textures.",
          layout: "grid",
          filterCategories: ["All", "Fashion", "Portrait", "Architecture", "Editorial"],
          items: [
            {
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
              title: "Autumn Glow — Editorial Series",
              category: "Portrait"
            },
            {
              image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
              title: "Motion & Drapes — Milan Fashion Week",
              category: "Fashion"
            },
            {
              image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
              title: "Raw Brutalist Geometries",
              category: "Architecture"
            },
            {
              image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
              title: "Artist Gaze — Studio Portrait",
              category: "Portrait"
            },
            {
              image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
              title: "Haute Couture — Spring Collection",
              category: "Fashion"
            },
            {
              image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
              title: "Cast Shadows — Urban Lines",
              category: "Architecture"
            }
          ]
        }
      },
      {
        id: "about-3",
        type: "about",
        data: {
          layout: "image-left",
          badge: "Artistic Vision",
          title: "Pure Emotion Before Technical Dogma",
          text: "Based in the Marais district in Paris, I collaborate with couture houses, international publications, and passionate creators. My approach centers on close intimacy with the subject, waiting patiently for the unscripted moment and honoring the rich grain of analog film.",
          bulletPoints: [
            "Medium-format film & digital setups (Hasselblad & Leica M) for unrivaled color depth and softness",
            "Collaborative moodboarding and tailored spatial scenography for every session",
            "Master-grade fine art post-production and Digigraphie-certified archival art prints"
          ],
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=80",
          highlightCard: {
            number: "80+",
            label: "Magazine Features"
          }
        }
      },
      {
        id: "features-3",
        type: "features",
        data: {
          badge: "Services",
          title: "Creative Focus & Commissioned Works",
          subtitle: "From conceptual visual storytelling to final high-resolution delivery.",
          layout: "3-cols",
          items: [
            {
              icon: "Camera",
              title: "Fashion Campaigns & Lookbooks",
              description: "Showcasing textile craftsmanship and designer collections with bold, timeless art direction."
            },
            {
              icon: "Smile",
              title: "Fine Art Portraits & Personalities",
              description: "Private portraiture sessions for artists, founders, and creators seeking a distinct visual signature."
            },
            {
              icon: "BookOpen",
              title: "Archival Prints & Exhibitions",
              description: "Numbered limited-edition print sales and custom gallery curation for institutions and collectors."
            }
          ]
        }
      },
      {
        id: "testimonials-3",
        type: "testimonials",
        data: {
          badge: "Client Words",
          title: "Reflections from Collaborators",
          subtitle: "Feedback from artistic directors, curators, and editorial publishers.",
          items: [
            {
              author: "Adrien de La Tour",
              role: "Creative Director — Maison Vernet",
              rating: 5,
              quote: "Elena captured the soul of our autumn-winter collection with breathtaking grace. Her images elevated our brand presence across every global channel.",
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
            },
            {
              author: "Mathilde Vasseur",
              role: "Editor-in-Chief — L'Éphémère Magazine",
              rating: 5,
              quote: "Working with Elena is an absolute pleasure: quiet composure on set, meticulous precision, and an intuitive eye for framing that never fails to move.",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
            }
          ]
        }
      },
      {
        id: "contact-3",
        type: "contact",
        data: {
          badge: "Inquiries",
          title: "Let's Discuss Your Upcoming Project",
          subtitle: "Available for commissioned assignments in Paris, London, Milan, and worldwide.",
          address: "14 Rue de Turenne, 75004 Paris, France",
          phone: "+33 6 45 89 12 30",
          email: "studio@elenavance.com",
          openingHours: "By appointment only",
          formFields: ["name", "email", "phone", "service", "message"],
          servicesList: ["Fashion Lookbook / Campaign", "Editorial / Magazine Feature", "Private Fine Art Portrait", "Art Print Collector Inquiry"],
          submitButtonText: "Send Inquiry",
          successMessage: "Thank you for reaching out. I personally review and answer inquiries within 24 business hours."
        }
      },
      {
        id: "footer-3",
        type: "footer",
        data: {
          logoText: "ELENA VANCE",
          description: "Fine art photography and contemporary visual direction.",
          socialLinks: [
            { platform: "Instagram", url: "https://instagram.com" },
            { platform: "Behance", url: "https://behance.net" },
            { platform: "Pinterest", url: "https://pinterest.com" }
          ],
          copyright: "© 2026 Elena Vance Studio. All reproduction rights reserved."
        }
      }
    ]
  },
  {
    id: "site-sommet-tech-2026",
    title: "Global Tech & Innovation Summit 2026",
    slug: "sommet-tech-2026",
    description: "Europe's premier technology summit dedicated to generative AI, quantum computing, and frontier deeptech.",
    createdAt: "2026-09-04T09:00:00.000Z",
    updatedAt: "2026-09-09T18:45:00.000Z",
    published: true,
    theme: {
      palette: "purple",
      primaryColor: "#7c3aed",
      secondaryColor: "#1e1b4b",
      accentColor: "#ec4899",
      backgroundColor: "#0b0f19",
      textColor: "#f1f5f9",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      borderRadius: "rounded-2xl"
    },
    settings: {
      favicon: "🚀",
      logoText: "Tech Summit 2026",
      showBranding: true,
      contactEmail: "contact@techsummit2026.org"
    },
    sections: [
      {
        id: "nav-4",
        type: "navbar",
        data: {
          logoText: "Tech Summit 2026",
          logoIcon: "Rocket",
          links: [
            { label: "Home", href: "#hero" },
            { label: "Countdown", href: "#countdown" },
            { label: "Speakers", href: "#features" },
            { label: "Key Figures", href: "#stats" },
            { label: "Tickets", href: "#pricing" },
            { label: "Newsletter", href: "#newsletter" },
            { label: "Contact", href: "#contact" }
          ],
          ctaButton: {
            show: true,
            text: "Get My Pass",
            href: "#pricing"
          }
        }
      },
      {
        id: "hero-4",
        type: "hero",
        data: {
          layout: "full-bg",
          badge: "🎟️ Registration Open — Early Bird Rates until September 30th",
          title: "Shaping the Frontiers of AI, Quantum & Deeptech",
          subtitle: "3 intensive days of keynote presentations, live hardware demos, and executive networking with 4,000 global tech leaders.",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
          primaryBtn: { text: "Reserve Your Pass", href: "#pricing" },
          secondaryBtn: { text: "View Keynote Speakers", href: "#features" },
          statsBadge: { count: "Oct 15-17", label: "Palais des Congrès" }
        }
      },
      {
        id: "countdown-4",
        type: "countdown",
        data: {
          badge: "Opening Soon",
          title: "The Countdown Is On",
          subtitle: "Join the pioneer tech community on October 15, 2026 starting at 8:30 AM in Paris.",
          targetDate: "2026-10-15T08:30:00",
          note: "⚡ Note: Seating for hands-on technical masterclasses is limited to 150 attendees.",
          ctaButton: {
            text: "Lock In Early Bird Rate",
            href: "#pricing"
          }
        }
      },
      {
        id: "features-4",
        type: "features",
        data: {
          badge: "Visionaries",
          title: "World-Class Keynote Speakers",
          subtitle: "Pioneering leaders actively redefining global technological frontiers.",
          layout: "4-cols",
          items: [
            {
              icon: "Cpu",
              title: "Dr. Aurelia Chen",
              description: "VP of AI Research at QuantumScale, leading pioneer in energy-efficient neural model architectures."
            },
            {
              icon: "Shield",
              title: "Sarah Benali",
              description: "President at CyberDefense Alliance, world authority on critical infrastructure cyber resilience."
            },
            {
              icon: "Rocket",
              title: "Marcus Delorme",
              description: "Founder & CEO of NeoOrbit, Europe's first reusable orbital space launch system."
            },
            {
              icon: "Globe",
              title: "Thomas Valois",
              description: "Chief Technology Officer at CloudGlobal, architect behind 100M+ user distributed cloud clusters."
            }
          ]
        }
      },
      {
        id: "stats-4",
        type: "stats",
        data: {
          title: "The Defining European Technology Event of the Year",
          items: [
            { number: "4,000+", label: "Attendees & Tech Leaders" },
            { number: "80+", label: "International Keynote Speakers" },
            { number: "40h", label: "Deep-Dive Masterclasses" },
            { number: "150+", label: "Frontier Startups Exhibiting" }
          ]
        }
      },
      {
        id: "pricing-4",
        type: "pricing",
        data: {
          badge: "Accreditations",
          title: "Select Your Summit Experience",
          subtitle: "All passes include full access to the networking mobile app and complete HD keynote replays.",
          hasPeriodToggle: false,
          plans: [
            {
              name: "Discovery Pass",
              priceMonthly: "€190",
              priceYearly: "€190",
              description: "Access to mainstage plenary sessions and the startup innovation village.",
              popular: false,
              buttonText: "Select Discovery",
              buttonHref: "#contact",
              features: [
                "Full access to 3 days of mainstage keynotes",
                "Admission to the 150+ startup pavilion",
                "Barista coffee breaks & interactive showcases",
                "Attendee networking mobile app"
              ]
            },
            {
              name: "Full Pro Pass",
              priceMonthly: "€450",
              priceYearly: "€450",
              description: "The gold standard pass for engineering leads, architects, and managers.",
              popular: true,
              buttonText: "Get Full Pro Pass",
              buttonHref: "#contact",
              features: [
                "All benefits from the Discovery Pass",
                "Priority admission to 40 hours of Masterclasses",
                "Gourmet networking lunch buffet included daily",
                "Access to the official Summit Tech Night gala",
                "12-month full HD on-demand video archive access"
              ]
            },
            {
              name: "VIP & Executive Pass",
              priceMonthly: "€950",
              priceYearly: "€950",
              description: "For founders and executives desiring private speaker access and boardroom networking.",
              popular: false,
              buttonText: "Get VIP Access",
              buttonHref: "#contact",
              features: [
                "All benefits from the Full Pro Pass",
                "Private VIP Executive Lounge with open bar & concierge",
                "Speakers Gala Dinner on Thursday evening",
                "Private closed-door pitch session with top VC funds",
                "Fast-track registration & dedicated parking"
              ]
            }
          ]
        }
      },
      {
        id: "newsletter-4",
        type: "newsletter",
        data: {
          badge: "Updates",
          title: "Receive Speaker Drops & Schedule Updates",
          subtitle: "Maximum two emails per month with exclusive program reveals and summit insights.",
          buttonText: "Subscribe for Free",
          placeholder: "Your corporate email address",
          disclaimer: "We respect your inbox. 1-click unsubscribe anytime."
        }
      },
      {
        id: "contact-4",
        type: "contact",
        data: {
          badge: "Sponsorship & Press",
          title: "Media Accreditations & Corporate Partnerships",
          subtitle: "Our event team is ready to assist with sponsorship packages, press credentials, and corporate delegations.",
          address: "Palais des Congrès, 2 Place de la Porte Maillot, 75017 Paris, France",
          phone: "+33 1 56 78 90 00",
          email: "partnerships@techsummit2026.org",
          openingHours: "Concierge open 9:00 AM – 6:00 PM CET",
          formFields: ["name", "email", "phone", "service", "message"],
          servicesList: ["Become an Official Event Sponsor", "Press & Media Accreditation", "Corporate Group Delegation (>5 passes)", "Accessibility & Venue Inquiries"],
          submitButtonText: "Submit Inquiry",
          successMessage: "Thank you! Our partnerships coordinator will reply within 24 business hours."
        }
      },
      {
        id: "footer-4",
        type: "footer",
        data: {
          logoText: "Tech Summit 2026",
          description: "The premier European conference shaping the technological architecture of tomorrow.",
          socialLinks: [
            { platform: "Twitter", url: "https://x.com" },
            { platform: "LinkedIn", url: "https://linkedin.com" },
            { platform: "YouTube", url: "https://youtube.com" }
          ],
          copyright: "© 2026 Global Tech Summit Paris. Event produced by TechSummit Europe."
        }
      }
    ]
  }
];
