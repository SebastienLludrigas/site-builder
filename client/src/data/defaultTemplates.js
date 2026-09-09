export const AVAILABLE_SECTIONS = [
  {
    type: "hero",
    name: "En-tête Hero",
    category: "Accroche",
    icon: "LayoutTemplate",
    description: "Grande section d'accroche avec titre percutant, sous-titre, boutons et image valorisante.",
    defaultData: {
      layout: "split",
      badge: "✨ Nouvelle Offre 2026",
      title: "Donnez vie à vos projets les plus ambitieux",
      subtitle: "La solution clé en main conçue pour vous simplifier le quotidien et ravir vos clients.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=80",
      primaryBtn: { text: "Découvrir maintenant", href: "#features" },
      secondaryBtn: { text: "Nous contacter", href: "#contact" },
      statsBadge: { count: "100%", label: "Satisfaction garantie" }
    }
  },
  {
    type: "features",
    name: "Fonctionnalités & Services",
    category: "Contenu",
    icon: "Sparkles",
    description: "Grille de cartes présentant vos atouts clés, services ou fonctionnalités.",
    defaultData: {
      badge: "Points forts",
      title: "Pourquoi choisir nos services ?",
      subtitle: "Un ensemble d'avantages pensés pour vous garantir un résultat impeccable.",
      layout: "3-cols",
      items: [
        {
          icon: "Sparkles",
          title: "Qualité Irréprochable",
          description: "Chaque détail est soigné pour dépasser vos attentes les plus exigeantes."
        },
        {
          icon: "Clock",
          title: "Rapidité & Réactivité",
          description: "Une équipe disponible et à votre écoute pour concrétiser vos demandes sans délai."
        },
        {
          icon: "ShieldCheck",
          title: "Garantie & Sérénité",
          description: "Bénéficiez d'un accompagnement transparent et d'engagements clairs du début à la fin."
        }
      ]
    }
  },
  {
    type: "about",
    name: "À Propos & Histoire",
    category: "Contenu",
    icon: "FileText",
    description: "Présentation de votre équipe, de votre atelier ou de votre mission avec image.",
    defaultData: {
      layout: "image-right",
      badge: "Qui sommes-nous ?",
      title: "Une passion transmise avec authenticité",
      text: "Depuis notre création, notre mission est de concilier savoir-faire traditionnel et approches contemporaines pour offrir des expériences mémorables à chacun de nos visiteurs.",
      bulletPoints: [
        "Sélection rigoureuse des meilleurs partenaires locaux",
        "Écoute attentive de vos besoins sur mesure",
        "Plus de dix ans d'expérience au service de votre satisfaction"
      ],
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
      highlightCard: {
        number: "10+",
        label: "Années d'expertise"
      }
    }
  },
  {
    type: "gallery",
    name: "Galerie Photos / Portfolio",
    category: "Médias",
    icon: "Image",
    description: "Vitrine visuelle avec zoom lightbox pour présenter vos réalisations.",
    defaultData: {
      badge: "Réalisations",
      title: "Notre Galerie Photos",
      subtitle: "Découvrez en images un aperçu de nos dernières créations.",
      layout: "grid",
      items: [
        {
          image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
          title: "Création artisanale #1",
          category: "Sélection"
        },
        {
          image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          title: "Création artisanale #2",
          category: "Sélection"
        },
        {
          image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
          title: "Création artisanale #3",
          category: "Sélection"
        }
      ]
    }
  },
  {
    type: "menu",
    name: "Carte Restaurant / Menu / Tarifs détaillés",
    category: "Commerce",
    icon: "UtensilsCrossed",
    description: "Idéal pour les restaurants, boulangeries, salons de beauté ou grilles de prestations.",
    defaultData: {
      badge: "Nos Offres",
      title: "Carte & Spécialités",
      subtitle: "Des formules gourmandes et soignées préparées avec amour.",
      categories: [
        {
          name: "Les Incontournables",
          items: [
            { name: "Spécialité Maison du Chef", description: "Préparation artisanale aux saveurs délicates et équilibrées", price: "12,50 €", tag: "Populaire" },
            { name: "Sélection Gourmande du Jour", description: "Ingrédients frais du marché selon l'arrivage matinal", price: "9,90 €" }
          ]
        },
        {
          name: "Desserts & Boissons",
          items: [
            { name: "Douceur Sablée aux Fruits", description: "Pâte croquante dorée et crème onctueuse", price: "6,00 €" },
            { name: "Boisson Maison Fraîche", description: "Infusion naturelle de menthe et citron bio", price: "4,50 €" }
          ]
        }
      ]
    }
  },
  {
    type: "pricing",
    name: "Grille Tarifaire",
    category: "Commerce",
    icon: "BadgeCheck",
    description: "Tableaux de prix avec fonctionnalités, formule recommandée et bascule mensuel/annuel.",
    defaultData: {
      badge: "Abonnements",
      title: "Des Tarifs Simples et Adaptés",
      subtitle: "Choisissez l'offre qui correspond le mieux à votre situation.",
      hasPeriodToggle: true,
      yearlyDiscountText: "-20%",
      plans: [
        {
          name: "Formule Découverte",
          priceMonthly: "29 €",
          priceYearly: "23 €",
          description: "Pour faire ses premiers pas en toute autonomie.",
          popular: false,
          buttonText: "Sélectionner",
          buttonHref: "#contact",
          features: [
            "Accès aux fonctionnalités de base",
            "Support par e-mail en 48h",
            "Mises à jour incluses"
          ]
        },
        {
          name: "Formule Avancée",
          priceMonthly: "69 €",
          priceYearly: "55 €",
          description: "La formule la plus appréciée par nos utilisateurs réguliers.",
          popular: true,
          buttonText: "Choisir Avancée",
          buttonHref: "#contact",
          features: [
            "Toutes les fonctionnalités en illimité",
            "Support prioritaire 7j/7",
            "Rapports détaillés personnalisés",
            "Accompagnement initial offert"
          ]
        }
      ]
    }
  },
  {
    type: "testimonials",
    name: "Témoignages & Avis Clients",
    category: "Social",
    icon: "Star",
    description: "Avis clients avec notation étoiles, photo avatar et citation élogieuse.",
    defaultData: {
      badge: "Recommandations",
      title: "Ce Que Pensent Nos Clients",
      subtitle: "Découvrez les retours de personnes qui nous ont fait confiance.",
      items: [
        {
          author: "Sophie Bernard",
          role: "Cliente Particulière",
          rating: 5,
          quote: "Une expérience absolument parfaite du début à la fin. Le résultat dépasse largement ce que j'espérais !",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
        },
        {
          author: "Alexandre Mercier",
          role: "Directeur d'agence",
          rating: 5,
          quote: "Professionnalisme, ponctualité et écoute sans faille. Je recommande les yeux fermés à tous mes proches.",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        }
      ]
    }
  },
  {
    type: "countdown",
    name: "Compte à Rebours Interactif",
    category: "Interactivité",
    icon: "Timer",
    description: "Compteur interactif en temps réel (jours, heures, minutes, secondes) pour un événement ou un lancement.",
    defaultData: {
      badge: "Événement Imminent",
      title: "Lancement Officiel dans :",
      subtitle: "Tenez-vous prêt pour le grand jour !",
      targetDate: "2026-11-20T10:00:00",
      note: "⚡ Inscrivez-vous avant la date limite pour réserver votre place.",
      ctaButton: {
        text: "Participer à l'événement",
        href: "#contact"
      }
    }
  },
  {
    type: "faq",
    name: "Questions Fréquentes (FAQ)",
    category: "Interactivité",
    icon: "HelpCircle",
    description: "Accordéon interactif de questions/réponses cliquables.",
    defaultData: {
      badge: "Aide & Réponses",
      title: "Foire Aux Questions",
      subtitle: "Tout ce qu'il faut savoir avant de nous rejoindre.",
      items: [
        {
          question: "Comment fonctionne la prise de contact ?",
          answer: "Il vous suffit de remplir le formulaire ci-dessous. Nous revenons vers vous dans les plus brefs délais avec une réponse personnalisée."
        },
        {
          question: "Proposez-vous des facilités de paiement ?",
          answer: "Oui, nous offrons la possibilité d'étaler les règlements en plusieurs fois sans frais additionnels."
        },
        {
          question: "Puis-je annuler ou reporter un rendez-vous ?",
          answer: "Vous pouvez modifier votre créneau jusqu'à 24 heures à l'avance sans aucune pénalité."
        }
      ]
    }
  },
  {
    type: "contact",
    name: "Formulaire de Contact & Inbox",
    category: "Interactivité",
    icon: "Mail",
    description: "Formulaire interactif connecté à la boîte de réception locale avec coordonnées complètes.",
    defaultData: {
      badge: "Échangeons",
      title: "Prendre Contact",
      subtitle: "Remplissez ce formulaire et votre message sera immédiatement enregistré dans notre boîte de réception.",
      address: "10 Rue de la Paix, 75002 Paris",
      phone: "01 23 45 67 89",
      email: "contact@monsite.fr",
      openingHours: "Du Lundi au Vendredi : 9h00 - 18h30",
      formFields: ["name", "email", "phone", "service", "message"],
      servicesList: ["Demande générale", "Demande de devis", "Rendez-vous conseil"],
      submitButtonText: "Envoyer mon message",
      successMessage: "Merci ! Votre message a bien été envoyé et sera traité très rapidement."
    }
  },
  {
    type: "stats",
    name: "Chiffres Clés / Statistiques",
    category: "Social",
    icon: "BarChart3",
    description: "Compteurs imposants pour illustrer votre impact et crédibilité.",
    defaultData: {
      title: "Nos résultats en chiffres",
      items: [
        { number: "98%", label: "Clients satisfaits" },
        { number: "1 500+", label: "Projets concrétisés" },
        { number: "24/7", label: "Assistance réactive" },
        { number: "5★", label: "Note moyenne certifiée" }
      ]
    }
  },
  {
    type: "newsletter",
    name: "Barre d'Inscription Newsletter",
    category: "Interactivité",
    icon: "Send",
    description: "Boîte d'inscription email épurée pour capturer des leads.",
    defaultData: {
      badge: "Restez Informé",
      title: "Ne manquez aucune de nos nouveautés",
      subtitle: "Recevez nos meilleurs conseils et nos offres exclusives directement par email.",
      buttonText: "S'inscrire",
      placeholder: "Votre adresse e-mail...",
      disclaimer: "Zéro spam garanti. Vous pouvez vous désinscrire à tout moment."
    }
  },
  {
    type: "ctaBanner",
    name: "Bannière d'Appel à l'Action",
    category: "Accroche",
    icon: "Flame",
    description: "Bannière colorée percutante pour inciter vos visiteurs à passer à l'action.",
    defaultData: {
      title: "Prêt à transformer vos idées en réalité ?",
      subtitle: "Rejoignez dès aujourd'hui les centaines de clients qui nous font confiance.",
      buttonText: "Commencer dès maintenant",
      buttonHref: "#contact",
      secondaryButtonText: "En savoir plus",
      secondaryButtonHref: "#features"
    }
  },
  {
    type: "footer",
    name: "Pied de Page (Footer)",
    category: "Structure",
    icon: "PanelBottom",
    description: "Pied de page avec nom, description, liens sociaux et copyright.",
    defaultData: {
      logoText: "Mon Site Web",
      description: "Votre présence en ligne moderne et soignée.",
      socialLinks: [
        { platform: "Instagram", url: "https://instagram.com" },
        { platform: "LinkedIn", url: "https://linkedin.com" }
      ],
      copyright: "© 2026 Mon Site. Tous droits réservés."
    }
  }
];

