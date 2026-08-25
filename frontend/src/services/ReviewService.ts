import type { ReviewInterface } from '@/interfaces/ReviewInterface';
import { useReviewStore } from '@/stores/reviewstore.js';

export class ReviewService {
  static getReviewsByBookId(bookId: number): ReviewInterface[] {
    return useReviewStore().reviews.filter((review) => review.bookId === bookId);
  }

  static createReview(review: Omit<ReviewInterface, 'id' | 'createdAt'>): void {
    const store = useReviewStore();
    const nextId =
      store.reviews.length > 0 ? Math.max(...store.reviews.map((r) => r.id), 0) + 1 : 1;
    store.reviews.push({
      id: nextId,
      ...review,
      rating: Math.min(5, Math.max(1, review.rating)),
      createdAt: new Date().toISOString(),
    });
  }
}