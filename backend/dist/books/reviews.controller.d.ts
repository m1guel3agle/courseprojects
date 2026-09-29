import { ReviewsService } from './reviews.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { Review } from './entities/review.entity.js';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    findAll(): Promise<Review[]>;
    findByBookId(bookId: string): Promise<Review[]>;
    create(createReviewDto: CreateReviewDto): Promise<Review>;
}
