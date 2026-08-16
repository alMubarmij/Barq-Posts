/** Simple two-language dictionary with {placeholder} interpolation. */

/**
 * Plural-aware template. `base` is the English template (uses {n}/{s}).
 * `one`/`two`/`few`/`many` are the Arabic plural categories:
 * 1 → one, 2 → two, 3–10 → few, 11+ → many.
 */
export type PluralForms = {
  base: string;
  one: string;
  two: string;
  few: string;
  many: string;
};

export const en = {
  brand: {
    name: "Barq Post",
    tagline: "Barq · Telegram archive",
    home: "Barq home",
  },
  settings: {
    language: "Language",
    theme: "Theme",
    lightTheme: "Switch to light theme",
    darkTheme: "Switch to dark theme",
    textSize: "Post text size",
    textSizeSmall: "Small text",
    textSizeDefault: "Default text size",
    textSizeLarge: "Large text",
  },
  common: {
    signIn: "Sign in",
    getStarted: "Get started",
    openArchive: "Open archive",
    signOut: "Sign out",
    backToArchive: "Back to archive",
    cancel: "Cancel",
    close: "Close",
    refresh: "Refresh",
    newPost: "New post",
    clearFilters: "Clear filters",
    connectTelegram: "Connect Telegram",
    searchPlaceholder: "Search posts, links, tags…",
    copiedToClipboard: "Copied {what} to clipboard",
    copyFailed: "Could not copy — clipboard blocked in this browser",
    unknownError: "Unknown error",
    loading: "Loading…",
    edit: "Edit",
    delete: "Delete",
    save: "Save changes",
    saving: "Saving…",
    deleteTitle: "Delete this post?",
    deleteText: "It will be removed from your archive permanently. This can't be undone.",
    deleted: "Post deleted",
    deleteFailed: "Could not delete post",
    updated: "Post updated",
    updateFailed: "Could not update post",
    publicProfile: "Public archive",
    publicHint: "Anyone with the link can browse your archive",
    copyPublicLink: "Copy public link",
    viewPublic: "View public page",
    privateArchive: "Archive is private",
  },
  nav: {
    how: "How it works",
    features: "Features",
    tags: "Tags",
    archive: "Archive",
    telegram: "Telegram",
  },
  landing: {
    hero: {
      badge: "Telegram → your personal archive",
      title1: "Send it once.",
      title2: "Find it forever.",
      sub: "منشورات برقية turns Telegram into a personal archive. DM your bot a link, a note, or a snippet with #tags — it's published to your catalog instantly, classified, searchable, and yours alone.",
      ctaPrimary: "Open your archive",
      ctaSecondary: "See how it works",
      bullets: ["No dashboard to fill", "Free hosting ready", "Set up in 3 steps"],
      archived: "Archived just now",
      mockupNow: "now",
      mockupTitle: "How speed reading sharpens your thinking",
      mockupChip: "reading → 12 posts",
    },
    steps: {
      kicker: "How it works",
      title: "One message. One post. Done.",
      text: "Three steps between something you found and something you'll find again.",
      items: [
        {
          title: "Message the bot",
          text: "Open the chat with your bot and send anything — a link worth keeping, a thought, a snippet, or a note to yourself.",
        },
        {
          title: "It gets classified",
          text: "Links are bookmarked with their domain, your #hashtags are kept, and a title is derived automatically — del.icio.us style.",
        },
        {
          title: "Browse the archive",
          text: "The post lands in your catalog instantly. Search it, filter it by tag, or open its detail page — whenever you need it.",
        },
      ],
    },
    features: {
      kicker: "Features",
      title: "Bookmarking, done right",
      text: "The classification power of del.icio.us and diigo, rebuilt for how you actually save things today — inside Telegram.",
      items: [
        {
          title: "Link bookmarks",
          text: "Every URL you send becomes a clean bookmark with its domain and title — the way del.icio.us intended, without the public noise.",
        },
        {
          title: "Tag classification",
          text: "Explicit #tags and automatic domain tags keep everything organized, diigo-style. Filter by any tag in one click.",
        },
        {
          title: "Instant publishing",
          text: "No dashboards, no forms. A message in Telegram is a post in the archive before the confirmation reply arrives.",
        },
        {
          title: "Private by design",
          text: "The archive sits behind your sign-in. No public profile, no algorithm, no noise — just your own annotated internet.",
        },
        {
          title: "Search everything",
          text: "Full-text search across titles, notes, URLs and tags, so last week's link is three keystrokes away.",
        },
        {
          title: "Post from the web",
          text: "Not near your phone? Paste a URL or write a note directly in the app — it's tagged and archived just like a Telegram message.",
        },
      ],
    },
    tagsShowcase: {
      kicker: "Tag cloud",
      title: "Your archive, classified like the classics",
      text: "Every post keeps its #tags, and every link earns a domain tag automatically. The result is a living tag cloud that makes last quarter's research one click away.",
      cta: "Start archiving",
    },
    cta: {
      badge: "Free forever tier",
      title: "Your next useful link is {highlight}one DM away{highlight}",
      text: "Create a bot in two minutes, drop the token in, and start publishing. Every message you send to yourself is a bookmark you'll actually find later.",
      primary: "Get started",
      secondary: "Sign in to your archive",
    },
    footer: {
      builtOn: "Built on Telegram, Convex & free hosting — Vercel · Netlify · Cloudflare Pages",
      botFather: "BotFather",
    },
  },
  auth: {
    title: "Sign in to your archive",
    description:
      "Enter your email to log in or sign up — منشورات برقية is private, and the archive is yours alone.",
    emailPlaceholder: "name@example.com",
    or: "Or",
    guest: "Continue as guest",
    checkEmail: "Check your email",
    sentCode: "We've sent a code to {email}",
    verify: "Verify code",
    verifying: "Verifying...",
    noCode: "Didn't receive a code?",
    tryAgain: "Try again",
    differentEmail: "Use different email",
    securedBy: "Secured by",
    backToLanding: "Back to the landing page",
    sendFailed: "Failed to send verification code. Please try again.",
    otpInvalid: "The verification code you entered is incorrect.",
    guestFailed: "Failed to sign in as guest: {msg}",
  },
  dashboard: {
    feedTitle: "Archive",
    feedSubtitle: "Everything you've published — from Telegram or right here",
    types: { all: "All", links: "Links", notes: "Notes" },
    loading: "Loading your archive…",
    emptyNothing: "Nothing archived yet",
    emptyNoMatch: "Nothing matches",
    emptyText: "Message your Telegram bot with a link or a note — it lands here, tagged and ready. Or publish something right now.",
    emptyNoMatchText: "Try a different tag, type or search term.",
    tagsTitle: "Tags",
    tagsSubtitle: {
      base: "{n} tag{s} across your archive — click one to filter",
      one: "{n} tag{s} across your archive — click one to filter",
      two: "{n} tag{s} across your archive — click one to filter",
      few: "{n} tag{s} across your archive — click one to filter",
      many: "{n} tag{s} across your archive — click one to filter",
    },
    noTagsTitle: "No tags yet",
    noTagsText:
      "Tags appear here as you publish — use #hashtags in Telegram and links get domain tags automatically.",
    telegramSubtitle: "Connect your bot and start publishing from your phone",
    privateOwner: "Private archive owner",
    you: "You",
  },
  postCard: {
    viaTelegram: "via Telegram",
    addedManually: "added manually",
    openPost: "Open post",
    moreLinks: {
      base: "+{n} more links",
      one: "+1 more link",
      two: "+{n} more links",
      few: "+{n} more links",
      many: "+{n} more links",
    },
    moreLink: "+1 more link",
  },
  postDetail: {
    loading: "Loading post…",
    notFoundTitle: "Post not found",
    notFoundText: "This post doesn't exist or was never published. Head back to your archive.",
    linkBookmark: "Link bookmark",
    note: "Note",
    viaTelegram: "Via Telegram",
    addedManually: "Added manually",
    links: "Links",
    tags: "Tags",
    link: "link",
    text: "text",
    copyText: "Copy text",
    openLink: "Open link",
    copyLink: "Copy link",
  },
  composer: {
    title: "New post",
    description:
      "Publish a note or bookmark a link — tagged and archived instantly, just like Telegram.",
    fieldTitle: "Title",
    titlePlaceholder: "Optional — we'll derive one from the text or domain",
    fieldText: "Text",
    textPlaceholder: "A thought, a summary, a snippet worth keeping…",
    fieldUrl: "URL",
    urlPlaceholder: "https://… (paste a link to bookmark it)",
    fieldTags: "Tags",
    tagsPlaceholder: "dev, reading, #postgres (comma or space separated)",
    tagsHint: "A link earns its domain tag automatically.",
    willBeLink: "Will be archived as a link bookmark",
    willBeNote: "Will be archived as a note",
    chars: {
      base: "{n} chars",
      one: "{n} chars",
      two: "{n} chars",
      few: "{n} chars",
      many: "{n} chars",
    },
    publish: "Publish post",
    publishing: "Publishing…",
    toastPublished: "Published to your archive",
    toastBookmarked: "Bookmarked {domain}",
    toastNote: "Note archived",
    toastFailed: "Could not publish post",
    toastAddContent: "Add a note or a link to publish",
    titleEdit: "Edit post",
    editDescription: "Update the title, text, links or tags — the post keeps its place in the archive.",
  },
  telegramSetup: {
    connectionStatus: "Connection status",
    liveCheck: "Live check against Telegram",
    checking: "Checking Telegram connection…",
    statusFailed: "Status check failed",
    tokenNotConfigured: "Token not configured yet",
    addTokenHint: "Add {code} to the project keys, then hit refresh.",
    connectedAs: "Connected as @{username}",
    tokenAccepted: "Token accepted",
    webhookRegistered: "Webhook registered",
    webhookNotRegistered: "not registered",
    pendingOne: "1 pending update queued on Telegram.",
    pendingMany: {
      base: "{n} pending updates queued on Telegram.",
      one: "1 pending update queued on Telegram.",
      two: "{n} pending updates queued on Telegram.",
      few: "{n} pending updates queued on Telegram.",
      many: "{n} pending updates queued on Telegram.",
    },
    lastError: "Last webhook error: {msg}",
    setupTitle: "Set up in 3 steps",
    steps: [
      {
        title: "Create your bot",
        text: "Open @BotFather in Telegram and send /newbot. Copy the token it gives you.",
      },
      {
        title: "Add the token",
        text: "Paste the token into the project Keys as TELEGRAM_BOT_TOKEN (TELEGRAM_WEBHOOK_SECRET is optional).",
      },
      {
        title: "Register the webhook",
        text: "Hit the button below and Barq connects Telegram to your archive. Then just DM your bot.",
      },
    ],
    openBotFather: "Open BotFather",
    register: "Register webhook",
    registering: "Registering…",
    afterRegister:
      "After registering, message your bot in Telegram — every link or note you send is published to your archive instantly.",
    toastRegistered: "Webhook registered",
    toastFailed: "Could not register webhook",
    copyWebhookUrl: "Copy webhook URL",
    couldNotReach: "Could not reach the bot",
  },
  notFound: {
    title: "Page not found",
    text: "This link didn't land in your archive. Head back to the catalog.",
    back: "Back to the archive",
  },
  public: {
    badge: "Public archive",
    title: "Browse the public archive",
    subtitle: "Shared from منشورات برقية — a Telegram-powered personal archive.",
    privateTitle: "This archive is private",
    privateText:
      "The owner hasn't enabled the public view. Sign in to manage your own archive.",
    emptyTitle: "The archive is empty",
    emptyText: "Nothing has been published yet.",
    ownerCta: "Own this archive? Sign in to publish and manage it.",
    footer: "Built with منشورات برقية",
  },
};

