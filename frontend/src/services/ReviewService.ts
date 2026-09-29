import type { ReviewInterface } from '@/interfaces/ReviewInterface';
import axios from 'axios';

export class ReviewService {
  private static readonly API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/reviews`;

  static async getReviews(): Promise<ReviewInterface[]> {
    const { data } = await axios.get(this.API_URL);
    return data;
  }

  static async getReviewsByBookId(bookId: number): Promise<ReviewInterface[]> {
    const { data } = await axios.get(`${this.API_URL}/book/${bookId}`);
    return data;
  }

  static async createReview(review: Omit<ReviewInterface, 'id'>): Promise<ReviewInterface> {
    const { data } = await axios.post(this.API_URL, review);
    return data;
  }
}