export const THEME_PALETTES = [
  {
    id: "amber",
    name: "Ambre Chaleureux & Boulangerie",
    primaryColor: "#b45309",
    secondaryColor: "#78350f",
    accentColor: "#f59e0b",
    backgroundColor: "#fffbf5",
    textColor: "#292524",
    previewBg: "#b45309"
  },
  {
    id: "indigo",
    name: "Indigo Cyber & SaaS High-Tech",
    primaryColor: "#6366f1",
    secondaryColor: "#0f172a",
    accentColor: "#06b6d4",
    backgroundColor: "#090d16",
    textColor: "#f8fafc",
    previewBg: "#6366f1"
  },
  {
    id: "neutral",
    name: "Éditorial Noir & Blanc Minimaliste",
    primaryColor: "#18181b",
    secondaryColor: "#71717a",
    accentColor: "#d4af37",
    backgroundColor: "#fafafa",
    textColor: "#18181b",
    previewBg: "#18181b"
  },
  {
    id: "purple",
    name: "Violet Sommet & Événement",
    primaryColor: "#7c3aed",
    secondaryColor: "#1e1b4b",
    accentColor: "#ec4899",
    backgroundColor: "#0b0f19",
    textColor: "#f1f5f9",
    previewBg: "#7c3aed"
  },
  {
    id: "emerald",
    name: "Émeraude Forêt & Santé / Bio",
    primaryColor: "#059669",
    secondaryColor: "#064e3b",
    accentColor: "#34d399",
    backgroundColor: "#f0fdf4",
    textColor: "#064e3b",
    previewBg: "#059669"
  },
  {
    id: "coral",
    name: "Corail & Sunset Moderne",
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
    name: "Inter (Net, Moderne & Universel)",
    heading: "Inter",
    body: "Inter"
  },
  {
    id: "playfair",
    name: "Playfair Display + Inter (Élégant, Luxe & Gastronomie)",
    heading: "Playfair Display",
    body: "Inter"
  },
  {
    id: "outfit",
    name: "Outfit + Inter (SaaS & Intelligence Artificielle)",
    heading: "Outfit",
    body: "Inter"
  },
  {
    id: "space",
    name: "Space Grotesk + Inter (Futuriste & Conférence)",
    heading: "Space Grotesk",
    body: "Inter"
  },
  {
    id: "editorial",
    name: "Playfair + Plus Jakarta Sans (Art & Photographie)",
    heading: "Playfair Display",
    body: "Plus Jakarta Sans"
  }
];
