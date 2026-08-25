import type { ReviewInterface } from '@/interfaces/ReviewInterface';

export const reviewSeeder: ReviewInterface[] = [
  { id: 1, bookId: 1, rating: 5, comment: 'A timeless classic. Beautiful prose.', author: 'Jane Doe' },
  { id: 2, bookId: 1, rating: 4, comment: 'Great story, a bit slow in the middle.', author: 'John Smith' },
  { id: 3, bookId: 2, rating: 5, comment: 'Essential reading for every developer.', author: 'Alice Dev' },
  { id: 4, bookId: 2, rating: 4, comment: 'Clear and practical advice.', author: 'Bob Coder' },
  { id: 5, bookId: 3, rating: 5, comment: 'Mind-blowing perspective on human history.', author: 'Carol Reader' },
];