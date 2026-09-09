export const AVAILABLE_SECTIONS = [
  {
    type: "hero",
    name: "Hero Header",
    category: "Header",
    icon: "LayoutTemplate",
    description: "High-impact hero banner with compelling title, subtitle, CTA buttons, and badge.",
    defaultData: {
      layout: "split",
      badge: "✨ New 2026 Release",
      title: "Bring Your Most Ambitious Ideas to Life",
      subtitle: "The complete turnkey platform designed to streamline your daily workflow and delight your audience.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
      primaryBtn: { text: "Discover More", href: "#features" },
      secondaryBtn: { text: "Get in Touch", href: "#contact" },
      statsBadge: { count: "100%", label: "Satisfaction Guaranteed" }
    }
  },
  {
    type: "features",
    name: "Features & Services",
    category: "Content",
    icon: "Sparkles",
    description: "Grid of feature cards highlighting your core strengths, perks, or services.",
    defaultData: {
      badge: "Highlights",
      title: "Why Choose Our Platform?",
      subtitle: "Carefully engineered benefits designed to deliver outstanding outcomes.",
      layout: "3-cols",
      items: [
        {
          icon: "Sparkles",
          title: "Uncompromising Quality",
          description: "Every single detail is polished to exceed your highest expectations."
        },
        {
          icon: "Clock",
          title: "Speed & Agility",
          description: "A responsive and dedicated team ready to bring your ideas to market fast."
        },
        {
          icon: "ShieldCheck",
          title: "Guaranteed Reliability",
          description: "Enjoy transparent guidance, secure operations, and complete peace of mind."
        }
      ]
    }
  },
  {
    type: "about",
    name: "About & Story",
    category: "Content",
    icon: "FileText",
    description: "Introduce your founders, workshop, heritage, or mission with side-by-side imagery.",
    defaultData: {
      layout: "image-right",
      badge: "About Us",
      title: "Passion Driven by Authenticity",
      text: "Since our founding, our mission has been to combine timeless craftsmanship with cutting-edge methods to create remarkable experiences for our community.",
      bulletPoints: [
        "Meticulous curation of top-tier local partners",
        "Attentive listening tailored to your bespoke needs",
        "Over a decade of industry expertise at your service"
      ],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
      highlightCard: {
        number: "10+",
        label: "Years of Experience"
      }
    }
  },
  {
    type: "gallery",
    name: "Photo Gallery / Portfolio",
    category: "Media",
    icon: "Image",
    description: "Visual portfolio with lightbox zoom to showcase your finest work.",
    defaultData: {
      badge: "Portfolio",
      title: "Our Visual Showcase",
      subtitle: "Explore a curated selection of our latest works and creative projects.",
      layout: "grid",
      items: [
        {
          image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
          title: "Artisanal Creation #1",
          category: "Selected"
        },
        {
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          title: "Artisanal Creation #2",
          category: "Selected"
        },
        {
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
          title: "Artisanal Creation #3",
          category: "Selected"
        }
      ]
    }
  },
  {
    type: "menu",
    name: "Menu & Service Catalog",
    category: "Commerce",
    icon: "UtensilsCrossed",
    description: "Ideal for bakeries, restaurants, salons, and structured service lists.",
    defaultData: {
      badge: "Offerings",
      title: "Menu & Specialties",
      subtitle: "Handcrafted selections prepared with premium ingredients.",
      categories: [
        {
          name: "Signature Highlights",
          items: [
            { name: "House Signature Special", description: "Bespoke preparation with delicate balance and rich aromas", price: "$12.50", tag: "Popular" },
            { name: "Market Fresh Catch of the Day", description: "Locally sourced fresh seasonal ingredients", price: "$9.90" }
          ]
        },
        {
          name: "Desserts & Refreshments",
          items: [
            { name: "Golden Berry Tartlet", description: "Crisp buttery crust and velvety cream filling", price: "$6.00" },
            { name: "House Infused Beverage", description: "Organic mint and fresh citrus slow infusion", price: "$4.50" }
          ]
        }
      ]
    }
  },
  {
    type: "pricing",
    name: "Pricing Table",
    category: "Commerce",
    icon: "BadgeCheck",
    description: "Tiered pricing table with feature checklists, popular badge, and billing cycle toggle.",
    defaultData: {
      badge: "Plans",
      title: "Simple, Transparent Pricing",
      subtitle: "Choose the package tailored perfectly to your requirements.",
      hasPeriodToggle: true,
      yearlyDiscountText: "-20%",
      plans: [
        {
          name: "Starter",
          priceMonthly: "$29 /mo",
          priceYearly: "$23 /mo",
          description: "Get started independently with essential tools.",
          popular: false,
          buttonText: "Select Starter",
          buttonHref: "#contact",
          features: [
            "Access to core features",
            "Email support within 48h",
            "Automatic product updates"
          ]
        },
        {
          name: "Professional",
          priceMonthly: "$69 /mo",
          priceYearly: "$55 /mo",
          description: "Our most popular plan for active and growing teams.",
          popular: true,
          buttonText: "Choose Pro",
          buttonHref: "#contact",
          features: [
            "Unlimited feature access",
            "Priority 24/7 assistance",
            "Custom detailed reporting",
            "Complimentary onboarding session"
          ]
        }
      ]
    }
  },
  {
    type: "testimonials",
    name: "Testimonials & Reviews",
    category: "Social",
    icon: "Star",
    description: "Customer social proof cards with star ratings, avatar photos, and verified quotes.",
    defaultData: {
      badge: "Reviews",
      title: "Loved by Our Community",
      subtitle: "Discover why clients consistently trust and recommend our work.",
      items: [
        {
          author: "Sophia Reynolds",
          role: "Verified Client",
          rating: 5,
          quote: "An absolutely seamless experience from start to finish. The final outcome exceeded all expectations!",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
        },
        {
          author: "Alexander Brooks",
          role: "Managing Director",
          rating: 5,
          quote: "True professionalism, proactive communication, and zero hassle. Highly recommended!",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        }
      ]
    }
  },
  {
    type: "countdown",
    name: "Interactive Countdown",
    category: "Interactive",
    icon: "Timer",
    description: "Live real-time ticker (days, hours, minutes, seconds) for event launches and deadlines.",
    defaultData: {
      badge: "Upcoming Event",
      title: "Official Launch In:",
      subtitle: "Mark your calendar and get ready for the big day!",
      targetDate: "2026-11-20T10:00:00",
      note: "⚡ Space is strictly limited. Register early to claim your spot.",
      ctaButton: {
        text: "Reserve My Seat",
        href: "#contact"
      }
    }
  },
  {
    type: "faq",
    name: "FAQ Accordion",
    category: "Interactive",
    icon: "HelpCircle",
    description: "Collapsible accordion answering frequent visitor questions concisely.",
    defaultData: {
      badge: "FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know before getting started.",
      items: [
        {
          question: "How do I get in touch to get started?",
          answer: "Simply submit the contact form below. Our team reviews every message and responds promptly with tailored next steps."
        },
        {
          question: "Do you offer flexible payment plans?",
          answer: "Yes, we support split installments across milestones at zero additional cost."
        },
        {
          question: "Can I reschedule or adjust a booking?",
          answer: "You may adjust your time slot up to 24 hours prior to the scheduled date with zero penalty."
        }
      ]
    }
  },
  {
    type: "contact",
    name: "Contact Form & Inbox",
    category: "Interactive",
    icon: "Mail",
    description: "Interactive submission form wired to your local inbox with company details.",
    defaultData: {
      badge: "Contact",
      title: "Let's Talk",
      subtitle: "Fill out the fields below and your inquiry will be delivered directly to our local dashboard inbox.",
      address: "100 Broadway, New York, NY 10005",
      phone: "+1 (555) 234-5678",
      email: "hello@mywebsite.com",
      openingHours: "Monday to Friday: 9:00 AM – 6:30 PM",
      formFields: ["name", "email", "phone", "service", "message"],
      servicesList: ["General Inquiry", "Custom Quote Request", "Consultation Call"],
      submitButtonText: "Send Message",
      successMessage: "Thank you! Your message has been received and will be answered shortly."
    }
  },
  {
    type: "stats",
    name: "Key Figures & Stats",
    category: "Social",
    icon: "BarChart3",
    description: "Bold stat counters showcasing your credibility and track record.",
    defaultData: {
      title: "Proven Results in Numbers",
      items: [
        { number: "98%", label: "Client Satisfaction" },
        { number: "1,500+", label: "Completed Projects" },
        { number: "24/7", label: "Responsive Support" },
        { number: "4.9★", label: "Average Rating" }
      ]
    }
  },
  {
    type: "newsletter",
    name: "Newsletter Signup Banner",
    category: "Interactive",
    icon: "Send",
    description: "Minimalist email capture strip for list building.",
    defaultData: {
      badge: "Stay Updated",
      title: "Never Miss an Announcement",
      subtitle: "Receive our latest insights and exclusive releases directly in your inbox.",
      buttonText: "Subscribe",
      placeholder: "Your email address...",
      disclaimer: "Zero spam guaranteed. Unsubscribe anytime in one click."
    }
  },
  {
    type: "ctaBanner",
    name: "Call to Action Banner",
    category: "Header",
    icon: "Flame",
    description: "Vibrant high-conversion strip prompting visitors to take immediate action.",
    defaultData: {
      title: "Ready to Turn Your Vision into Reality?",
      subtitle: "Join hundreds of happy teams who rely on our tools every day.",
      buttonText: "Get Started Now",
      buttonHref: "#contact",
      secondaryButtonText: "Learn More",
      secondaryButtonHref: "#features"
    }
  },
  {
    type: "footer",
    name: "Footer",
    category: "Structure",
    icon: "PanelBottom",
    description: "Modern footer with brand mark, summary, social links, and copyright.",
    defaultData: {
      logoText: "My Website",
      description: "Crafted with elegance and precision for the modern web.",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "LinkedIn", url: "https://linkedin.com" }
      ],
      copyright: "© 2026 My Website. All rights reserved."
    }
  }
];

