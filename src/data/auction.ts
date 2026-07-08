// ============================================
// DATA LAYER — YORK SCREENPLAY
// Single source of truth for all content & config
// The untold story of York on the Lewis & Clark Expedition
// TODO: wire to Supabase for live auction data
// ============================================

import heroImage from '../assets/hero.png';
import hero1 from '../assets/hero1.png';
import hero2 from '../assets/hero2.png';
import hero3 from '../assets/hero3.png';

// ---- Types ----

export interface FilmData {
  title: string;
  titleLines: string[];
  logline: string;
  expandedPitch: string;
  genre: string;
  pageCount: number;
  draftStatus: string;
  tagline: string;
}

export interface AuctionConfig {
  currency: string;
  currencySymbol: string;
  startingBid: number;
  currentBid: number;
  minimumIncrement: number;
  bidsPlaced: number;
  leadingBidder: string;
  auctionEndDate: string; // ISO 8601
  termsNote: string;
  isLive: boolean;
}

export interface Creator {
  name: string;
  role: string;
  credit: string;
  bio: string;
  photoUrl: string;
}

export interface Contact {
  name: string;
  role: string;
  email?: string;
  phone?: string;
  social?: { platform: string; url: string }[];
}

export interface WhyPoint {
  number: string;
  title: string;
  description: string;
}

export interface RipReelData {
  videoUrl: string;
  videoType: 'youtube' | 'vimeo' | 'self-hosted';
  intro: string;
  pullQuotes: string[];
}

export interface ScriptData {
  googleDocsUrl: string;
  viewingTerms: string;
  teaserLines: string[];
}

export interface NavLink {
  label: string;
  path: string;
}

export interface TimelineEntry {
  timestamp: string;
  text: string;
}

// ---- Data ----

// TODO: wire to Supabase — film metadata
export const filmData: FilmData = {
  title: 'YORK',
  titleLines: ['YORK'],
  logline: 'Born into opposite worlds, two men form an unbreakable bond that transcends slavery and freedom. Bound by loyalty and tested by history, their journey across the American wilderness becomes one that will alter the course of a nation and reshape both of their destinies.',
  expandedPitch: 'They grew strong, loved, learned, and became men — until they were sent to a war they didn\'t understand, to fight an enemy they didn\'t hate. Then a president would send them on the greatest expedition in American history. A journey to explore an unknown wilderness, a journey that would alter the future of a country and change the destiny of both men. They returned heroes. But he returned to slavery. He demanded his freedom — to be part of a world that would refuse to accept him. He returned West and became a hero.',
  genre: 'Historical Epic / Drama',
  pageCount: 132,
  draftStatus: 'Final Draft',
  tagline: 'The untold story of the man who explored a nation that refused to free him.',
};

// TODO: wire to Supabase — real-time auction state
export const auctionConfig: AuctionConfig = {
  currency: 'USD',
  currencySymbol: '$',
  startingBid: 75000,
  currentBid: 185000,
  minimumIncrement: 5000,
  bidsPlaced: 22,
  leadingBidder: 'Bidder 0xA4',
  auctionEndDate: '2026-07-15T23:59:59-04:00',
  termsNote: 'All bids are binding offers. Final sale subject to terms and legal review. Full intellectual property rights transfer on close.',
  isLive: true,
};

// TODO: wire to Supabase — creator profiles
export const creators: Creator[] = [
  {
    name: 'Jon Stewart',
    role: 'Writer & Creator',
    credit: 'Written by',
    bio: 'Jon Stewart is a Deerfield, Illinois native, former candidate for Governor of Illinois, and former professional wrestler. An accomplished investigative producer, author, show-runner, and documentary filmmaker. He brings a singular blend of political insight, athletic discipline, and investigative rigor to his work as a screenwriter and television show writer.',
    photoUrl: 'https://res.cloudinary.com/dmhabztbf/image/upload/v1782803030/jon_stewarts_euyb5j.png',
  },
  {
    name: 'Thomas Ferraro',
    role: 'Co-Writer & Historian',
    credit: 'Co-written by',
    bio: 'Thomas Ferraro is a Chicago-area native, decorated law enforcement and security veteran, President of the Niles Historical Society, and published historian. He brings decades of real-world experience and a deep passion for American history to his work as a screenwriter.',
    photoUrl: 'https://res.cloudinary.com/dmhabztbf/image/upload/v1782803037/thomas_ylzkbd.jpg',
  },
];

