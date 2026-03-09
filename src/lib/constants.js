// D-Armada Global — Theme Constants
// These match tailwind.config.js for use in inline styles or non-Tailwind contexts

export const colors = {
  brand: { DEFAULT: '#20B2AA', dark: '#1C9E97', light: '#5CD6D0' },
  surface: { bg: '#0A1212', 1: '#0F1A1A', 2: '#152222', 3: '#1C2E2E' },
  border: '#1A302E',
  text: { primary: '#B2D7D2', secondary: '#7A9E99', muted: '#436660', bright: '#E0F0ED' },
  profit: '#34D399',
  loss: '#F87171',
  caution: '#FBBF24',
};

export const POST_CATEGORIES = [
  { value: 'research', label: 'Market Research' },
  { value: 'blog', label: 'Blog' },
  { value: 'strategy', label: 'Strategy' },
  { value: 'risk-framework', label: 'Risk Framework' },
  { value: 'macro-context', label: 'Macro Context' },
  { value: 'tech-lab', label: 'Technology Lab' },
  { value: 'course', label: 'Course' },
  { value: 'live-session', label: 'Live Session' },
  { value: 'investor', label: 'Investor Relations' },
];

export const RESEARCH_SUBCATEGORIES = ['Macro', 'Commodities', 'Crypto', 'FX'];
export const STRATEGY_SUBCATEGORIES = ['Primary', 'Secondary', 'Conditional'];
export const COURSE_LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export const NAV_ITEMS = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'about', label: 'About', href: '/about' },
  {
    key: 'trading', 
    label: 'D-Armada Trading', 
    href: '/trading', 
    sub: [
      { label: 'Strategies', href: '/trading' }, // Fixed: Point to main hub
      { label: 'Markets Traded', href: '/trading' }, // Fixed: Point to main hub
      { label: 'Performance Reports', href: '/trading' }, // Fixed: Point to main hub
      { label: 'Risk Framework', href: '/trading' }, // Fixed: Point to main hub
    ]
  },
  {
    key: 'research', 
    label: 'D-Armada Research', 
    href: '/research', 
    sub: [
      { label: 'Market Research', href: '/research' }, 
      { label: 'Learn @ D-Armada', href: '/research' }, // Fixed: Point to research hub
    ]
  },
  {
    key: 'tech', 
    label: 'D-Armada Technologies', 
    href: '/tech', // Fixed: href must match the folder /tech
    sub: [
      { label: 'EA Performance', href: '/tech' }, // Fixed: Point to main hub
      { label: 'EA Shop', href: '/tech' },        // Fixed: Point to main hub
      { label: 'Technology Lab', href: '/tech' }, // Fixed: Point to main hub
    ]
  },
  { key: 'intel', label: 'Market Intelligence', href: '/intelligence' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'community', label: 'Community', href: '/community' },
  { key: 'investor', label: 'Investor Relations', href: '/investor' },
  { key: 'contact', label: 'Contact', href: '/contact' },
];