export type Dict = typeof en;

export const ar: Dict = {
  brand: {
    name: "منشورات برقية",
    tagline: "برق · أرشيف تيليغرام",
    home: "الرئيسية",
  },
  settings: {
    language: "اللغة",
    theme: "المظهر",
    lightTheme: "التبديل إلى المظهر الفاتح",
    darkTheme: "التبديل إلى المظهر الداكن",
    textSize: "حجم نص المنشورات",
    textSizeSmall: "نص صغير",
    textSizeDefault: "حجم النص الافتراضي",
    textSizeLarge: "نص كبير",
  },
  common: {
    signIn: "تسجيل الدخول",
    getStarted: "ابدأ الآن",
    openArchive: "افتح الأرشيف",
    signOut: "تسجيل الخروج",
    backToArchive: "العودة إلى الأرشيف",
    cancel: "إلغاء",
    close: "إغلاق",
    refresh: "تحديث",
    newPost: "منشور جديد",
    clearFilters: "مسح الفلاتر",
    connectTelegram: "ربط تيليغرام",
    searchPlaceholder: "ابحث في المنشورات والروابط والوسوم…",
    copiedToClipboard: "نُسخ {what} إلى الحافظة",
    copyFailed: "تعذّر النسخ: الحافظة محجوبة في هذا المتصفح",
    unknownError: "خطأ غير متوقع، حاول مرة أخرى",
    loading: "جارٍ التحميل…",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ…",
    deleteTitle: "حذف هذا المنشور؟",
    deleteText: "سيُحذف المنشور نهائيًا من أرشيفك، ولا يمكن التراجع.",
    deleted: "حُذف المنشور",
    deleteFailed: "تعذّر حذف المنشور",
    updated: "حُدّث المنشور",
    updateFailed: "تعذّر تحديث المنشور",
    publicProfile: "الأرشيف العام",
    publicHint: "يمكن لأي شخص يملك الرابط تصفّح أرشيفك",
    copyPublicLink: "نسخ الرابط العام",
    viewPublic: "عرض الصفحة العامة",
    privateArchive: "الأرشيف خاص حاليًا",
  },
  nav: {
    how: "كيف يعمل",
    features: "المميزات",
    tags: "الوسوم",
    archive: "الأرشيف",
    telegram: "تيليغرام",
  },
  landing: {
    hero: {
      badge: "أرشيفك الشخصي عبر تيليغرام",
      title1: "أرسلها مرة واحدة.",
      title2: "واحتفظ بها إلى الأبد.",
      sub: "تُحوِّل منشورات برقية تيليغرام إلى أرشيف شخصي. أرسل للبوت رابطًا أو ملاحظة أو مقتطفًا مع #وسوم، فيُنشر فورًا في فهرسك مصنَّفًا وقابلًا للبحث، وهو لك وحدك.",
      ctaPrimary: "افتح أرشيفك",
      ctaSecondary: "كيف يعمل",
      bullets: ["لا لوحات تحكم لملئها", "استضافة مجانية جاهزة", "الإعداد في 3 خطوات"],
      archived: "نُشر للتو",
      mockupNow: "الآن",
      mockupTitle: "كيف تُحسِّن القراءة السريعة تفكيرك",
      mockupChip: "12 منشورًا في reading",
    },
    steps: {
      kicker: "كيف يعمل",
      title: "رسالة واحدة. منشور واحد. انتهى.",
      text: "ثلاث خطوات بين شيء وجدته وشيء ستعثر عليه مجددًا.",
      items: [
        {
          title: "راسل البوت",
          text: "افتح المحادثة مع بوتك وأرسل أي شيء: رابطًا يستحق الحفظ، فكرة، مقتطفًا، أو ملاحظة لنفسك.",
        },
        {
          title: "يُصنَّف تلقائيًا",
          text: "تُحفظ الروابط مع نطاقها، وتبقى وسومك كما كتبتها، ويُشتق العنوان تلقائيًا بأسلوب del.icio.us.",
        },
        {
          title: "تصفّح الأرشيف",
          text: "يصل المنشور إلى فهرسك فورًا. ابحث عنه، أو صفِّه بالوسم، أو افتح صفحة تفاصيله متى احتجت إليه.",
        },
      ],
    },
    features: {
      kicker: "المميزات",
      title: "حفظ الإشارات بالشكل الصحيح",
      text: "قوة التصنيف في del.icio.us وdiigo، أعيد بناؤها لتناسب طريقة حفظك اليوم، داخل تيليغرام.",
      items: [
        {
          title: "حفظ الروابط كإشارات مرجعية",
          text: "كل رابط ترسله يتحول إلى إشارة مرجعية نظيفة مع نطاقها وعنوانها، على طريقة del.icio.us، دون الضجيج العام.",
        },
        {
          title: "تصنيف بالوسوم",
          text: "وسومك الصريحة ووسوم النطاق التلقائية تُبقي كل شيء منظمًا بأسلوب diigo. صفِّ بأي وسم بنقرة واحدة.",
        },
        {
          title: "نشر فوري",
          text: "لا لوحات تحكم ولا نماذج. رسالة في تيليغرام تعني منشورًا في الأرشيف قبل وصول رسالة التأكيد.",
        },
        {
          title: "خصوصية بالتصميم",
          text: "الأرشيف محمي بتسجيل دخولك. لا ملف عام، لا خوارزميات، لا ضجيج، فقط إنترنتك الخاص المعلَّق عليه.",
        },
        {
          title: "ابحث في كل شيء",
          text: "بحث نصي كامل عبر العناوين والملاحظات والروابط والوسوم، ليكون رابط الأسبوع الماضي على بُعد ثلاث ضغطات.",
        },
        {
          title: "انشر من المتصفح",
          text: "لست قرب هاتفك؟ الصق رابطًا أو اكتب ملاحظة مباشرة في التطبيق، تُوسم وتُؤرشف تمامًا كرسالة تيليغرام.",
        },
      ],
    },
    tagsShowcase: {
      kicker: "سحابة الوسوم",
      title: "أرشيفك مصنَّف بأسلوب الكلاسيكيات",
      text: "يحتفظ كل منشور بوسومه، ويكسب كل رابط وسم نطاق تلقائيًا. النتيجة سحابة وسوم حيّة تجعل بحث الربع الماضي على بُعد نقرة.",
      cta: "ابدأ الأرشفة",
    },
    cta: {
      badge: "باقة مجانية إلى الأبد",
      title: "رابطك المفيد التالي على بُعد {highlight}رسالة واحدة{highlight}",
      text: "أنشئ بوتًا في دقيقتين، ضع الرمز، وابدأ النشر. كل رسالة ترسلها لنفسك إشارة مرجعية ستجدها لاحقًا.",
      primary: "ابدأ الآن",
      secondary: "سجّل الدخول إلى أرشيفك",
    },
    footer: {
      builtOn: "مبني على تيليغرام وConvex واستضافة مجانية: Vercel، Netlify، Cloudflare Pages",
      botFather: "BotFather",
    },
  },
  auth: {
    title: "سجّل الدخول إلى أرشيفك",
    description:
      "أدخل بريدك لتسجيل الدخول أو إنشاء حساب، وأرشيفك خاص بك وحدك.",
    emailPlaceholder: "name@example.com",
    or: "أو",
    guest: "المتابعة كضيف",
    checkEmail: "تحقق من بريدك",
    sentCode: "أُرسل رمز التحقق إلى {email}",
    verify: "تحقق من الرمز",
    verifying: "جارٍ التحقق…",
    noCode: "لم يصلك رمز؟",
    tryAgain: "حاول مجددًا",
    differentEmail: "استخدم بريدًا آخر",
    securedBy: "محمي بواسطة",
    backToLanding: "العودة إلى الصفحة الرئيسية",
    sendFailed: "تعذّر إرسال رمز التحقق. حاول مرة أخرى.",
    otpInvalid: "رمز التحقق الذي أدخلته غير صحيح.",
    guestFailed: "تعذّر تسجيل الدخول كضيف: {msg}",
  },
  dashboard: {
    feedTitle: "الأرشيف",
    feedSubtitle: "كل ما نشرته، من تيليغرام أو من هنا مباشرة",
    types: { all: "الكل", links: "الروابط", notes: "الملاحظات" },
    loading: "جارٍ تحميل أرشيفك…",
    emptyNothing: "لا شيء مؤرشف بعد",
    emptyNoMatch: "لا نتائج مطابقة",
    emptyText: "راسل بوت تيليغرام برابط أو ملاحظة، سيصل هنا موسومًا وجاهزًا. أو انشر شيئًا الآن.",
    emptyNoMatchText: "جرّب وسمًا أو نوعًا أو كلمة بحث مختلفة.",
    tagsTitle: "الوسوم",
    tagsSubtitle: {
      base: "{n} وسمًا في أرشيفك، اضغط أي وسم للتصفية",
      one: "وسم واحد في أرشيفك، اضغط للتصفية",
      two: "وسمان في أرشيفك، اضغط للتصفية",
      few: "{n} وسوم في أرشيفك، اضغط أي وسم للتصفية",
      many: "{n} وسمًا في أرشيفك، اضغط أي وسم للتصفية",
    },
    noTagsTitle: "لا وسوم بعد",
    noTagsText:
      "تظهر الوسوم هنا عند النشر؛ استخدم # في تيليغرام، وستحصل الروابط على وسوم نطاق تلقائيًا.",
    telegramSubtitle: "اربط بوتك وابدأ النشر من هاتفك",
    privateOwner: "مالك الأرشيف الخاص",
    you: "أنت",
  },
  postCard: {
    viaTelegram: "عبر تيليغرام",
    addedManually: "أُضيف يدويًا",
    openPost: "افتح المنشور",
    moreLinks: {
      base: "+{n} روابط أخرى",
      one: "+1 رابط آخر",
      two: "+رابطان آخران",
      few: "+{n} روابط أخرى",
      many: "+{n} رابطًا آخر",
    },
    moreLink: "+1 رابط آخر",
  },
  postDetail: {
    loading: "جارٍ تحميل المنشور…",
    notFoundTitle: "المنشور غير موجود",
    notFoundText: "هذا المنشور غير موجود أو لم يُنشر أبدًا. عد إلى أرشيفك.",
    linkBookmark: "إشارة مرجعية",
    note: "ملاحظة",
    viaTelegram: "عبر تيليغرام",
    addedManually: "أُضيف يدويًا",
    links: "الروابط",
    tags: "الوسوم",
    link: "الرابط",
    text: "النص",
    copyText: "نسخ النص",
    openLink: "فتح الرابط",
    copyLink: "نسخ الرابط",
  },
  composer: {
    title: "منشور جديد",
    description:
      "انشر ملاحظة أو احفظ رابطًا، يُوسم ويُؤرشف فورًا تمامًا كما في تيليغرام.",
    fieldTitle: "العنوان",
    titlePlaceholder: "اختياري، سنشتق عنوانًا من النص أو النطاق",
    fieldText: "النص",
    textPlaceholder: "فكرة، خلاصة، مقتطف يستحق الحفظ…",
    fieldUrl: "الرابط",
    urlPlaceholder: "https://… (الصق رابطًا لحفظه)",
    fieldTags: "الوسوم",
    tagsPlaceholder: "برمجة، قراءة، #postgres (مفصولة بفواصل أو مسافات)",
    tagsHint: "يحصل الرابط على وسم نطاق تلقائيًا.",
    willBeLink: "سيُؤرشف كإشارة مرجعية لرابط",
    willBeNote: "سيُؤرشف كملاحظة",
    chars: {
      base: "{n} حرفًا",
      one: "حرف واحد",
      two: "حرفان",
      few: "{n} أحرف",
      many: "{n} حرفًا",
    },
    publish: "نشر المنشور",
    publishing: "جارٍ النشر…",
    toastPublished: "نُشر منشورك في أرشيفك",
    toastBookmarked: "حُفظ الرابط {domain}",
    toastNote: "حُفظت الملاحظة في أرشيفك",
    toastFailed: "تعذّر نشر المنشور",
    toastAddContent: "أضف ملاحظة أو رابطًا للنشر",
    titleEdit: "تعديل المنشور",
    editDescription: "حدِّث العنوان أو النص أو الروابط أو الوسوم، ويبقى المنشور في مكانه داخل الأرشيف.",
  },
  telegramSetup: {
    connectionStatus: "حالة الاتصال",
    liveCheck: "فحص مباشر مع تيليغرام",
    checking: "جارٍ فحص اتصال تيليغرام…",
    statusFailed: "فشل فحص الحالة",
    tokenNotConfigured: "الرمز غير مضبوط بعد",
    addTokenHint: "أضف {code} إلى مفاتيح المشروع ثم اضغط تحديث.",
    connectedAs: "متصل باسم @{username}",
    tokenAccepted: "قُبل الرمز",
    webhookRegistered: "الويب هوك مسجّل",
    webhookNotRegistered: "غير مسجل",
    pendingOne: "تحديث معلق واحد في تيليغرام.",
    pendingMany: {
      base: "{n} تحديثات معلقة في تيليغرام.",
      one: "تحديث معلق واحد في تيليغرام.",
      two: "تحديثان معلقان في تيليغرام.",
      few: "{n} تحديثات معلقة في تيليغرام.",
      many: "{n} تحديثًا معلقًا في تيليغرام.",
    },
    lastError: "آخر خطأ في الويب هوك: {msg}",
    setupTitle: "الإعداد في 3 خطوات",
    steps: [
      {
        title: "أنشئ البوت",
        text: "افتح @BotFather في تيليغرام وأرسل /newbot، ثم انسخ الرمز.",
      },
      {
        title: "أضف الرمز",
        text: "الصق الرمز في مفاتيح المشروع باسم TELEGRAM_BOT_TOKEN (وTELEGRAM_WEBHOOK_SECRET اختياري).",
      },
      {
        title: "سجّل الويب هوك",
        text: "اضغط الزر أدناه ليربط بارق تيليغرام بأرشيفك، ثم راسل البوت.",
      },
    ],
    openBotFather: "افتح BotFather",
    register: "تسجيل الويب هوك",
    registering: "جارٍ التسجيل…",
    afterRegister:
      "بعد التسجيل، راسل بوتك في تيليغرام، وسيُنشر كل رابط أو ملاحظة ترسلها في أرشيفك فورًا.",
    toastRegistered: "الويب هوك مسجّل الآن",
    toastFailed: "تعذّر تسجيل الويب هوك",
    copyWebhookUrl: "نسخ رابط الويب هوك",
    couldNotReach: "تعذّر الوصول إلى البوت",
  },
  notFound: {
    title: "الصفحة غير موجودة",
    text: "هذا الرابط لم يصل إلى أرشيفك. عد إلى الفهرس.",
    back: "العودة إلى الأرشيف",
  },
  public: {
    badge: "أرشيف عام",
    title: "تصفّح الأرشيف العام",
    subtitle: "مُشارَك من منشورات برقية — أرشيف شخصي مدعوم بتيليغرام.",
    privateTitle: "هذا الأرشيف خاص",
    privateText:
      "لم يُفعِّل المالك العرض العام بعد. سجّل الدخول لإدارة أرشيفك الخاص.",
    emptyTitle: "الأرشيف فارغ",
    emptyText: "لم يُنشر أي شيء بعد.",
    ownerCta: "هذا أرشيفك؟ سجّل الدخول للنشر والإدارة.",
    footer: "مبني بواسطة منشورات برقية",
  },
};

export type Lang = "ar" | "en";

export const translations: Record<Lang, Dict> = { ar, en };

/** Replace {placeholders} in a template string. */
export function fmt(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

/** Plural-aware helper for "{n} tag{s}" style templates (English). */
export function plural(template: string, n: number): string {
  return template.replace("{n}", String(n)).replace("{s}", n === 1 ? "" : "s");
}

/**
 * Arabic plural categories: 1 → one, 2 → two, 3–10 → few, 11+ → many.
 * Returns the right form with {n} substituted.
 */
export function arPlural(forms: PluralForms, n: number): string {
  const template =
    n === 1 ? forms.one : n === 2 ? forms.two : n <= 10 ? forms.few : forms.many;
  return template.replace("{n}", String(n));
}
