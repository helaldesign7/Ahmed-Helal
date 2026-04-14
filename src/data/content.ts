export type Language = 'en' | 'ar';

export interface Content {
    hero: {
    badge: { en: string; ar: string };
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    ctaPrimary: { en: string; ar: string };
    ctaSecondary: { en: string; ar: string };
    floatingKeywords: { en: string; ar: string }[];
    background: {
      type: 'video' | 'image' | 'gif';
      url: string;
    };
  };
  laptop: {
    title: { en: string; ar: string };
    name: { en: string; ar: string };
    jobTitle: { en: string; ar: string };
    description: { en: string; ar: string };
    intro: { en: string; ar: string };
    location: { en: string; ar: string };
    profileImage: string;
    portfolioUrl: string;
    cvUrl: string;
    screenBackgroundColor: string;
    screenBackgroundImage?: string;
    ctas: {
      portfolio: { en: string; ar: string };
      cv: { en: string; ar: string };
      back: { en: string; ar: string };
    };
  };
  featuredWork: {
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    projects: {
      title: { en: string; ar: string };
      category: { en: string; ar: string };
      image: string;
    }[];
  };
  services: {
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    items: {
      title: { en: string; ar: string };
      tags: { en: string; ar: string };
      description: { en: string; ar: string };
      orbit: number;
    }[];
  };
  marquee: {
    title: { en: string; ar: string };
    logos: { name: string; image: string }[];
  };
  process: {
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    steps: {
      number: string;
      title: { en: string; ar: string };
      description: { en: string; ar: string };
    }[];
  };
  testimonials: {
    title: { en: string; ar: string };
    items: {
      name: { en: string; ar: string };
      role: { en: string; ar: string };
      company: { en: string; ar: string };
      quote: { en: string; ar: string };
      avatar: string;
    }[];
  };
  metrics: {
    items: {
      value: string;
      label: { en: string; ar: string };
    }[];
  };
  startProject: {
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    successMessage: { en: string; ar: string };
    errorMessage: { en: string; ar: string };
    submitLabel: { en: string; ar: string };
    consentText: { en: string; ar: string };
    introCopy: { en: string; ar: string };
  };
  contact: {
    title: { en: string; ar: string };
    subtitle: { en: string; ar: string };
    whatsappLabel: { en: string; ar: string };
    emailLabel: { en: string; ar: string };
  };
  socials: {
    id: string;
    platform: string;
    url: string;
    isActive: boolean;
  }[];
  footer: {
    brandName: { en: string; ar: string };
    role: { en: string; ar: string };
    extraDetails: { en: string; ar: string };
  };
}

