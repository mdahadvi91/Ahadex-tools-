import { LanguageCode } from '../types';

export interface Translations {
  common: {
    brandName: string;
    brandTagline: string;
    search: string;
    searchPlaceholder: string;
    pressShortcut: string;
    allTools: string;
    categories: string;
    featured: string;
    popular: string;
    privacy: string;
    terms: string;
    disclaimer: string;
    about: string;
    contact: string;
    howItWorks: string;
    faq: string;
    whyUs: string;
    theme: string;
    language: string;
    quickSettings: string;
    viewAll: string;
    filterByCategory: string;
    sortBy: string;
    noResults: string;
    noResultsDesc: string;
    openTool: string;
    launchTool: string;
    clientSideSecured: string;
    zeroDataRetention: string;
    readyToLaunch: string;
    plannedModule: string;
    backToHome: string;
    copied: string;
    copyLink: string;
  };
  hero: {
    badge: string;
    titlePart1: string;
    titleGradient: string;
    titlePart2: string;
    subtitle: string;
    exploreCta: string;
    featuresCta: string;
    quickTagsLabel: string;
  };
  stats: {
    toolsCount: string;
    toolsLabel: string;
    privacyRate: string;
    privacyLabel: string;
    speedRate: string;
    speedLabel: string;
    costRate: string;
    costLabel: string;
  };
  features: {
    title: string;
    subtitle: string;
    privacyTitle: string;
    privacyDesc: string;
    speedTitle: string;
    speedDesc: string;
    cleanTitle: string;
    cleanDesc: string;
    futureTitle: string;
    futureDesc: string;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  footer: {
    rights: string;
    legal: string;
    platformStatus: string;
    statusOperational: string;
    newsletterTitle: string;
    newsletterDesc: string;
    subscribe: string;
    subscribeSuccess: string;
  };
}

export const translations: Record<LanguageCode, Translations> = {
  en: {
    common: {
      brandName: 'AHADEX TOOLS',
      brandTagline: 'Futuristic Web Utilities & Developer Suite',
      search: 'Search',
      searchPlaceholder: 'Search 30+ high-performance tools (e.g. PDF, Image, QR, JSON)...',
      pressShortcut: '⌘K',
      allTools: 'All Tools',
      categories: 'Categories',
      featured: 'Featured',
      popular: 'Popular',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      disclaimer: 'Disclaimer',
      about: 'About AHADEX',
      contact: 'Contact & Feedback',
      howItWorks: 'How It Works',
      faq: 'Frequently Asked Questions',
      whyUs: 'Why AHADEX',
      theme: 'Theme',
      language: 'Language',
      quickSettings: 'Quick Settings',
      viewAll: 'Explore All Tools',
      filterByCategory: 'Filter by category',
      sortBy: 'Sort by',
      noResults: 'No tools match your criteria',
      noResultsDesc: 'Try adjusting your search terms or selecting a different category filter.',
      openTool: 'Inspect Tool',
      launchTool: 'Launch Tool Workbench',
      clientSideSecured: '100% Client-Side Private',
      zeroDataRetention: 'Zero Data Retention Guaranteed',
      readyToLaunch: 'Production Core Ready',
      plannedModule: 'Architecture Modularized',
      backToHome: 'Back to Home',
      copied: 'Copied to clipboard!',
      copyLink: 'Share Tool',
    },
    hero: {
      badge: 'Next-Gen Web Utility Engine',
      titlePart1: 'High-Performance Tools for',
      titleGradient: 'Modern Creators & Developers',
      titlePart2: 'Engineered for Speed.',
      subtitle: 'A unified suite of hyper-fast, privacy-first web utilities. Convert, compress, format, and optimize files directly in your browser without sacrificing data security.',
      exploreCta: 'Explore All Utilities',
      featuresCta: 'View Architecture',
      quickTagsLabel: 'Trending Tools:',
    },
    stats: {
      toolsCount: '30+',
      toolsLabel: 'Engineered Utilities',
      privacyRate: '100%',
      privacyLabel: 'Browser-Side Security',
      speedRate: '< 40ms',
      speedLabel: 'Instant Execution',
      costRate: 'Zero',
      costLabel: 'Ads or Subscriptions',
    },
    features: {
      title: 'Built with Architectural Precision',
      subtitle: 'Every utility in AHADEX TOOLS is designed with zero clutter, maximum processing performance, and unwavering security.',
      privacyTitle: 'Zero-Upload Data Privacy',
      privacyDesc: 'Your sensitive files and inputs are processed locally in your modern web browser using client-side algorithms and WebAssembly.',
      speedTitle: 'Sub-second Response Times',
      speedDesc: 'Eliminate round-trip network delays. Instant formatting, encoding, and compression right on your hardware.',
      cleanTitle: 'Distraction-Free Experience',
      cleanDesc: 'No invasive ads, paywalls, or forced account registrations. Pure utility, available whenever you need it.',
      futureTitle: 'Extensible Future-Ready Architecture',
      futureDesc: 'Modular tool registry structure allows rapid deployment of new image, document, and developer modules seamlessly.',
    },
    howItWorks: {
      title: 'Simple, Transparent Execution',
      subtitle: 'How AHADEX TOOLS delivers desktop-class performance straight to your browser in 4 simple steps.',
      step1Title: 'Select Your Utility',
      step1Desc: 'Choose from our curated index of image, document, code, cryptography, or media utilities.',
      step2Title: 'Provide File or Data',
      step2Desc: 'Drag and drop your file or paste your raw data into the high-contrast liquid glass workbench.',
      step3Title: 'In-Browser Processing',
      step3Desc: 'State-of-the-art client-side engines execute the transformation instantly without external uploads.',
      step4Title: 'Export & Download',
      step4Desc: 'Receive your verified output file or formatted result immediately with cryptographic integrity.',
    },
    footer: {
      rights: 'AHADEX TOOLS. All rights reserved.',
      legal: 'Privacy-first web platform engineered for modern utility.',
      platformStatus: 'System Status',
      statusOperational: 'All Engine Cores Operational',
      newsletterTitle: 'Stay Updated with New Tools',
      newsletterDesc: 'Get notified when new document converters and developer utilities arrive.',
      subscribe: 'Notify Me',
      subscribeSuccess: 'You will receive release updates for AHADEX TOOLS!',
    },
  },
  bn: {
    common: {
      brandName: 'AHADEX TOOLS',
      brandTagline: 'ভবিষ্যতমুখী ওয়েব ইউটিলিটি ও ডেভেলপার স্যুট',
      search: 'অনুসন্ধান',
      searchPlaceholder: '৩০+ হাই-পারফরম্যান্স টুল অনুসন্ধান করুন (যেমন: PDF, Image, QR, JSON)...',
      pressShortcut: '⌘K',
      allTools: 'সকল টুলস',
      categories: 'ক্যাটাগরি',
      featured: 'ফিচার্ড',
      popular: 'জনপ্রিয়',
      privacy: 'প্রাইভেসি পলিসি',
      terms: 'শর্তাবলী',
      disclaimer: 'ডিসক্লেইমার',
      about: 'আহাদেক্স সম্পর্কে',
      contact: 'যোগাযোগ ও মতামত',
      howItWorks: 'কীভাবে কাজ করে',
      faq: 'সাধারণ প্রশ্নাবলী',
      whyUs: 'কেন আহাদেক্স',
      theme: 'থিম',
      language: 'ভাষা',
      quickSettings: 'কুইক সেটিংস',
      viewAll: 'সকল টুল দেখুন',
      filterByCategory: 'ক্যাটাগরি ফিল্টার',
      sortBy: 'বাছাই ক্রম',
      noResults: 'কোনো টুল পাওয়া যায়নি',
      noResultsDesc: 'অনুগ্রহ করে ভিন্ন কোনো শব্দ দিয়ে সার্চ করুন অথবা অন্য ক্যাটাগরি বেছে নিন।',
      openTool: 'টুল পরিদর্শন',
      launchTool: 'টুল ওয়ার্কবেঞ্চ খুলুন',
      clientSideSecured: '১০০% ব্রাউজারে সুরক্ষিত',
      zeroDataRetention: 'কোনো ডেটা সার্ভারে জমা থাকে না',
      readyToLaunch: 'কোর ইঞ্জিন প্রস্তুত',
      plannedModule: 'মডিউলার আর্কিটেকচার',
      backToHome: 'হোমে ফিরে যান',
      copied: 'ক্লিপবোর্ডে কপি করা হয়েছে!',
      copyLink: 'টুল শেয়ার করুন',
    },
    hero: {
      badge: 'পরবর্তী প্রজন্মের ওয়েব ইউটিলিটি ইঞ্জিন',
      titlePart1: 'আধুনিক নির্মাতা ও ডেভেলপারদের জন্য',
      titleGradient: 'শক্তিশালী প্রিমিয়াম টুলস',
      titlePart2: 'গতি ও নিরাপত্তার মেলবন্ধন।',
      subtitle: 'একটি সমন্বিত, ক্ষিপ্রগতির এবং প্রাইভেসি-সুরক্ষিত অনলাইন প্ল্যাটফর্ম। আপনার ডেটা সার্ভারে না পাঠিয়ে সরাসরি ব্রাউজারে ফাইল প্রসেস করুন।',
      exploreCta: 'সকল টুল দেখুন',
      featuresCta: 'আর্কিটেকচার জানুন',
      quickTagsLabel: 'জনপ্রিয় টুলসমূহ:',
    },
    stats: {
      toolsCount: '৩০+',
      toolsLabel: 'আধুনিক টুলস',
      privacyRate: '১০০%',
      privacyLabel: 'ব্রাউজার-সাইড নিরাপত্তা',
      speedRate: '< ৪০মি.সে.',
      speedLabel: 'তাৎক্ষণিক ফলাফল',
      costRate: 'সম্পূর্ণ ফ্রি',
      costLabel: 'কোনো বিজ্ঞাপন নেই',
    },
    features: {
      title: 'প্রকৌশলগত নিখুঁত নকশা',
      subtitle: 'AHADEX TOOLS-এর প্রতিটি টুল তৈরি হয়েছে সর্বোচ্চ গতি, শূন্য বিশৃঙ্খলা এবং আপসহীন নিরাপত্তার লক্ষ্যে।',
      privacyTitle: 'জিরো-আপলোড ডেটা প্রাইভেসি',
      privacyDesc: 'আপনার স্পর্শকাতর ফাইল ও ডেটা কোনো সার্ভারে জমা না হয়ে সরাসরি আপনার ব্রাউজারে প্রসেস হয়।',
      speedTitle: 'পলকের মধ্যে ফলাফল',
      speedDesc: 'সার্ভারে পাঠানোর বিলম্ব নেই। সরাসরি আপনার ডিভাইসের ক্ষমতায় দ্রুত কাজ সম্পন্ন হয়।',
      cleanTitle: 'বিরক্তিহীন পরিচ্ছন্ন পরিবেশ',
      cleanDesc: 'কোনো বিরক্তিকর বিজ্ঞাপন বা বাধ্যতামূলক একাউন্ট খোলার ঝামেলা নেই। যখন প্রয়োজন তখনই ব্যবহার করুন।',
      futureTitle: 'ভবিষ্যতের জন্য প্রস্তুত আর্কিটেকচার',
      futureDesc: 'স্বাধীন মডিউল কাঠামোর মাধ্যমে যেকোনো নতুন ফিচার সহজে যুক্ত করা যায়।',
    },
    howItWorks: {
      title: 'সহজ ও স্বচ্ছ কার্যপদ্ধতি',
      subtitle: '৪টি সাধারণ ধাপে AHADEX TOOLS কীভাবে ডেস্কটপ-মানের কার্যকারিতা প্রদান করে।',
      step1Title: 'প্রয়োজনীয় টুল নির্বাচন করুন',
      step1Desc: 'আমাদের ইমেজ, ডকুমেন্ট, কোড বা ক্রিপ্টোগ্রাফি তালিকা থেকে আপনার টুল বেছে নিন।',
      step2Title: 'ফাইল বা তথ্য প্রদান করুন',
      step2Desc: 'ড্র্যাগ-অ্যান্ড-ড্রপ করে ফাইল দিন অথবা টেক্সট ইনপুট বক্সে পেস্ট করুন।',
      step3Title: 'ব্রাউজারে প্রসেসিং',
      step3Desc: 'আধুনিক অ্যালগরিদমের মাধ্যমে কোনো এক্সটার্নাল সার্ভার ছাড়াই রূপান্তর সম্পন্ন হয়।',
      step4Title: 'ফলাফল ডাউনলোড করুন',
      step4Desc: 'মুহূর্তের মধ্যে তৈরি ফলাফল বা ফাইল নিরাপদে আপনার কম্পিউটারে সংরক্ষণ করুন।',
    },
    footer: {
      rights: 'AHADEX TOOLS। সর্বস্বত্ব সংরক্ষিত।',
      legal: 'আধুনিক প্রয়োজনের জন্য নির্মিত প্রাইভেসি-ফার্স্ট প্ল্যাটফর্ম।',
      platformStatus: 'সিস্টেম স্ট্যাটাস',
      statusOperational: 'সকল ইঞ্জিন কোর সচল রয়েছে',
      newsletterTitle: 'নতুন টুলের আপডেট পান',
      newsletterDesc: 'নতুন ডকুমেন্ট কনভার্টার ও ডেভেলপার ইউটিলিটি প্রকাশের তথ্য আগে জানুন।',
      subscribe: 'আমাকে জানান',
      subscribeSuccess: 'ধন্যবাদ! AHADEX TOOLS-এর আপডেট আপনাকে জানানো হবে।',
    },
  },
  ar: {
    common: {
      brandName: 'AHADEX TOOLS',
      brandTagline: 'مجموعة أدوات الويب والمطورين المستقبلية',
      search: 'بحث',
      searchPlaceholder: 'ابحث في أكثر من 30 أداة فائقة السرعة (مثل PDF، الصور، QR، JSON)...',
      pressShortcut: '⌘K',
      allTools: 'جميع الأدوات',
      categories: 'الأقسام',
      featured: 'المميزة',
      popular: 'الأكثر استخداماً',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      disclaimer: 'إخلاء المسؤولية',
      about: 'عن أهاديكس',
      contact: 'الاتصال والتعليقات',
      howItWorks: 'كيف تعمل المنصة',
      faq: 'الأسئلة الشائعة',
      whyUs: 'لماذا أهاديكس',
      theme: 'المظهر',
      language: 'اللغة',
      quickSettings: 'الإعدادات السريعة',
      viewAll: 'استكشف جميع الأدوات',
      filterByCategory: 'تصفية حسب القسم',
      sortBy: 'ترتيب حسب',
      noResults: 'لم يتم العثور على أدوات مطابقة',
      noResultsDesc: 'يرجى تجربة كلمات بحث أخرى أو اختيار تصنيف مختلف.',
      openTool: 'معاينة الأداة',
      launchTool: 'فتح منصة العمل للأداة',
      clientSideSecured: '100% آمن داخل المتصفح',
      zeroDataRetention: 'لا يتم تخزين أي بيانات في الخوادم',
      readyToLaunch: 'النواة جاهزة للتشغيل',
      plannedModule: 'بنية هندسية نمطية',
      backToHome: 'العودة للرئيسية',
      copied: 'تم النسخ إلى الحافظة!',
      copyLink: 'مشاركة الأداة',
    },
    hero: {
      badge: 'محرك أدوات الويب من الجيل التالي',
      titlePart1: 'أدوات عالية الأداء مخصصة',
      titleGradient: 'للمبدعين والمطورين المعاصرين',
      titlePart2: 'صُممت لأقصى سرعة وأمان.',
      subtitle: 'مجموعة موحدة من الأدوات السحابية الخفيفة التي تحافظ على خصوصيتك. قم بتحويل الملفات وضغطها وتنسيقها مباشرة داخل متصفحك دون رفع بياناتك.',
      exploreCta: 'استكشف جميع الأدوات',
      featuresCta: 'عرض البنية المعمارية',
      quickTagsLabel: 'الأدوات الشائعة:',
    },
    stats: {
      toolsCount: '+30',
      toolsLabel: 'أداة هندسية جاهزة',
      privacyRate: '100%',
      privacyLabel: 'أمان كامل بالمتصفح',
      speedRate: '< 40ms',
      speedLabel: 'استجابة فائقة السرعة',
      costRate: 'مجاني تماماً',
      costLabel: 'خالٍ من الإعلانات',
    },
    features: {
      title: 'صممت بدقة معمارية فائقة',
      subtitle: 'تم تصميم كل أداة في AHADEX TOOLS لتوفير أعلى سرعة تشغيل وأقصى درجات الخصوصية دون أي إعلانات مزعجة.',
      privacyTitle: 'خصوصية كاملة دون رفع ملفات',
      privacyDesc: 'تتم معالجة ملفاتك وبياناتك الحساسة محلياً على جهازك باستخدام خوارزميات المتصفح وWebAssembly.',
      speedTitle: 'أداء فوري خلال أجزاء من الثانية',
      speedDesc: 'تخلص من أوقات الانتظار وبطء الشبكة. معالجة وتنسيق فوري يعتمد على قوة جهازك.',
      cleanTitle: 'تجربة نقية خالية من المشتتات',
      cleanDesc: 'لا إعلانات متسللة ولا جدران دفع ولا اشتراكات إجبارية. أدوات صافية متاحة عندما تحتاجها.',
      futureTitle: 'بنية معمارية قابلة للتوسع المستمر',
      futureDesc: 'سجل أدوات نمطي يتيح إضافة المزيد من أدوات المستندات والوسائط والمطورين بسلاسة.',
    },
    howItWorks: {
      title: 'طريقة عمل بسيطة وشفافة',
      subtitle: 'كيف تقدم AHADEX TOOLS أداءً مضاهاة لتطبيقات سطح المكتب في 4 خطوات سلسة.',
      step1Title: 'اختر الأداة المطلوبة',
      step1Desc: 'تصفح قائمة الأدوات واختر الأداة المتوافقة مع احتياجاتك.',
      step2Title: 'أدخل الملف أو البيانات',
      step2Desc: 'اسحب الملف وأفلته أو الصق النص البرمجي في واجهة العمل الزجاجية.',
      step3Title: 'معالجة داخل المتصفح',
      step3Desc: 'تقوم الخوارزميات المحلية بمعالجة البيانات فوراً دون إرسالها لأي خادم خارجي.',
      step4Title: 'تنزيل النتيجة فوراً',
      step4Desc: 'احصل على ملفك المعالج بدقة وسلامة رقمية مؤكدة.',
    },
    footer: {
      rights: 'AHADEX TOOLS. جميع الحقوق محفوظة.',
      legal: 'منصة ويب ذات أولوية للخصوصية مصممة لاحتياجات العصر الحديث.',
      platformStatus: 'حالة النظام',
      statusOperational: 'جميع وحدات المعالجة تعمل بكفاءة',
      newsletterTitle: 'ابقَ على اطلاع بأحدث الأدوات',
      newsletterDesc: 'احصل على إشعارات فور إضافة أدوات جديدة للمستندات والبرمجة.',
      subscribe: 'أبلغني بالجديد',
      subscribeSuccess: 'شكراً لك! سيتم إشعارك بجديد AHADEX TOOLS.',
    },
  },
};
