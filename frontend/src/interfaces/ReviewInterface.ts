export interface ReviewInterface {
  id: number;
  bookId: number;
  rating: number;
  comment: string;
  author?: string;
  createdAt?: string;
}
