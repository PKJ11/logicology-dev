export type TierId = 1 | 2 | 3 | 4;

export interface Tier {
  id: TierId;
  name: string;
  price: number;
  features: string[];
  description: string;
  color: string;
}
export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
} 
export interface ContentItem {
  id: string;
  _id?: string; // For MongoDB documents
  title: string;
  description: string;
  type: 'worksheet' | 'wordwall' | 'game' | 'mindstamp' | 'assessment' | 'external_link';
  tierId: TierId;
  url?: string;
  thumbnail?: string;
  category: string;
  externalLink?: string;
  embedCode?: string;
  wordwallHeader?: string;
  files?: UploadedFile[];
  urls?: string[];
  fileCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  createdByEmail?: string;
}

export interface UserSubscription {
  userId: string;
  tierId: TierId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  paymentId?: string;
  autoRenew: boolean;
}



export const CONTENT_ITEMS: ContentItem[] = [
  // Tier 1 - Worksheets
  {
    id: 'ws-1',
    title: 'Maze Games',
    description: 'Navigate through challenging mazes',
    type: 'worksheet',
    tierId: 1,
    category: 'Worksheets',
    thumbnail: '/thumbnails/maze.jpg'
  },
  {
    id: 'ws-2',
    title: 'Country Word Search',
    description: 'Discover countries from around the world',
    type: 'worksheet',
    tierId: 1,
    category: 'Worksheets',
    thumbnail: '/thumbnails/wordsearch.jpg'
  },
  {
    id: 'ws-3',
    title: 'Colouring Activity',
    description: 'Express creativity with coloring pages',
    type: 'worksheet',
    tierId: 1,
    category: 'Worksheets',
    thumbnail: '/thumbnails/coloring.jpg'
  },
  {
    id: 'ws-4',
    title: 'Find My Kite',
    description: 'Visual search puzzles',
    type: 'worksheet',
    tierId: 1,
    category: 'Worksheets',
    thumbnail: '/thumbnails/kite.jpg'
  },
  {
    id: 'ws-5',
    title: 'Crack The Zoo Codes',
    description: 'Decipher secret codes',
    type: 'worksheet',
    tierId: 1,
    category: 'Worksheets',
    thumbnail: '/thumbnails/zoo.jpg'
  },

  // Tier 2 - Wordwall & Games
  {
    id: 'ww-1',
    title: 'Math Word Wall',
    description: 'Interactive math vocabulary',
    type: 'wordwall',
    tierId: 2,
    category: 'Wordwall',
    externalLink: 'https://wordwall.net/resource/123',
    thumbnail: '/thumbnails/wordwall.jpg'
  },
  {
    id: 'game-1',
    title: 'Number Patterns Game',
    description: 'Learn number sequences',
    type: 'game',
    tierId: 2,
    category: 'Interactive Games',
    embedCode: '<iframe src="https://games.example.com/numbers" width="100%" height="500"></iframe>'
  },
  {
    id: 'game-2',
    title: 'Logic Puzzles',
    description: 'Solve challenging puzzles',
    type: 'game',
    tierId: 2,
    category: 'Interactive Games',
    thumbnail: '/thumbnails/puzzle.jpg'
  },

  // Tier 3 - Mindstamp Videos
  {
    id: 'video-1',
    title: 'Introduction to Algebra',
    description: 'Learn algebra basics with interactive quizzes',
    type: 'mindstamp',
    tierId: 3,
    category: 'Mindstamp Videos',
    embedCode: '<iframe src="https://player.mindstamp.com/video/123" width="100%" height="500"></iframe>'
  },
  {
    id: 'video-2',
    title: 'Geometry Fundamentals',
    description: 'Interactive geometry lessons',
    type: 'mindstamp',
    tierId: 3,
    category: 'Mindstamp Videos',
    thumbnail: '/thumbnails/geometry.jpg'
  },

  // Tier 4 - Assessments
  {
    id: 'assess-1',
    title: 'Math Skills Assessment',
    description: 'Comprehensive math evaluation',
    type: 'assessment',
    tierId: 4,
    category: 'Assessments',
    externalLink: '/assessments/math-1'
  },
  {
    id: 'assess-2',
    title: 'Logic & Reasoning Test',
    description: 'Test your problem-solving skills',
    type: 'assessment',
    tierId: 4,
    category: 'Assessments',
    thumbnail: '/thumbnails/assessment.jpg'
  }
];