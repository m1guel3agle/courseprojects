import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
  ) {}

  findAll(): Promise<Review[]> {
    return this.reviewsRepository.find();
  }

  findByBookId(bookId: number): Promise<Review[]> {
    return this.reviewsRepository.find({ where: { book: { id: bookId } } });
  }

  create(createReviewDto: CreateReviewDto): Promise<Review> {
    const { bookId, ...rest } = createReviewDto;
    const review = this.reviewsRepository.create({
      ...rest,
      book: { id: bookId },
    });

    return this.reviewsRepository.save(review);
  }
}
