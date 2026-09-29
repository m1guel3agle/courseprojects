var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity.js';
let ReviewsService = class ReviewsService {
    reviewsRepository;
    constructor(reviewsRepository) {
        this.reviewsRepository = reviewsRepository;
    }
    findAll() {
        return this.reviewsRepository.find();
    }
    findByBookId(bookId) {
        return this.reviewsRepository.find({ where: { book: { id: bookId } } });
    }
    create(createReviewDto) {
        const { bookId, ...rest } = createReviewDto;
        const review = this.reviewsRepository.create({
            ...rest,
            book: { id: bookId },
        });
        return this.reviewsRepository.save(review);
    }
};
ReviewsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Review)),
    __metadata("design:paramtypes", [Repository])
], ReviewsService);
export { ReviewsService };
//# sourceMappingURL=reviews.service.js.map