// TODO: wire to Supabase — contact information
export const contacts: Contact[] = [
  {
    name: 'Jon Stewart',
    role: 'Writer & Creator',
    email: 'jon@yorkscreenplay.com',
    social: [
      { platform: 'Twitter / X', url: 'https://x.com/' },
      { platform: 'IMDb', url: 'https://imdb.com/' },
    ],
  },
  {
    name: 'Thomas Ferraro',
    role: 'Co-Writer & Historian',
    email: 'thomas@yorkscreenplay.com',
    social: [
      { platform: 'Twitter / X', url: 'https://x.com/' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/' },
    ],
  },
  {
    name: 'Rebecca Dunn',
    role: 'Literary Representative',
    email: 'rebecca@dunncreative.com',
    phone: '+1 (310) 555-0142',
    social: [],
  },
];

export const whyPoints: WhyPoint[] = [
  {
    number: '01',
    title: 'An untold chapter of American history',
    description: 'York\'s story has never been a major feature film. The first enslaved person to cross the continent — and the nation forgot his name. Until now.',
  },
  {
    number: '02',
    title: 'Two perspectives, one expedition',
    description: 'The friendship between Clark and York is the emotional spine. One man sees the frontier as destiny. The other sees it as the freedom he\'s been denied.',
  },
  {
    number: '03',
    title: 'Epic scope, intimate heart',
    description: 'Lewis & Clark is a blockbuster canvas — mountains, rivers, unknown wilderness. York\'s personal fight for freedom is the soul that makes it unforgettable.',
  },
  {
    number: '04',
    title: 'Proven creative team',
    description: 'Written by Emmy-nominated and Sundance-recognised writers with a track record of getting films made and stories seen.',
  },
  {
    number: '05',
    title: 'A story for this moment',
    description: 'Freedom, identity, the gap between what America promises and what it delivers. This isn\'t a period piece — it\'s a mirror held up to the present.',
  },
];

export const ripReelData: RipReelData = {
  videoUrl: 'https://www.youtube.com/embed/AuSne7VC404',
  videoType: 'youtube',
  intro: 'A proof of tone — capturing the vast American wilderness and the intimate human story at the heart of York\'s journey.',
  pullQuotes: [
    '"The kind of story America forgot to tell itself. Until now." — Private Screening Note',
    '"Epic in scope, devastating in its intimacy. This is prestige cinema." — Industry Reader',
  ],
};

export const timelineEntries: TimelineEntry[] = [
  { timestamp: '0:00', text: 'Two boys — one free, one slave — would form a friendship that defied the rules.' },
  { timestamp: '0:13', text: 'They grew strong, loved, learned, and became men.' },
  { timestamp: '0:23', text: 'Until they were sent to a war they didn\'t understand, to fight an enemy they didn\'t hate.' },
  { timestamp: '0:35', text: 'Then a president would send them on the greatest expedition in American history.' },
  { timestamp: '0:44', text: 'A journey that would alter the future of a country and change the destiny of both men.' },
  { timestamp: '0:52', text: 'A journey to explore an unknown wilderness.' },
  { timestamp: '1:20', text: 'They returned.' },
  { timestamp: '1:27', text: 'Heroes — but he returned to slavery.' },
  { timestamp: '1:36', text: 'He demanded his freedom — to be part of a world that would refuse to accept him.' },
  { timestamp: '1:52', text: 'He returned West and became a hero.' },
];

// TODO: wire to Supabase — script access
export const scriptData: ScriptData = {
  googleDocsUrl: '#',
  viewingTerms: 'This screenplay is provided for evaluation by serious bidders only. By accessing this document, you agree not to copy, distribute, or share its contents. All rights reserved.',
  teaserLines: [
    'FADE IN:',
    '',
    'EXT. VIRGINIA PLANTATION — DAWN — 1793',
    '',
    'Two boys run through a tobacco field.',
    'One white. One Black. Both laughing.',
    '',
    '                    YORK (V.O.)',
    '          We didn\'t know what we were yet.',
    '          We only knew what we had.',
    '',
    'They reach the creek. They stop. They breathe.',
    '',
    '                    YORK (V.O.) (CONT\'D)',
    '          Each other.',
  ],
};

export const navLinks: NavLink[] = [
  { label: 'The Beginning', path: '/' },
  { label: 'The Expedition', path: '/rip-reel' },
  { label: 'The Manuscript', path: '/script' },
  { label: 'Correspondence', path: '/contact' },
];

export const heroMediaUrls: string[] = [heroImage, hero1, hero2, hero3];
export const logoUrl: string = 'https://res.cloudinary.com/dmhabztbf/image/upload/v1781511206/ChatGPT_Image_Jun_15_2026_01_39_22_PM_mbaqbe.png';
export const audioUrl: string = 'https://res.cloudinary.com/dmhabztbf/video/upload/v1782803855/The_Last_of_the_Mohicans_-_Promentory_Main_Theme_rl1fqk.mp3'; // The Last of the Mohicans — Promentory Main Theme

export const socialLinks = {
  twitter: 'https://x.com/JonStewartIL',
  email: 'jonalanstewart@aol.com',
};

// ---- Binding Bid Agreement ----
// Shown at the top of the bid modal, directly above the input fields.
export const bidAgreement = {
  title: 'Binding Bid Agreement',
  paragraphs: [
    'By submitting a bid on any screenplay listed on this platform, you acknowledge and agree that your bid constitutes a legally binding offer to purchase or option the screenplay under the terms of your bid.',
    'If the screenplay owner accepts your bid, a legally enforceable agreement is created between the bidder and the screenplay owner, subject to the execution of any required final transaction documents.',
    'The screenplay owner is under no obligation to accept any bid and reserves the sole and absolute right to accept, reject, or negotiate any offer for any reason. No sale, option, or transfer of rights shall occur unless and until the screenplay owner formally accepts the bid.',
    'By placing a bid, you represent that you have the legal authority and financial ability to complete the transaction if your bid is accepted.',
  ],
  consentLabel: 'I have read and agree to the Binding Bid Agreement above.',
};
