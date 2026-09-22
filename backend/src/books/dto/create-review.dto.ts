export class CreateReviewDto {
  bookId: number;
  rating: number;
  comment: string;
  author?: string;
}