export const THEME_PALETTES = [
  {
    id: "amber",
    name: "Warm Amber & Bakery",
    primaryColor: "#b45309",
    secondaryColor: "#78350f",
    accentColor: "#f59e0b",
    backgroundColor: "#fffbf5",
    textColor: "#292524",
    previewBg: "#b45309"
  },
  {
    id: "indigo",
    name: "Cyber Indigo & Modern SaaS",
    primaryColor: "#6366f1",
    secondaryColor: "#0f172a",
    accentColor: "#06b6d4",
    backgroundColor: "#090d16",
    textColor: "#f8fafc",
    previewBg: "#6366f1"
  },
  {
    id: "neutral",
    name: "Minimalist Monochrome Editorial",
    primaryColor: "#18181b",
    secondaryColor: "#71717a",
    accentColor: "#d4af37",
    backgroundColor: "#fafafa",
    textColor: "#18181b",
    previewBg: "#18181b"
  },
  {
    id: "purple",
    name: "Tech Summit & Event Violet",
    primaryColor: "#7c3aed",
    secondaryColor: "#1e1b4b",
    accentColor: "#ec4899",
    backgroundColor: "#0b0f19",
    textColor: "#f1f5f9",
    previewBg: "#7c3aed"
  },
  {
    id: "emerald",
    name: "Forest Emerald & Organic Wellness",
    primaryColor: "#059669",
    secondaryColor: "#064e3b",
    accentColor: "#34d399",
    backgroundColor: "#f0fdf4",
    textColor: "#064e3b",
    previewBg: "#059669"
  },
  {
    id: "coral",
    name: "Modern Coral & Sunset",
    primaryColor: "#e11d48",
    secondaryColor: "#881337",
    accentColor: "#fb7185",
    backgroundColor: "#fff1f2",
    textColor: "#1e293b",
    previewBg: "#e11d48"
  }
];

export const TYPOGRAPHY_PRESETS = [
  {
    id: "inter",
    name: "Inter (Clean, Modern & Universal)",
    heading: "Inter",
    body: "Inter"
  },
  {
    id: "playfair",
    name: "Playfair Display + Inter (Luxury, Fine Dining & Elegant)",
    heading: "Playfair Display",
    body: "Inter"
  },
  {
    id: "outfit",
    name: "Outfit + Inter (SaaS & Artificial Intelligence)",
    heading: "Outfit",
    body: "Inter"
  },
  {
    id: "space",
    name: "Space Grotesk + Inter (Futuristic & Conference)",
    heading: "Space Grotesk",
    body: "Inter"
  },
  {
    id: "editorial",
    name: "Playfair + Plus Jakarta Sans (Art & Photography)",
    heading: "Playfair Display",
    body: "Plus Jakarta Sans"
  }
];