export const content: Content = {
  hero: {
    badge: { en: "Visual Designer", ar: "مصمم بصري" },
    title: { en: "Ahmed Helal", ar: "أحمد هلال" },
    subtitle: {
      en: "Crafting immersive digital experiences through cinematic design and strategic visual storytelling.",
      ar: "صناعة تجارب رقمية غامرة من خلال التصميم السينمائي وسرد القصص البصري الاستراتيجي."
    },
    ctaPrimary: { en: "Start a Project", ar: "ابدأ مشروعك" },
    ctaSecondary: { en: "Explore My Work", ar: "استكشف أعمالي" },
    floatingKeywords: [
      { en: "Art Direction", ar: "إدارة فنية" },
      { en: "Cinematic UI", ar: "واجهات سينمائية" },
      { en: "Brand Strategy", ar: "استراتيجية العلامة" },
      { en: "Visual Storytelling", ar: "السرد البصري" },
      { en: "High-Fidelity", ar: "دقة عالية" },
      { en: "Interactive Motion", ar: "حركة تفاعلية" },
      { en: "3D Aesthetics", ar: "جماليات ثلاثية الأبعاد" },
      { en: "Abstract Concepts", ar: "مفاهيم مجردة" },
      { en: "Strategic Design", ar: "تصميم استراتيجي" },
      { en: "Digital Experience", ar: "تجربة رقمية" },
      { en: "Global Standards", ar: "معايير عالمية" },
      { en: "Artful Precision", ar: "دقة فنية" }
    ],
    background: {
      type: 'video',
      url: '/hero-bg.mp4'
    }
  },
  laptop: {
    title: { en: "Interactive Portfolio", ar: "المعرض التفاعلي" },
    name: { en: "Ahmed Helal", ar: "أحمد هلال" },
    jobTitle: { en: "Visual Design & Art Direction", ar: "التصميم البصري والإدارة الفنية" },
    description: {
      en: "A refined space for creative discovery.",
      ar: "مساحة راقية للاكتشاف الإبداعي."
    },
    location: { en: "Cairo, Egypt", ar: "القاهرة، مصر" },
    profileImage: "https://drive.google.com/thumbnail?id=17qG2FN1G6Qf14UYZmm_i1VhqRVQbsdK0&sz=w1000",
    portfolioUrl: "https://drive.google.com/file/d/18aE8ZHMtayUz8leq0s25YE9gPxXgCRiS/preview",
    cvUrl: "https://drive.google.com/file/d/1TkqQ73kCRD64WRCGDJdSZkOgBA0t0vTJ/preview",
    screenBackgroundColor: "rgba(139, 92, 246, 0.1)",
    screenBackgroundImage: "",
    intro: {
      en: "Specializing in high-impact visual ecosystems and branding for global brands & sports clubs.",
      ar: "متخصص في بناء الأنظمة البصرية عالية التأثير للشركات العالمية والأندية الرياضية."
    },
    ctas: {
      portfolio: { en: "Explore Work", ar: "استكشف الأعمال" },
      cv: { en: "Download CV", ar: "تحميل السيرة" },
      back: { en: "Exit Hub", ar: "خروج من المركز" }
    }
  },
  featuredWork: {
    title: { en: "Featured Work", ar: "أعمال مختارة" },
    subtitle: {
      en: "A curated selection of visual directions across multiple disciplines.",
      ar: "مجموعة مختارة من التوجهات البصرية عبر تخصصات متعددة."
    },
    projects: [
      {
        title: { en: "Al Ahly SC Seasonal Identity", ar: "هوية الأهلي الموسمية" },
        category: { en: "Sports Design", ar: "تصميم رياضي" },
        image: "https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: { en: "Nike Air Max Cinematic", ar: "نايك إير ماكس سينمائي" },
        category: { en: "Advertising", ar: "إعلانات" },
        image: "https://images.unsplash.com/photo-1552346166-2a48eb020038?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: { en: "Cyberpunk 2077 Concept", ar: "سايبربانك ٢٠٧٧" },
        category: { en: "Visual Art", ar: "فن بصري" },
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: { en: "Rolex 3D Visualization", ar: "رولكس ثلاثي الأبعاد" },
        category: { en: "Product Design", ar: "تصميم منتجات" },
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: { en: "Ethereum Brand Core", ar: "هوية إيثيريوم" },
        category: { en: "FinTech Branding", ar: "هوية مالية" },
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004009?q=80&w=2070&auto=format&fit=crop"
      },
      {
        title: { en: "Formula 1 Motion", ar: "فورمولا ١ موشن" },
        category: { en: "Motion Graphics", ar: "موشن جرافيك" },
        image: "https://images.unsplash.com/photo-1596727147705-61a532a655bd?q=80&w=2070&auto=format&fit=crop"
      }
    ]
  },
  services: {
    title: { en: "Creative Ecosystems", ar: "الأنظمة الإبداعية" },
    subtitle: {
      en: "Navigating through visual strategy, creative direction, and premium execution.",
      ar: "التنقل عبر الاستراتيجية البصرية، الإدارة الإبداعية، والتنفيذ المتميز."
    },
    items: [
      {
        title: { en: "Visual Design & Campaign Systems", ar: "التصميم البصري وأنظمة الحملات" },
        tags: { en: "Branding • Art Direction • Campaigns", ar: "هوية • إدارة فنية • حملات" },
        description: { 
          en: "Designing complete visual ecosystems for brands across digital platforms... every visual is part of a bigger system.", 
          ar: "تصميم أنظمة بصرية كاملة للعلامات التجارية... يتم بناء كل شيء للتواصل بوضوح." 
        },
        orbit: 1
      },
      {
        title: { en: "Sports & Club Visual Systems", ar: "الأنظمة البصرية للنوادي والرياضة" },
        tags: { en: "Matchday Graphics • Seasonal Direction", ar: "يوم المباراة • التوجه الموسمي" },
        description: { 
          en: "Crafting complete visual identities and content systems for sports clubs... bold, dynamic, and emotionally engaging.", 
          ar: "صناعة هويات بصرية كاملة وأنظمة محتوى للأندية... جريئة وديناميكية." 
        },
        orbit: 2
      },
      {
        title: { en: "Brand Identity & Visual Language", ar: "هوية العلامة التجارية واللغة البصرية" },
        tags: { en: "Logo Creation • Visual Systems", ar: "الشعارات • الأنظمة البصرية" },
        description: { 
          en: "Building visual identities that define how a brand is seen, remembered, and experienced.", 
          ar: "بناء هويات بصرية تحدد كيف تُرى العلامة التجارية وتُذكر وتُختبر." 
        },
        orbit: 1
      },
      {
        title: { en: "Creative Direction", ar: "الإدارة الإبداعية" },
        tags: { en: "Strategy • Impact • Consistency", ar: "استراتيجية • تأثير • اتساق" },
        description: { 
          en: "Providing strategic visual direction to ensure consistency, clarity, and impact across all brand touchpoints.", 
          ar: "تقديم توجيه بصري استراتيجي لضمان الاتساق والوضوح." 
        },
        orbit: 2
      },
      {
        title: { en: "Website Design & Development", ar: "تصميم وتطوير المواقع الإلكترونية" },
        tags: { en: "UI/UX • Framer • No-Code", ar: "واجهة المستخدم • فريمر • بدون كود" },
        description: { 
          en: "Designing and building fully functional, high-performance websites from scratch using modern no-code tools.", 
          ar: "تصميم وبناء مواقع إلكترونية كاملة الوظائف وعالية الأداء من الصفر." 
        },
        orbit: 1
      },
      {
        title: { en: "Print & Brand Applications", ar: "تطبيقات الطباعة والعلامة التجارية" },
        tags: { en: "Marketing Assets • Branded Content", ar: "أصول تسويقية • محتوى العلامة" },
        description: { 
          en: "Extending brand identity into real-world applications such as print materials and marketing assets.", 
          ar: "توسيع هوية العلامة التجارية إلى تطبيقات الواقع الملموس." 
        },
        orbit: 2
      }
    ]
  },
  marquee: {
    title: { en: "Trusted by / Worked with", ar: "أثقوا بنا / عملنا معًا" },
    logos: [
      { name: "Brand 1", image: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg" },
      { name: "Brand 2", image: "https://cdn.worldvectorlogo.com/logos/nike-11.svg" },
      { name: "Brand 3", image: "https://cdn.worldvectorlogo.com/logos/coca-cola-2021.svg" },
      { name: "Brand 4", image: "https://cdn.worldvectorlogo.com/logos/apple-11.svg" },
      { name: "Brand 5", image: "https://cdn.worldvectorlogo.com/logos/google-g-2015.svg" }
    ]
  },
  process: {
    title: { en: "Strategic Design Process", ar: "عملية التصميم الاستراتيجي" },
    subtitle: { en: "A clear path from vision to reality.", ar: "مسار واضح من الرؤية إلى الواقع." },
    steps: [
      { 
        number: "01", 
        title: { en: "Discover & Define", ar: "الاكتشاف والتحديد" }, 
        description: { 
          en: "Understanding the core vision, market landscape, and strategic mapping.", 
          ar: "فهم الرؤية الأساسية، مشهد السوق، ورسم الخرائط الاستراتيجية." 
        } 
      },
      { 
        number: "02", 
        title: { en: "Concept & Design", ar: "المفهوم والتصميم" }, 
        description: { 
          en: "Crafting the visual language, moodboards, and initial aesthetic directions.", 
          ar: "صناعة اللغة البصرية، لوحات المزاج، والتوجهات الجمالية الأولية." 
        } 
      },
      { 
        number: "03", 
        title: { en: "Refine & Iterate", ar: "التحسين والتكرار" }, 
        description: { 
          en: "Polishing the chosen direction with precision and feedback loops.", 
          ar: "صقل التوجه المختبر بدقة ومن خلال دورات التغذية الراجعة." 
        } 
      },
      { 
        number: "04", 
        title: { en: "Deliver & Scale", ar: "التسليم والتوسع" }, 
        description: { 
          en: "Handing over production-ready assets and building scalable visual systems.", 
          ar: "تسليم الأصول الجاهزة للإنتاج وبناء أنظمة بصرية قابلة للتوسع." 
        } 
      }
    ]
  },
  testimonials: {
    title: { en: "Social Proof", ar: "آراء العملاء" },
    items: [
      {
        name: { en: "Alex Johnson", ar: "أليكس جونسون" },
        role: { en: "Marketing Director", ar: "مدير التسويق" },
        company: { en: "Horizon Tech", ar: "هورايزون للتكنولوجيا" },
        quote: { en: "Ahmed's vision transformed our brand completely. Higher than cinematic standards.", ar: "رؤية أحمد حولت علامتنا التجارية بالكامل. معايير أعلى من المستوى السينمائي." },
        avatar: "https://i.pravatar.cc/150?u=alex"
      },
      {
        name: { en: "Sarah Smith", ar: "سارة سميث" },
        role: { en: "Creative Lead", ar: "القائد الإبداعي" },
        company: { en: "Vibe Studio", ar: "فايب استوديو" },
        quote: { en: "Interactive, bold, and strategically sound. Pure design excellence.", ar: "تفاعلي، جريء، وسليم استراتيجياً. تميز خالص للتصميم." },
        avatar: "https://i.pravatar.cc/150?u=sarah"
      }
    ]
  },
  metrics: {
    items: [
      { value: "150+", label: { en: "Projects Done", ar: "مشروع مكتمل" } },
      { value: "50+", label: { en: "Happy Clients", ar: "عميل سعيد" } },
      { value: "12", label: { en: "Awards", ar: "جوائز" } }
    ]
  },
  startProject: {
    title: { en: "Project Inquiry", ar: "طلب مشروع" },
    subtitle: { en: "Tell us about your next big idea.", ar: "أخبرنا عن فكرتك الكبيرة القادمة." },
    introCopy: { 
      en: "Fill out the form below to initiate a private inquiry. Ahmed will review your project details and get back to you personally.", 
      ar: "املأ النموذج أدناه لبدء استفسار خاص. سيقوم أحمد بمراجعة تفاصيل مشروعك والرد عليك شخصيًا." 
    },
    successMessage: { 
      en: "Request received. Ahmed will contact you shortly.", 
      ar: "تم استلام الطلب. سيتواصل معك أحمد قريبًا." 
    },
    errorMessage: { 
      en: "Failed to send request. Please try again or use WhatsApp.", 
      ar: "فشل إرسال الطلب. يرجى المحاولة مرة أخرى أو استخدام واتساب." 
    },
    submitLabel: { en: "Submit Inquiry", ar: "إرسال الاستفسار" },
    consentText: { 
      en: "I consent to having this data stored and reviewed for project qualification.", 
      ar: "أوافق على تخزين هذه البيانات ومراجعتها لتأهيل المشروع." 
    }
  },
  contact: {
    title: { en: "Start a Project", ar: "ابدأ مشروعك" },
    subtitle: { en: "Ready to elevate your brand?", ar: "هل أنت مستعد للارتقاء بعلامتك التجارية؟" },
    whatsappLabel: { en: "Chat on WhatsApp", ar: "تحدث عبر واتساب" },
    emailLabel: { en: "Send an Email", ar: "أرسل بريداً إلكترونياً" }
  },
  socials: [
    { id: '1', platform: 'whatsapp', url: 'https://wa.me/201001516821', isActive: true },
    { id: '2', platform: 'behance', url: 'https://behance.net/ahmedhelal', isActive: true },
    { id: '3', platform: 'dribbble', url: 'https://dribbble.com/ahmedhelal', isActive: true },
    { id: '4', platform: 'instagram', url: 'https://instagram.com/ahmed_helal_7', isActive: true },
    { id: '5', platform: 'email', url: 'mailto:helal.design7@gmail.com', isActive: true },
    { id: '6', platform: 'phone', url: 'tel:+201001516821', isActive: true },
    { id: '7', platform: 'pinterest', url: 'https://pinterest.com/ahmedhelal', isActive: true },
    { id: '8', platform: 'linkedin', url: 'https://linkedin.com/in/ahmedhelal', isActive: true },
    { id: '9', platform: 'github', url: 'https://github.com/ahmedhelal', isActive: false },
  ],
  footer: {
    brandName: { en: "AHMED HELAL", ar: "أحمد هلال" },
    role: { en: "Visual Designer & Experience Specialist", ar: "مصمم بصري وأخصائي تجربة المستخدم" },
    extraDetails: { en: "Crafting premium digital ecosystems through cinematic design.", ar: "صناعة أنظمة بصرية رقمية متميزة من خلال التصميم السينمائي." }
  }
};

export const initialContent = content;
