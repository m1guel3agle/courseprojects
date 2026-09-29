import type { Relation } from 'typeorm';
import { Book } from './book.entity.js';
export declare class Review {
    id: number;
    book: Relation<Book>;
    bookId: number;
    rating: number;
    comment: string;
    author: string | null;
    createdAt: Date;
}
